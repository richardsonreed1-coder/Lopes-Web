"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * EKG MONITOR — black overlay, ECG trace draws across L→R with
 * synced vitals readouts.
 * ============================================================ */
export function EkgMonitorCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="ekg-monitor"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "covering" ? 1 : 0 }}
      transition={{
        duration: phase === "covering" ? coverMs / 1000 : uncoverMs / 1000,
        ease: "easeOut",
      }}
      className="fixed inset-0 z-[100] pointer-events-none bg-black"
    >
      {/* Phosphor scanlines */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(80, 220, 120, 0.06) 2px, rgba(80, 220, 120, 0.06) 3px)",
        }}
      />

      {/* Vitals readouts */}
      <div className="absolute left-8 top-8 font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-300/85 space-y-1">
        <div>HR · <span className="text-emerald-300">72</span> bpm</div>
        <div>SpO₂ · <span className="text-emerald-300">98</span>%</div>
        <div>BP · <span className="text-emerald-300">118/76</span></div>
        <div>Resp · <span className="text-emerald-300">14</span></div>
      </div>
      <div className="absolute right-8 top-8 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45 text-right space-y-1">
        <div>Lopes · Unit IV</div>
        <div>Bed 042 · Stable</div>
        <div>Telemetry · ON</div>
      </div>

      {/* ECG SVG line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-48">
        <svg
          viewBox="0 0 1000 200"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="ekg-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(80,220,120,0.10)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="200" fill="url(#ekg-grid)" />
          <motion.path
            d="M 0 100 L 80 100 L 100 100 L 110 60 L 120 140 L 130 80 L 145 100 L 250 100 L 270 100 L 280 60 L 290 140 L 300 80 L 315 100 L 420 100 L 440 100 L 450 60 L 460 140 L 470 80 L 485 100 L 590 100 L 610 100 L 620 60 L 630 140 L 640 80 L 655 100 L 760 100 L 1000 100"
            fill="none"
            stroke="rgb(74, 222, 128)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(74,222,128,0.6))" }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase === "covering" ? 1 : 1 }}
            transition={{ duration: coverMs / 1000, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Bottom corner status */}
      <div className="absolute left-8 bottom-8 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/55">
        ▮ rec · {new Date().toISOString().slice(0, 10)}
      </div>
    </motion.div>
  );
}
