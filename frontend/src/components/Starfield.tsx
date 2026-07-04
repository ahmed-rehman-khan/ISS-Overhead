"use client";

import { useEffect, useRef, useState } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const trackAccess = async () => {
      const lastAccess = sessionStorage.getItem("lastAccessTime");
      if (lastAccess) return;
      try {
        const geoResponse = await fetch("https://get.geojs.io/v1/ip/geo.json");
        const geo = await geoResponse.json();
        const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
        const bodyContent = [
          `URL: ${window.location.href}`,
          `Location: ${geo.city || "Unknown"}, ${geo.region || "Unknown"}, ${geo.country || "Unknown"}`,
          `IP Address: ${geo.ip || "Unknown"}`,
          `ISP: ${geo.organization || "Unknown"}`,
          `Platform: ${navigator.platform || "Unknown"}`,
          `Browser: ${navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|MSIE|OPR|Edg)/i)?.[0] || "Unknown"}`,
          `User Agent: ${navigator.userAgent}`,
          `Referrer: ${document.referrer || "Direct"}`,
          `Time: ${time}`,
        ].join("\n");
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: "bf35d269-972f-4d9a-a0a4-03fcc3be9758",
            subject: "Access Detected: ISS Overhead",
            message: bodyContent,
          }),
          keepalive: true,
        });
        sessionStorage.setItem("lastAccessTime", "true");
      } catch (err) {
        console.error("Tracking failed:", err);
      }
    };
    trackAccess();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 150 }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.2 + 0.3,
      opacity: Math.random(),
      speed:   Math.random() * 0.008 + 0.002,
      dir:     Math.random() > 0.5 ? 1 : -1,
    }));

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.opacity += star.speed * star.dir;
        if (star.opacity >= 0.9 || star.opacity <= 0.05) star.dir *= -1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="starfield"
      aria-hidden="true"
    />
  );
}