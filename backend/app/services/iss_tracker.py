import httpx
import time
from app.models.schemas import ISSPosition

ISS_API_URL = "http://api.open-notify.org/iss-now.json"
GEOCODE_URL = "https://nominatim.openstreetmap.org/reverse"

ALTITUDE_KM       = 408.0
VELOCITY_KMS      = 7.66
ORBITAL_PERIOD    = 92.9

_location_cache: dict = {
    "lat": None,
    "lng": None,
    "name": "Unknown",
    "last_called": 0.0,
}
_last_known_position: dict | None = None

CACHE_DISTANCE = 2.0      
CACHE_MIN_SECS = 60.0     


async def get_iss_position() -> ISSPosition:
    global _last_known_position

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            iss_resp = await client.get(ISS_API_URL)
            iss_resp.raise_for_status()
            iss_data = iss_resp.json()
        lat = float(iss_data["iss_position"]["latitude"])
        lng = float(iss_data["iss_position"]["longitude"])
    except Exception:
        if _last_known_position:
            return _last_known_position
        raise

    location_name = await _get_cached_location(lat, lng)

    _last_known_position = ISSPosition(
        latitude=lat,
        longitude=lng,
        location_name=location_name,
        altitude_km=ALTITUDE_KM,
        velocity_kms=VELOCITY_KMS,
        orbital_period_min=ORBITAL_PERIOD,
    )
    return _last_known_position


async def _get_cached_location(lat: float, lng: float) -> str:
    global _location_cache

    now = time.time()
    cached_lat = _location_cache["lat"]
    cached_lng = _location_cache["lng"]
    last_called = _location_cache["last_called"]

    if (
        cached_lat is not None
        and cached_lng is not None
        and abs(lat - cached_lat) < CACHE_DISTANCE
        and abs(lng - cached_lng) < CACHE_DISTANCE
        and (now - last_called) < CACHE_MIN_SECS
    ):
        return _location_cache["name"]

    name = await _reverse_geocode(lat, lng)
    _location_cache = {
        "lat": lat,
        "lng": lng,
        "name": name,
        "last_called": now,
    }
    return name


async def _reverse_geocode(lat: float, lng: float) -> str:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                GEOCODE_URL,
                params={
                    "lat": lat,
                    "lon": lng,
                    "format": "json",
                    "zoom": 5,
                    "addressdetails": 1,
                    "accept-language": "en",
                },
                headers={"User-Agent": "ISSOverhead/1.0 (personal project)"},
            )
            resp.raise_for_status()
            data = resp.json()

        address = data.get("address", {})
        country = address.get("country", "")
        state   = address.get("state", address.get("region", ""))

        if state and country:
            return f"{state}, {country}"
        elif country:
            return country
        else:
            return _ocean_name(lat, lng)

    except Exception:
        return _ocean_name(lat, lng)


def _ocean_name(lat: float, lng: float) -> str:
    if lat > 60:
        return "Arctic Ocean"
    if lat < -60:
        return "Southern Ocean"
    if -30 < lng < 20 and -60 < lat < 30:
        return "Atlantic Ocean"
    if 20 < lng < 120 and -60 < lat < 30:
        return "Indian Ocean"
    return "Pacific Ocean"