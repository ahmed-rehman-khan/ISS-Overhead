from pydantic import BaseModel, EmailStr, field_validator
import re


class SubscribeRequest(BaseModel):
    name: str
    email: EmailStr
    city: str
    country: str
    alert_mode: str = "once"

    @field_validator("alert_mode")
    @classmethod
    def valid_alert_mode(cls, v: str) -> str:
        if v not in ("once", "recurring"):
            raise ValueError("alert_mode must be 'once' or 'recurring'")
        return v

    @field_validator("name", "city", "country")
    @classmethod
    def no_empty_strings(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Field cannot be empty")
        if len(v) > 100:
            raise ValueError("Field is too long")
        if not re.match(r"^[\w\s\-'\.]+$", v):
            raise ValueError("Field contains invalid characters")
        return v


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str

    @field_validator("code")
    @classmethod
    def must_be_six_digits(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r"^\d{6}$", v):
            raise ValueError("Code must be exactly 6 digits")
        return v


class SubscribeResponse(BaseModel):
    message: str


class ISSPosition(BaseModel):
    latitude: float
    longitude: float
    location_name: str
    altitude_km: float
    velocity_kms: float
    orbital_period_min: float
