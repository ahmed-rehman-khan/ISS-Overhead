import type { ISSPosition } from "@/lib/api";

interface Props {
  position: ISSPosition | null;
  loading: boolean;
}

export default function CurrentPosition({ position, loading }: Props) {
  return (
    <div className="bg-[rgba(12,18,35,1)] border border-glow-blue/15 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-glow-blue/15">
        <div className="flex items-center gap-2 text-[11px] sm:text-[13px] font-semibold text-text-secondary uppercase tracking-[0.5px]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
            <path
              d="M6 1C4.34 1 3 2.34 3 4c0 2.5 3 7 3 7s3-4.5 3-7c0-1.66-1.34-3-3-3z"
              stroke="#7090b0" strokeWidth="0.8" fill="none"
            />
            <circle cx="6" cy="4" r="1.2" fill="#7090b0" />
          </svg>
          Current Position
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 sm:py-4">
        <p className="text-[16px] sm:text-[20px] font-bold text-text-primary mb-2 transition-all duration-500 break-words">
          {loading ? "Locating..." : (position?.location_name ?? "Unknown")}
        </p>
        <div className="flex gap-2 sm:gap-3 font-mono text-[10px] sm:text-[11px] flex-wrap">
          <span className="px-2 py-[2px] rounded bg-glow-blue/10 border border-glow-blue/20 text-[#6db3ff]">
            {position ? `${position.latitude.toFixed(2)}°` : "..."}
          </span>
          <span className="px-2 py-[2px] rounded bg-glow-blue/10 border border-glow-blue/20 text-[#6db3ff]">
            {position ? `${position.longitude.toFixed(2)}°` : "..."}
          </span>
        </div>
      </div>
    </div>
  );
}
