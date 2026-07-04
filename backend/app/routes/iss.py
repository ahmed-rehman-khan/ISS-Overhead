from fastapi import APIRouter, HTTPException
from app.models.schemas import ISSPosition
from app.services.iss_tracker import get_iss_position

router = APIRouter()


@router.get("/iss-position", response_model=ISSPosition)
async def iss_position():
    """
    Returns the current ISS position with reverse-geocoded location name.
    Called by the frontend every 5 seconds.
    """
    try:
        return await get_iss_position()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"ISS data unavailable: {str(exc)}")
