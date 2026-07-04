"use client";

import { useRef, useState } from "react";
import { verifyOTP, resendOTP } from "@/lib/api";

interface Props {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function OTPStep({ email, onSuccess, onBack }: Props) {
  const [digits, setDigits]     = useState<string[]>(Array(6).fill(""));
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [resent, setResent]     = useState(false);
  const inputRefs               = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);
    setError(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && digit) {
      const code = [...updated.slice(0, 5), digit].join("");
      if (code.length === 6) handleVerify(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      await verifyOTP(email, code);
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Verification failed. Please try again.");
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      setResent(true);
      setDigits(Array(6).fill(""));
      setError(null);
      setTimeout(() => setResent(false), 5000);
    } catch {
      setError("Could not resend. Please try again.");
    }
  };

  return (
    <div className="px-5 py-4 flex flex-col gap-3">
      <p className="text-[14px] font-bold text-text-primary">Check your inbox</p>
      <p className="text-[12px] text-text-secondary leading-[1.6]">
        A 6-digit code was sent to{" "}
        <strong className="text-text-primary font-semibold">{email}</strong>.
        Enter it below to confirm your alert.
      </p>

      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={loading}
            className="w-11 h-[52px] bg-white/[0.04] border border-glow-blue/30 rounded-lg text-center font-mono text-[20px] font-bold text-accent outline-none focus:border-accent transition-colors disabled:opacity-50"
          />
        ))}
      </div>

      {error && (
        <p className="text-[12px] text-red-400 text-center">{error}</p>
      )}

      {loading && (
        <p className="text-[12px] text-accent text-center font-mono tracking-widest">
          Verifying...
        </p>
      )}

      <p className="text-[11px] text-text-muted text-center">
        {resent ? (
          <span className="text-green-400">New code sent.</span>
        ) : (
          <>
            Didn&apos;t get it?{" "}
            <button
              onClick={handleResend}
              className="text-accent hover:underline"
            >
              Resend code
            </button>
          </>
        )}
      </p>

      <p className="text-[11px] text-text-muted text-center">
        Wrong email?{" "}
        <button onClick={onBack} className="text-accent hover:underline">
          Go back
        </button>
      </p>
    </div>
  );
}
