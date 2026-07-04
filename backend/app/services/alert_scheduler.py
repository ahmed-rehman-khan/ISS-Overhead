import asyncio
import logging
from datetime import datetime, timezone, timedelta

import httpx

from app.db.database import supabase
from app.services.email_service import send_alert_email
from app.services.otp_service import delete_expired_otps

logger = logging.getLogger(__name__)

ISS_API_URL     = "http://api.open-notify.org/iss-now.json"
OVERHEAD_RADIUS = 3.0   
CHECK_INTERVAL  = 15    
NIGHT_REQUIRED  = True  
SUNRISE_API     = "https://api.sunrise-sunset.org/json"


async def start_scheduler() -> None:
    """
    Long-running background task. Runs forever, checking the ISS position
    against all verified, unalerted subscribers every CHECK_INTERVAL seconds.
    Also cleans up expired OTP rows once per minute.
    """
    logger.info("Alert scheduler started.")
    cleanup_counter = 0

    while True:
        try:
            await _check_all_subscribers()
        except Exception as exc:
            logger.error(f"Scheduler error during subscriber check: {exc}")

        cleanup_counter += 1
        if cleanup_counter >= 4:  
            try:
                delete_expired_otps()
            except Exception as exc:
                logger.error(f"OTP cleanup error: {exc}")
            cleanup_counter = 0

        await asyncio.sleep(CHECK_INTERVAL)


async def _check_all_subscribers() -> None:
    """Fetch ISS position, then check every verified subscriber."""
    iss = await _fetch_iss_position()
    if iss is None:
        return

    iss_lat, iss_lng = iss
    now = datetime.now(timezone.utc)

    result = (
        supabase.table("subscribers")
        .select("id, email, name, city, country, lat, lng, cancel_token, alert_mode, alert_count_sent, alert_expires_at, last_alert_sent_at")
        .eq("is_verified", True)
        .eq("alert_sent", False)
        .execute()
    )

    subscribers = result.data or []

    for sub in subscribers:
        try:
            await _check_subscriber(sub, iss_lat, iss_lng, now)
        except Exception as exc:
            logger.error(f"Error processing subscriber {sub['email']}: {exc}")


async def _check_subscriber(sub: dict, iss_lat: float, iss_lng: float, now: datetime) -> None:
    """Send alert if ISS is overhead and it is night at the subscriber's location."""
    sub_lat = sub["lat"]
    sub_lng = sub["lng"]

    lat_match = abs(iss_lat - sub_lat) <= OVERHEAD_RADIUS
    lng_match = abs(iss_lng - sub_lng) <= OVERHEAD_RADIUS

    if not (lat_match and lng_match):
        return

    if NIGHT_REQUIRED and not await _is_night(sub_lat, sub_lng):
        return

    if sub.get("last_alert_sent_at"):
        last_sent = datetime.fromisoformat(sub["last_alert_sent_at"])
        if (now - last_sent).total_seconds() < 6 * 3600:
            logger.info(f"Skipping {sub['email']} — cooldown active")
            return

    alert_mode        = sub.get("alert_mode", "once")
    alert_count_sent  = (sub.get("alert_count_sent") or 0) + 1
    alert_expires_at  = sub.get("alert_expires_at")

    if alert_mode == "recurring" and alert_expires_at:
        expires = datetime.fromisoformat(alert_expires_at)
        if now > expires:
            supabase.table("subscribers").update({
                "alert_sent":     True,
                "alert_sent_at":  now.isoformat(),
            }).eq("id", sub["id"]).execute()
            logger.info(f"Recurring subscription expired for {sub['email']}")
            return

    is_done = alert_mode == "once"

    supabase.table("subscribers").update({
        "alert_sent":         is_done,
        "alert_sent_at":      now.isoformat() if is_done else None,
        "last_alert_sent_at": now.isoformat(),
        "alert_count_sent":   alert_count_sent,
    }).eq("id", sub["id"]).execute()

    send_alert_email(
        to_email=sub["email"],
        name=sub["name"],
        city=sub["city"],
        country=sub["country"],
        cancel_token=sub["cancel_token"],
        alert_mode=alert_mode,
        alert_count_sent=alert_count_sent,
        alert_expires_at=alert_expires_at,
    )

    logger.info(f"Alert sent to {sub['email']} ({sub['city']}, {sub['country']}) — {alert_mode} #{alert_count_sent}")

    
async def _fetch_iss_position() -> tuple[float, float] | None:
    for attempt in range(2):
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                resp = await client.get(ISS_API_URL)
                resp.raise_for_status()
                data = resp.json()
            return (
                float(data["iss_position"]["latitude"]),
                float(data["iss_position"]["longitude"]),
            )
        except httpx.TimeoutException as exc:
            logger.warning(f"ISS API timeout (attempt {attempt + 1}/2): {type(exc).__name__}")
        except httpx.HTTPStatusError as exc:
            logger.warning(f"ISS API HTTP error (attempt {attempt + 1}/2): status {exc.response.status_code}")
        except Exception as exc:
            logger.warning(f"ISS API unexpected error (attempt {attempt + 1}/2): {type(exc).__name__}: {exc}")
        if attempt == 0:
            await asyncio.sleep(3)
    return None


async def _is_night(lat: float, lng: float) -> bool:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                SUNRISE_API,
                params={"lat": lat, "lng": lng, "formatted": 0},
            )
            resp.raise_for_status()
            results = resp.json()["results"]

        from datetime import datetime, timezone
        now_utc = datetime.now(timezone.utc)

        sunrise_str = results["sunrise"]  
        sunset_str  = results["sunset"]

        sunrise_utc = datetime.fromisoformat(sunrise_str)
        sunset_utc  = datetime.fromisoformat(sunset_str)

        return now_utc <= sunrise_utc or now_utc >= sunset_utc

    except Exception as exc:
        logger.warning(f"Sunrise API error, defaulting to night=True: {type(exc).__name__}: {exc}")
        return True