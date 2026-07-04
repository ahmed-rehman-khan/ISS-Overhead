"use client";

import { useRef, useState } from "react";
import { subscribe } from "@/lib/api";
import OTPStep from "./OTPStep";

type Step = "form" | "otp" | "success";

export default function AlertForm() {
  const [step, setStep]       = useState<Step>("form");
  const [alertMode, setAlertMode] = useState<"once" | "recurring">("once");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [city, setCity]       = useState("");
  const [country, setCountry] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef               = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim() || !email.trim() || !city.trim() || !country.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!consent) {
      setError("Please tick the consent checkbox to continue.");
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      await subscribe(name.trim(), email.trim(), city.trim(), country.trim(), alertMode);
      setStep("otp");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg.replace("Value error, ", "")).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="alert-form"
      ref={formRef}
      className="bg-[rgba(12,18,35,1)] border border-glow-blue/15 rounded-2xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 border-b border-glow-blue/15 text-[11px] sm:text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
          <path d="M6 1L7.5 4.5H11L8 7l1 4L6 9l-3 2 1-4-3-2.5h3.5L6 1Z" stroke="#7090b0" strokeWidth="0.8" fill="none" />
        </svg>
        <span className="hidden sm:inline">Alert Me When Overhead</span>
        <span className="sm:hidden">Get Alert</span>
      </div>

      {step === "form" && (
        <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-[5px]">
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.5px]">
                Alert frequency
              </label>
              <div className="group relative">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="cursor-help">
                  <circle cx="6" cy="6" r="5" stroke="#7090b0" strokeWidth="1"/>
                  <path d="M6 5v4M6 3.5v.5" stroke="#7090b0" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <div className="absolute bottom-5 left-0 w-[200px] bg-[#0d1525] border border-glow-blue/20 rounded-lg p-2.5 text-[11px] text-text-secondary leading-[1.5] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  There is a chance no alert is sent if the ISS does not pass over your location during this period.
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAlertMode("once")}
                className={`py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                  alertMode === "once"
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-white/[0.03] border-glow-blue/20 text-text-muted hover:border-glow-blue/40"
                }`}
              >
                Once
              </button>
              <button
                type="button"
                onClick={() => setAlertMode("recurring")}
                className={`py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                  alertMode === "recurring"
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-white/[0.03] border-glow-blue/20 text-text-muted hover:border-glow-blue/40"
                }`}
              >
                Every pass · 30 days
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-[5px]">
          <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.5px]">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            placeholder="Your name"
            className="bg-white/[0.04] border border-glow-blue/20 rounded-lg px-3 sm:px-[14px] py-2.5 sm:py-[10px] text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors"
          />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.5px]">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="you@example.com"
              className="bg-white/[0.04] border border-glow-blue/20 rounded-lg px-3 sm:px-[14px] py-2.5 sm:py-[10px] text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-[5px]">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.5px]">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => { setCity(e.target.value); setError(null); }}
                placeholder="Karachi"
                className="bg-white/[0.04] border border-glow-blue/20 rounded-lg px-3 sm:px-[14px] py-2.5 sm:py-[10px] text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.5px]">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => { setCountry(e.target.value); setError(null); }}
                placeholder="Pakistan"
                className="bg-white/[0.04] border border-glow-blue/20 rounded-lg px-3 sm:px-[14px] py-2.5 sm:py-[10px] text-[13px] text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 p-2.5 sm:p-3 bg-accent/[0.04] border border-accent/10 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => { setConsent(e.target.checked); setError(null); }}
              className="mt-[2px] w-[14px] h-[14px] accent-accent flex-shrink-0"
            />
            <span className="text-[11px] text-text-secondary leading-[1.5]">
              I agree to receive{" "}
              <strong className="text-text-primary">
                {alertMode === "once" ? "a one-time email" : "alerts for 30 days"}
              </strong>{" "}
              when the ISS is overhead at night. I can cancel anytime.{" "}
              <a href="/privacy" className="text-accent hover:underline" target="_blank">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          <div className="flex items-start gap-2 px-1">
          <span className="text-accent mt-[3px] flex-shrink-0">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#00d4ff" strokeWidth="1"/>
              <path d="M6 5v4M6 3.5v.5" stroke="#00d4ff" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </span>
          <p className="text-[11px] text-text-muted leading-[1.5]">
            Alerts are only sent when the ISS passes over your location at night,
            so it is visible to the naked eye.
          </p>
        </div>

          {error && (
            <p className="text-[12px] text-red-400">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg text-[13px] font-bold text-space-black flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #0080c8, #00d4ff)",
            }}
          >
            {loading ? (
              "Sending code..."
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="#04050a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Notify me
              </>
            )}
          </button>

          <p className="text-[10px] text-text-muted text-center leading-[1.4]">
            A 6-digit code will be sent to verify your email. One alert then you
            are removed automatically. Unsubscribe link included in every email.
          </p>
        </div>
      )}

      {step === "otp" && (
        <OTPStep
          email={email}
          onSuccess={() => setStep("success")}
          onBack={() => setStep("form")}
        />
      )}

      {step === "success" && (
        <div className="px-4 sm:px-5 py-6 sm:py-8 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-2xl">
            ✓
          </div>
          <p className="text-[15px] font-bold text-text-primary">You are all set</p>
          <p className="text-[13px] text-text-secondary leading-[1.6] max-w-[260px]">
            You will receive an email when the ISS passes over{" "}
            <strong className="text-text-primary">{city}</strong> at night. Check that
            email for a cancel link if you change your mind.
          </p>
          <button
            onClick={() => {
              setStep("form");
              setName("");
              setEmail("");
              setCity("");
              setCountry("");
              setConsent(false);
              setAlertMode("once");
              setError(null);
            }}
            className="mt-2 text-[11px] text-text-muted border-b border-dashed border-text-muted/50 hover:text-text-secondary transition-colors"
          >
            Set up another alert
          </button>
        </div>
      )}

      {step !== "success" && (
        <div className="flex justify-center pb-3 sm:pb-4">
          <a
            href="/unsubscribe"
            className="text-[10px] sm:text-[11px] text-text-muted border-b border-dashed border-text-muted/50 hover:text-text-secondary transition-colors"
          >
            Already signed up? Cancel your alert
          </a>
        </div>
      )}
    </div>
  );
}
