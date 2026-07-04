"use client";

import { useState } from "react";
import HowItWorksModal from "./HowItWorksModal";

interface Props {
  onGetAlert: () => void;
}

export default function Hero({ onGetAlert }: Props) {
  const [showHow, setShowHow] = useState(false);

  return (
    <>
      <section className="relative z-10 text-center px-4 md:px-10 pt-12 md:pt-20 pb-10 md:pb-14 animate-[fadeInUp_0.8s_ease_both]">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] text-accent tracking-[2px] uppercase mb-5 px-4 py-[6px] border border-accent/30 rounded-full bg-accent/[0.05]">
          <span className="relative flex w-[6px] h-[6px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full w-[6px] h-[6px] bg-green-400" />
          </span>
          Live · Tracking Now
        </div>

        <h1 className="text-[36px] md:text-[56px] font-extrabold leading-[1.05] tracking-[-2px] mb-4">
        Know when the {" "}
        <span
          style={{
            background: "linear-gradient(135deg, #3b8beb, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Space Station
        </span>{" "}<br/>
        passes overhead
        </h1>

        <p className="text-[16px] text-text-secondary max-w-[480px] mx-auto mb-9 leading-[1.6] font-normal">
          Watch the ISS orbit Earth in real time. Get a one-time email alert the
          moment it passes over your location, then step outside and look up.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={onGetAlert}
            className="px-7 py-[13px] bg-accent text-space-black rounded-lg text-[14px] font-bold hover:bg-[#00b8d9] hover:-translate-y-[1px] transition-all duration-200"
          >
            Get an alert
          </button>
          <button
            onClick={() => setShowHow(true)}
            className="px-7 py-[13px] bg-transparent text-text-primary border border-white/15 rounded-lg text-[14px] font-semibold hover:bg-white/[0.05] hover:border-white/30 transition-all duration-200"
          >
            How it works
          </button>
        </div>
      </section>

      <HowItWorksModal open={showHow} onClose={() => setShowHow(false)} />
    </>
  );
}
