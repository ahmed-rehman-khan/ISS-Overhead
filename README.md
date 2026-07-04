# ISS Overhead

A real-time ISS tracker with one-time email alerts when the station passes over your location.

Built by Ahmed Rehman.

---

## 👤 Author

**Ahmed Rehman**  
*A Computer Science student synthesizing logic and imagination to find their common ground.*

- Portfolio: [ahmedrehman.vercel.app](https://ahmedrehman.vercel.app)
- LinkedIn: [ahmedurehman](https://www.linkedin.com/in/ahmedurehman)

---

## Project structure

```
iss-overhead/
├── frontend/   Next.js app, deployed to Vercel
└── backend/    FastAPI app, deployed to Oracle Cloud
```

---

## Architecture overview

```
Browser
  |
  |-- GET /api/iss-position (every 5s) ------> FastAPI
  |                                              |-- Open Notify API (ISS coords)
  |                                              |-- Nominatim (reverse geocode)
  |
  |-- POST /api/subscribe -------------------> FastAPI
  |                                              |-- Nominatim (city geocode)
  |                                              |-- Supabase (store subscriber)
  |                                              |-- Resend (send OTP email)
  |
  |-- POST /api/verify-otp -----------------> FastAPI
                                                 |-- Supabase (verify + activate)

Background scheduler (runs in FastAPI process)
  Every 15 seconds:
    |-- Open Notify (ISS position)
    |-- Supabase (get verified subscribers)
    |-- Check proximity + night condition
    |-- Resend (send alert email if overhead)
    |-- Supabase (mark alert_sent = true)
```

---

## Compliance notes

- Double opt-in: email verification required before alert is activated
- One-time alert: subscriber row deleted after alert is sent
- Unsubscribe link in every email
- OTP codes hashed with SHA-256, expire after 15 minutes
- Row Level Security enabled on all Supabase tables
- No exact GPS stored, only city-level coordinates
- Rate limiting on all API endpoints
- CORS restricted to frontend origin only
- No cookies, no analytics, no third-party tracking

---

## Disclaimer

Not affiliated with NASA or any space organisation. ISS position data sourced from the public Open Notify API. Alert timing may not be perfectly exact.
