"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-space-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1525] border border-accent/25 rounded-2xl w-[540px] max-w-[92vw] modal-scroll"
        style={{ maxHeight: "88vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end px-5 pt-4">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/10 text-text-secondary text-base flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
          >
            x
          </button>
        </div>

        <div className="px-8 pb-0 text-center">
          <p className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-2">
            About this project
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary mb-5">
            ISS Overhead
          </h2>
        </div>

        <div className="px-8 pb-8">
          <p className="text-[14px] text-text-secondary leading-[1.7] mb-4">
            ISS Overhead is a real-time tracker for the International Space Station,
            built out of curiosity and a love for space by <strong className="text-text-primary font-bold">Ahmed Rehman</strong>. The ISS orbits
            Earth at roughly 28,000 km/h, completing a full lap every 90 minutes.
          </p>
          <p className="text-[14px] text-text-secondary leading-[1.7] mb-4">
            This tool lets you watch it move live and sign up for a one-time email
            alert the moment it passes over your city at night, so you can step outside
            and actually see it with your naked eye.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            {[
              { icon: "🛰️", title: "Live tracking",   desc: "Position updates every 5 seconds" },
              { icon: "📧", title: "Email alerts",    desc: "Overhead notification via email" },
              { icon: "🌍", title: "Any location",    desc: "Set your city, anywhere on Earth" },
              { icon: "🔒", title: "Privacy first",   desc: "No tracking, no data selling" },
            ].map((f) => (
              <div
                key={f.title}
                className="p-3 bg-accent/[0.04] border border-accent/10 rounded-xl"
              >
                <div className="text-base mb-1">{f.icon}</div>
                <div className="text-[13px] font-semibold text-text-primary mb-1">{f.title}</div>
                <div className="text-[11px] text-text-muted leading-[1.4]">{f.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-amber-500/[0.04] border border-amber-500/20 rounded-lg">
            <p className="text-[11px] text-amber-400/70 leading-[1.6]">
              <strong className="text-amber-400/90">Not affiliated with NASA or any space organisation.</strong>{" "}
              This is an independent personal project. All ISS position data is sourced
              from the public Open Notify API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}