import os
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db.database import supabase
from app.models.schemas import SubscribeRequest, SubscribeResponse, VerifyOTPRequest
from app.services.email_service import send_otp_email
from app.services.otp_service import generate_and_store_otp, verify_otp
from app.services.iss_tracker import _reverse_geocode

import httpx
import logging


router  = APIRouter()
limiter = Limiter(key_func=get_remote_address)

GEOCODE_CITY_URL = "https://nominatim.openstreetmap.org/search"


@router.post("/subscribe", response_model=SubscribeResponse)
@limiter.limit("5/minute")
async def subscribe(request: Request, body: SubscribeRequest):
    """
    Step 1: Accept email + city + country.
    Resolve city to lat/lng, store an unverified subscriber row,
    generate an OTP, and email it.
    """
    email       = body.email.lower().strip()
    name        = body.name.strip()
    city        = body.city.strip()
    country     = body.country.strip()
    alert_mode  = body.alert_mode

    existing = (
        supabase.table("subscribers")
        .select("id, is_verified, alert_sent")
        .eq("email", email)
        .execute()
    )

    if existing.data:
        row = existing.data[0]
        if row["is_verified"] and not row["alert_sent"]:
            raise HTTPException(
                status_code=409,
                detail="This email already has a pending alert. Check your inbox or cancel it first.",
            )
        supabase.table("subscribers").delete().eq("email", email).execute()


    lat, lng = await _geocode_city(city, country)

    supabase.table("subscribers").insert({
        "email":            email,
        "name":             name,
        "city":             city,
        "country":          country,
        "lat":              lat,
        "lng":              lng,
        "is_verified":      False,
        "alert_sent":       False,
        "alert_mode":       alert_mode,
        "alert_expires_at": (
            (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
            if alert_mode == "recurring" else None
        ),
        "alert_count_sent": 0,
    }).execute()

    code = generate_and_store_otp(email)
    send_otp_email(email, code)

    return SubscribeResponse(message="Verification code sent. Please check your inbox.")


@router.post("/verify-otp", response_model=SubscribeResponse)
@limiter.limit("10/minute")
async def verify_otp_route(request: Request, body: VerifyOTPRequest):
    """
    Step 2: Verify the 6-digit OTP.
    On success, marks the subscriber as verified so the scheduler picks them up.
    """
    email = body.email.lower().strip()
    code  = body.code.strip()

    valid, reason = verify_otp(email, code)

    if not valid:
        raise HTTPException(status_code=400, detail=reason)

    supabase.table("subscribers").update({
        "is_verified":  True,
        "verified_at":  datetime.now(timezone.utc).isoformat(),
    }).eq("email", email).execute()

    return SubscribeResponse(
        message="Email verified. You will receive one alert when the ISS is overhead."
    )


@router.get("/cancel")
async def cancel_alert(token: str):
    """
    One-click cancel via the link in the alert email.
    Deletes the subscriber row identified by the cancel_token UUID.
    Returns a plain success message regardless of whether the token existed,
    to avoid leaking information about which tokens are valid.
    """
    if not token:
        raise HTTPException(status_code=400, detail="Invalid token.")

    supabase.table("subscribers").delete().eq("cancel_token", token).execute()

    return {"message": "Your alert has been cancelled and your data removed."}


@router.post("/resend-otp", response_model=SubscribeResponse)
@limiter.limit("3/minute")
async def resend_otp(request: Request, body: dict):
    """Resends a fresh OTP to the given email, if a pending subscriber exists."""
    email = str(body.get("email", "")).lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")

    existing = (
        supabase.table("subscribers")
        .select("id, is_verified")
        .eq("email", email)
        .execute()
    )

    if not existing.data or existing.data[0]["is_verified"]:
        return SubscribeResponse(message="If that email has a pending alert, a new code has been sent.")

    code = generate_and_store_otp(email)
    send_otp_email(email, code)

    return SubscribeResponse(message="A new verification code has been sent.")


async def _geocode_city(city: str, country: str) -> tuple[float, float]:
    """Resolves a city name to (lat, lng) using Nominatim. Raises on failure."""
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(
                    GEOCODE_CITY_URL,
                    params={
                        "city":    city,
                        "country": country,
                        "format":  "json",
                        "limit":   1,
                    },
                    headers={"User-Agent": "ISSOverhead/1.0 (personal project)"},
                )
                resp.raise_for_status()
                results = resp.json()

            if not results:
                raise HTTPException(
                    status_code=422,
                    detail=f"Could not find '{city}, {country}'. Please check the city name.",
                )

            return float(results[0]["lat"]), float(results[0]["lon"])

        except HTTPException:
            raise
        except Exception:
            if attempt < 2:
                await asyncio.sleep(1)
            continue

    raise HTTPException(
        status_code=503,
        detail="Location lookup is temporarily unavailable. Please try again.",
    )