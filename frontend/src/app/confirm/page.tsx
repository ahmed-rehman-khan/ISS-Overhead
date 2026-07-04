import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alert Confirmed | ISS Overhead",
};

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-space-black text-text-primary font-sans flex flex-col">
      <nav className="flex items-center px-10 py-[18px] border-b border-white/[0.06] bg-space-black/90">
        <Link href="/" className="text-[18px] font-extrabold tracking-tight">
          ISS<span className="text-accent">OVERHEAD</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-[440px] w-full text-center">
          <div className="w-16 h-16 rounded-full border border-green-500/30 bg-green-500/[0.07] flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <p className="font-mono text-[11px] text-green-400 tracking-[2px] uppercase mb-3">
            Confirmed
          </p>
          <h1 className="text-[30px] font-extrabold tracking-tight mb-3">
            You are all set
          </h1>
          <p className="text-[14px] text-text-secondary leading-[1.7] mb-8">
            Your ISS alert is now active. You will receive one email the next
            time the International Space Station passes over your city at night.
            Check that email for a cancel link if you change your mind.
          </p>
          <p className="text-[12px] text-text-muted mb-8 leading-[1.6]">
            The ISS completes an orbit every 90 minutes, but it may take
            multiple orbits before one passes directly over your location. Hang
            tight.
          </p>
          <Link
            href="/"
            className="inline-block px-7 py-3 bg-accent text-space-black rounded-lg text-[14px] font-bold hover:bg-[#00b8d9] transition-colors"
          >
            Watch it live
          </Link>
        </div>
      </main>

      <footer className="flex items-center justify-center px-10 py-5 border-t border-white/[0.06]">
        <p className="font-mono text-[10px] text-text-muted tracking-[1px]">
          ISSOVERHEAD · AHMED REHMAN · 2025
        </p>
      </footer>
    </div>
  );
}
