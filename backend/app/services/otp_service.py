import secrets
import hashlib
from datetime import datetime, timedelta, timezone

from app.db.database import supabase

OTP_EXPIRY_MINUTES = 15


def _hash_code(code: str) -> str:
    """SHA-256 hash of the plain code. Never store plain codes."""
    return hashlib.sha256(code.encode()).hexdigest()


def generate_and_store_otp(email: str) -> str:
    """
    Generates a 6-digit OTP, stores its hash in otp_codes,
    and returns the plain code to be emailed to the user.
    Any previous OTP for this email is deleted first.
    """
    supabase.table("otp_codes").delete().eq("email", email).execute()

    code = str(secrets.randbelow(900000) + 100000)  
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)

    supabase.table("otp_codes").insert({
        "email": email,
        "code_hash": _hash_code(code),
        "expires_at": expires_at.isoformat(),
    }).execute()

    return code


def verify_otp(email: str, code: str) -> tuple[bool, str]:
    """
    Returns (True, "ok") if the code is valid and not expired.
    Returns (False, reason) otherwise.
    The OTP row is deleted on successful verification.
    """
    result = (
        supabase.table("otp_codes")
        .select("*")
        .eq("email", email)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not result.data:
        return False, "No verification code found. Please request a new one."

    row = result.data[0]
    expires_at = datetime.fromisoformat(row["expires_at"])

    if datetime.now(timezone.utc) > expires_at:
        supabase.table("otp_codes").delete().eq("email", email).execute()
        return False, "Code has expired. Please request a new one."

    if row["code_hash"] != _hash_code(code):
        return False, "Incorrect code. Please try again."
    
    supabase.table("otp_codes").delete().eq("id", row["id"]).execute()
    return True, "ok"


def delete_expired_otps() -> None:
    """Cleanup job: removes all expired OTP rows. Called periodically."""
    supabase.table("otp_codes").delete().lt(
        "expires_at", datetime.now(timezone.utc).isoformat()
    ).execute()
