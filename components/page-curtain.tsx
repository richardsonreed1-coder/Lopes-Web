"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { RollingDoorCurtain } from "@/components/rolling-door-curtain";
import {
  CandlestickCurtain,
  OrderBookCollisionCurtain,
} from "@/components/transitions/capital-markets";
import { ChalkboardCurtain } from "@/components/transitions/education";
import {
  EkgMonitorCurtain,
  LaserScanCurtain,
  FrequencyTunerCurtain,
  LedPanelCurtain,
  SpectralScanCurtain,
} from "@/components/transitions/healthcare";
import { TheaterCurtainsCurtain } from "@/components/transitions/media";
import type { CurtainVariant } from "@/components/curtain-link";

type CurtainDetail = {
  href: string;
  accent?: string;
  label?: string;
  variant?: CurtainVariant;
};

type Timing = { cover: number; navAt: number; hold: number; uncover: number };

const TIMING: Record<CurtainVariant, Timing> = {
  default:            { cover: 500, navAt: 420, hold: 280, uncover: 500 },
  "rolling-door":     { cover: 750, navAt: 600, hold: 1100, uncover: 950 },
  "candlestick":      { cover: 1400, navAt: 1200, hold: 800, uncover: 650 },
  "order-book-collision": { cover: 1500, navAt: 1100, hold: 500, uncover: 400 },
  "chalkboard":       { cover: 700, navAt: 580, hold: 1000, uncover: 600 },
  "ekg-monitor":      { cover: 1500, navAt: 1300, hold: 800, uncover: 650 },
  "laser-scan":       { cover: 1100, navAt: 940, hold: 500, uncover: 500 },
  "frequency-tuner":  { cover: 900, navAt: 760, hold: 600, uncover: 500 },
  "led-panel":        { cover: 800, navAt: 680, hold: 600, uncover: 500 },
  "spectral-scan":    { cover: 1100, navAt: 940, hold: 500, uncover: 600 },
  "theater-curtains": { cover: 850, navAt: 680, hold: 1100, uncover: 850 },
};

export function PageCurtain() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "covering" | "uncovering">("idle");
  const [accent, setAccent] = useState("#7A4FD9");
  const [label, setLabel] = useState("Opening volume");
  const [variant, setVariant] = useState<CurtainVariant>("default");

  const handleNavigate = useCallback(
    (e: Event) => {
      const ev = e as CustomEvent<CurtainDetail>;
      const { href, accent: a = "#7A4FD9", label: l, variant: v = "default" } = ev.detail ?? { href: "/" };
      if (!href) return;

      const t = TIMING[v];
      setAccent(a);
      setLabel(l ?? "Opening volume");
      setVariant(v);
      setPhase("covering");

      const navTimer = window.setTimeout(() => {
        router.push(href);
      }, t.navAt);

      const uncoverTimer = window.setTimeout(() => {
        setPhase("uncovering");
      }, t.cover + t.hold);

      const idleTimer = window.setTimeout(() => {
        setPhase("idle");
      }, t.cover + t.hold + t.uncover);

      return () => {
        clearTimeout(navTimer);
        clearTimeout(uncoverTimer);
        clearTimeout(idleTimer);
      };
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener("lopes:navigate", handleNavigate as EventListener);
    return () => {
      window.removeEventListener("lopes:navigate", handleNavigate as EventListener);
    };
  }, [handleNavigate]);

  const visible = phase !== "idle";
  const t = TIMING[variant];
  const activePhase = phase as "covering" | "uncovering";

  return (
    <AnimatePresence>
      {visible && variant === "rolling-door" && (
        <RollingDoorCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "candlestick" && (
        <CandlestickCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "order-book-collision" && (
        <OrderBookCollisionCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "chalkboard" && (
        <ChalkboardCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "ekg-monitor" && (
        <EkgMonitorCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "laser-scan" && (
        <LaserScanCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "frequency-tuner" && (
        <FrequencyTunerCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "led-panel" && (
        <LedPanelCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "spectral-scan" && (
        <SpectralScanCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "theater-curtains" && (
        <TheaterCurtainsCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "default" && (
        <motion.div
          key="page-curtain"
          initial={{ y: "100%" }}
          animate={{ y: activePhase === "covering" ? "0%" : "-100%" }}
          transition={{
            duration: activePhase === "covering" ? t.cover / 1000 : t.uncover / 1000,
            ease: [0.65, 0, 0.35, 1],
          }}
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ backgroundColor: accent }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: activePhase === "covering" ? 1 : 0, y: 0 }}
              transition={{ delay: activePhase === "covering" ? 0.15 : 0, duration: 0.3 }}
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/85"
            >
              {label}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
