"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#7A4FD9", "#D9A441", "#2F8F8F", "#C44060"];

type Particle = {
  x: number;
  y: number;
  s: number;
  c: string;
  vx: number;
  vy: number;
  a: number;
};

export function ConfettiBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;

    function resize() {
      if (!cvs || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const W = window.innerWidth;
      const H = document.body.scrollHeight;
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      cvs.style.width = `${W}px`;
      cvs.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = [];
      const count = Math.min(140, Math.floor((W * H) / 16000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          s: 3 + Math.random() * 4,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          a: 0.15 + Math.random() * 0.25,
        });
      }
    }

    function tick() {
      if (!cvs || !ctx) return;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const W = window.innerWidth;
      const H = document.body.scrollHeight;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    const timer = setTimeout(() => {
      resize();
      tick();
    }, 100);
    window.addEventListener("resize", resize);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
