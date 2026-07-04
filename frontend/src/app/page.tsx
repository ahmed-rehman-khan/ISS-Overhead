"use client";

import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Globe from "@/components/Globe";
import ISSStats from "@/components/ISSStats";
import CurrentPosition from "@/components/CurrentPosition";
import AlertForm from "@/components/AlertForm";
import Footer from "@/components/Footer";
import { useISSPosition } from "@/hooks/useISSPosition";
import Starfield from "@/components/Starfield";

export default function Home() {
  const { position, loading } = useISSPosition();
  const alertRef = useRef<HTMLDivElement>(null);

  const scrollToAlert = () => {
    alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-space-black">
      <Starfield />
      <Navbar />
      <Hero onGetAlert={scrollToAlert} />

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 px-4 lg:px-10 pb-10 max-w-[1200px] mx-auto">

        <div className="bg-[rgba(12,18,35,1)] border border-glow-blue/15 rounded-2xl overflow-hidden min-h-[300px] lg:min-h-[440px] flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-glow-blue/15">
            <div className="flex items-center gap-2 text-[11px] sm:text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                <circle cx="6" cy="6" r="5" stroke="#7090b0" strokeWidth="1" />
                <path d="M6 1C6 1 4 3.5 4 6s2 5 2 5" stroke="#7090b0" strokeWidth="0.75" fill="none" />
                <path d="M1 6h10" stroke="#7090b0" strokeWidth="0.75" />
              </svg>
              <span className="hidden sm:inline">Live Orbital Map</span>
              <span className="sm:hidden">Live Map</span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] px-2 py-[3px] rounded bg-green-500/10 text-green-400 border border-green-500/30">
              LIVE
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden" style={{ minHeight: 280 }}>
            <div
              className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)",
                animation: "scanline 4s linear infinite",
              }}
            />
            <Globe position={position} />
          </div>

          <ISSStats position={position} />
        </div>

        <div className="flex flex-col gap-4">
          <CurrentPosition position={position} loading={loading} />
          <div ref={alertRef}>
            <AlertForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
