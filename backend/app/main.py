import asyncio
import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from dotenv import load_dotenv

from app.routes import alerts, iss
from app.services.alert_scheduler import start_scheduler

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(name)s  %(message)s",
)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="ISS Overhead API",
    description="Backend for the ISS Overhead tracker.",
    version="1.0.0",
    docs_url="/docs",     
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "https://iss-overhead.vercel.app",
        "https://issoverhead.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(iss.router,    prefix="/api", tags=["ISS"])
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])


@app.on_event("startup")
async def startup_event():
    """Start the background alert scheduler when the server boots."""
    asyncio.create_task(start_scheduler())
    logging.getLogger(__name__).info("ISS Overhead API is running.")


@app.get("/health")
async def health():
    return {"status": "ok"}
