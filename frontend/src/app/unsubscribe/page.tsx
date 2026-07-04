"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

type State = "loading" | "success" | "error" | "manual";

function UnsubscribeContent() {
  const params  = useSearchParams();
  const token   = params.get("token");
  const [state, setState]     = useState<State>(token ? "loading" : "manual");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const cancel = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
        const { data } = await axios.get(`${base}/cancel?token=${token}`);
        setMessage(data.message);
        setState("success");
      } catch {
        setMessage("That link may have already been used or has expired.");
        setState("error");
      }
    };

    cancel();
  }, [token]);

  return (
    <div className="max-w-[480px] w-full text-center">
      {state === "loading" && (
        <>
          <div className="w-14 h-14 rounded-full border border-accent/30 bg-accent/[0.05] flex items-center justify-center mx-auto mb-6 text-2xl">
            ⟳
          </div>
          <p className="font-mono text-[12px] text-accent tracking-widest uppercase mb-3">
            Cancelling...
          </p>
          <p className="text-[14px] text-text-secondary">
            Removing your alert request.
          </p>
        </>
      )}

      {state === "success" && (
        <>
          <div className="w-14 h-14 rounded-full border border-green-500/30 bg-green-500/[0.07] flex items-center justify-center mx-auto mb-6 text-2xl">
            ✓
          </div>
          <p className="font-mono text-[12px] text-green-400 tracking-widest uppercase mb-3">
            Done
          </p>
          <h1 className="text-[28px] font-extrabold tracking-tight mb-3">
            Alert cancelled
          </h1>
          <p className="text-[14px] text-text-secondary leading-[1.7] mb-8">
            {message} Your email address has been removed from our system.
          </p>
          <Link
            href="/"
            className="inline-block px-7 py-3 bg-accent text-space-black rounded-lg text-[14px] font-bold hover:bg-[#00b8d9] transition-colors"
          >
            Back to tracker
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <div className="w-14 h-14 rounded-full border border-red-500/30 bg-red-500/[0.07] flex items-center justify-center mx-auto mb-6 text-2xl">
            !
          </div>
          <p className="font-mono text-[12px] text-red-400 tracking-widest uppercase mb-3">
            Error
          </p>
          <h1 className="text-[28px] font-extrabold tracking-tight mb-3">
            Link not valid
          </h1>
          <p className="text-[14px] text-text-secondary leading-[1.7] mb-8">
            {message}
          </p>
          <Link href="/" className="text-[13px] text-accent hover:underline">
            Back to tracker
          </Link>
        </>
      )}

      {state === "manual" && (
        <>
          <div className="w-14 h-14 rounded-full border border-accent/30 bg-accent/[0.05] flex items-center justify-center mx-auto mb-6 text-2xl">
            ✕
          </div>
          <p className="font-mono text-[12px] text-accent tracking-widest uppercase mb-3">
            Unsubscribe
          </p>
          <h1 className="text-[28px] font-extrabold tracking-tight mb-3">
            Cancel your alert
          </h1>
          <p className="text-[14px] text-text-secondary leading-[1.7] mb-6">
            To cancel your alert subscription, use the unsubscribe link in the
            alert email you receive when the ISS passes overhead. It looks like
            this:{" "}
            <span className="font-mono text-accent text-[12px]">
              Unsubscribe
            </span>
            .
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-block px-7 py-3 bg-accent text-space-black rounded-lg text-[14px] font-bold hover:bg-[#00b8d9] transition-colors"
            >
              Back to tracker
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-space-black text-text-primary font-sans flex flex-col">
      <nav className="flex items-center justify-between px-10 py-[18px] border-b border-white/[0.06] bg-space-black/90">
        <Link href="/" className="text-[18px] font-extrabold tracking-tight">
          ISS<span className="text-accent">OVERHEAD</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <Suspense
          fallback={
            <p className="font-mono text-[12px] text-text-muted tracking-widest uppercase">
              Loading...
            </p>
          }
        >
          <UnsubscribeContent />
        </Suspense>
      </main>

      <footer className="flex items-center justify-center px-10 py-5 border-t border-white/[0.06]">
        <p className="font-mono text-[10px] text-text-muted tracking-[1px]">
          ISSOVERHEAD · AHMED REHMAN · 2025
        </p>
      </footer>
    </div>
  );
}
