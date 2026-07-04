"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { ISSPosition } from "@/lib/api";

const GEO_URL = "/countries-110m.json";

interface Props {
  position: ISSPosition | null;
}

export default function Globe({ position }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  

  if (!mounted) return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="font-mono text-[12px] text-text-muted tracking-widest uppercase">
        Loading globe...
      </p>
    </div>
  );

  return (
    <div className="w-full h-full relative">
      <ComposableMap
        projection="geoEquirectangular"
projectionConfig={{ scale: 153, center: [0, 0] }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <rect x="0" y="0" width="800" height="500" fill="#04080f" />

        <defs>
          <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#04080f" stopOpacity="0" />
            <stop offset="100%" stopColor="#3b8beb" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="oceanGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1a3a6e" />
            <stop offset="60%" stopColor="#0a1a3e" />
            <stop offset="100%" stopColor="#04080f" />
          </radialGradient>
          <radialGradient id="sphereShade" cx="60%" cy="60%" r="55%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </radialGradient>
        </defs>

        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(30,100,60,0.8)"
                stroke="rgba(40,140,70,0.4)"
                strokeWidth={0.3}
                style={{
                  default: { outline: "none" },
                  hover:   { outline: "none", fill: "rgba(40,120,70,0.9)" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {position && (
  <Marker coordinates={[position.longitude, position.latitude]}>
    <circle r={6} fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth={1.5} />
    <circle r={3} fill="#00d4ff" />
    <text
      textAnchor="middle"
      y={-10}
      style={{
        fontFamily: "monospace",
        fontSize: 8,
        fontWeight: "bold",
        fill: "#00d4ff",
      }}
    >
      ISS
    </text>
  </Marker>
)}
      </ComposableMap>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />
    </div>
  );
}