import type { ISSPosition } from "@/lib/api";

interface Props {
  position: ISSPosition | null;
}

const STATS = [
  { label: "Altitude",       key: "altitude_km",        unit: "km",  fixed: 0 },
  { label: "Velocity",       key: "velocity_kms",        unit: "km/s", fixed: 2 },
  { label: "Orbital period", key: "orbital_period_min",  unit: "min", fixed: 1 },
] as const;

export default function ISSStats({ position }: Props) {
  return (
    <div className="grid grid-cols-3 border-t border-glow-blue/15">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-3 sm:px-5 py-3 sm:py-[14px] ${i < STATS.length - 1 ? "border-r border-glow-blue/15" : ""}`}
        >
          <p className="font-mono text-[8px] sm:text-[9px] text-text-muted tracking-[1.5px] uppercase mb-1">
            {stat.label}
          </p>
          <p className="font-mono text-[13px] sm:text-[15px] font-bold text-accent">
            {position
              ? Number(position[stat.key]).toFixed(stat.fixed)
              : "..."}
            <span className="text-[9px] sm:text-[10px] text-text-muted ml-1">{stat.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
