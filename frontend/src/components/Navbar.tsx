"use client";

import { useState } from "react";
import AboutModal from "./AboutModal";

export default function Navbar() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 sm:py-[18px] border-b border-white/[0.06] bg-space-black/90 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <svg
            className="animate-float w-6 h-6 sm:w-8 sm:h-8"
            viewBox="0 0 32 32"
            fill="none"
          >
            <circle cx="16" cy="16" r="10" stroke="#3b8beb" strokeWidth="1" opacity="0.4" />
            <circle cx="16" cy="16" r="6" fill="#0a1a3e" stroke="#00d4ff" strokeWidth="0.75" />
            <circle cx="16" cy="16" r="2.5" fill="#00d4ff" />
            <ellipse
              cx="16" cy="16" rx="14" ry="6"
              stroke="#3b8beb" strokeWidth="0.5"
              strokeDasharray="3 2" fill="none" opacity="0.5"
            />
            <circle cx="26" cy="13" r="2" fill="#00d4ff" opacity="0.9" />
          </svg>
          <span className="text-[14px] sm:text-[18px] font-extrabold tracking-tight text-text-primary">
            ISS<span className="text-accent">OVERHEAD</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowAbout(true)}
            className="px-2.5 sm:px-[18px] py-1.5 sm:py-2 rounded-md text-[11px] sm:text-[13px] font-semibold text-text-secondary border border-glow-blue/30 bg-transparent hover:bg-accent-dim hover:border-accent hover:text-accent transition-all duration-200 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Inside the Mind</span>
            <span className="sm:hidden">About</span>
          </button>
          <a
            href="https://ahmedrehman.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-[18px] py-1.5 sm:py-2 rounded-md text-[11px] sm:text-[13px] font-semibold text-accent border border-accent/40 bg-transparent hover:bg-accent-dim transition-all duration-200"
          >
            Portfolio
          </a>
        </div>
      </nav>

      <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
