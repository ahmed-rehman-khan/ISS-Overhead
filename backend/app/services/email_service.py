import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

GMAIL_USER     = os.environ["GMAIL_USER"]    
GMAIL_APP_PASS = os.environ["GMAIL_APP_PASS"]   
BASE_URL       = os.environ["BASE_URL"]         

logger = logging.getLogger(__name__)


def _send(to_email: str, subject: str, html_body: str) -> None:
    """
    Sends an HTML email via Gmail SMTP using an app password.
    Uses TLS on port 587.
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"ISS Overhead <{GMAIL_USER}>"
    msg["To"]      = to_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(GMAIL_USER, GMAIL_APP_PASS)
        server.sendmail(GMAIL_USER, to_email, msg.as_string())

    logger.info(f"Email sent to {to_email}: {subject}")


def send_otp_email(to_email: str, code: str) -> None:
    """Sends the 6-digit verification code to the user."""
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #04050a; color: #e8f0ff; border-radius: 12px;">
        <h2 style="margin: 0 0 8px; font-size: 22px; color: #ffffff;">Verify your email</h2>
        <p style="color: #7090b0; margin: 0 0 28px; font-size: 15px; line-height: 1.6;">
            Use the code below to confirm your ISS overhead alert. It expires in 15 minutes.
        </p>
        <div style="background: #0d1525; border: 1px solid rgba(0,212,255,0.2); border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <span style="font-family: monospace; font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #00d4ff;">{code}</span>
        </div>
        <p style="color: #3a5070; font-size: 12px; line-height: 1.6; margin: 0;">
            If you did not request this, ignore this email. No alert will be set up without entering the code.
        </p>
        <hr style="border: none; border-top: 1px solid rgba(80,160,255,0.1); margin: 24px 0;" />
        <p style="color: #3a5070; font-size: 11px; margin: 0;">
            ISS Overhead is an independent personal project. Not affiliated with NASA or any space organisation.
        </p>
    </div>
    """
    _send(to_email, "Your ISS Overhead verification code", html)


def send_alert_email(
    to_email: str,
    name: str,
    city: str,
    country: str,
    cancel_token: str,
    alert_mode: str = "once",
    alert_count_sent: int = 1,
    alert_expires_at: str | None = None,
) -> None:
    """Sends the ISS overhead alert to the user."""
    cancel_url = f"{BASE_URL}/unsubscribe?token={cancel_token}"

    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #04050a; color: #e8f0ff; border-radius: 12px;">
        <p style="font-family: monospace; font-size: 11px; color: #00d4ff; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 12px;">Live alert</p>
        <h2 style="margin: 0 0 8px; font-size: 24px; color: #ffffff;">Hi {name}, step outside and look up</h2>
        <p style="color: #7090b0; margin: 0 0 20px; font-size: 15px; line-height: 1.6;">
            The International Space Station is currently passing over
            <strong style="color: #e8f0ff;">{city}, {country}</strong>.
            It is visible to the naked eye and looks like a fast-moving bright star.
            It will cross the sky in roughly 2 to 5 minutes.
        </p>
        <p style="color: #3a5070; font-size: 12px; line-height: 1.6; margin: 0 0 24px;">
            Timing may not be perfectly exact. For best results, step outside immediately.
        </p>
        <hr style="border: none; border-top: 1px solid rgba(80,160,255,0.1); margin: 0 0 20px;" />
        <p style="color: #3a5070; font-size: 11px; line-height: 1.6; margin: 0;">
            You requested this alert via ISS Overhead.
            {f'<br/><br/>This is alert <strong style="color:#00d4ff;">#{alert_count_sent}</strong> from your 30-day subscription. Expires: {alert_expires_at[:10] if alert_expires_at else "N/A"}.' if alert_mode == "recurring" else ""}
            <br/><br/>
            <a href="{cancel_url}" style="color: #7090b0;">Unsubscribe</a>
        </p>
    </div>
    """
    _send(to_email, "The ISS is overhead right now", html)
