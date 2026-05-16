"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

const RIVET_COUNT = 26;

/**
 * Editorial rolling-door curtain. Slams DOWN to cover with a heavy ease-in,
 * then heaves UP off the top with a slow ease-out.
 */
export function RollingDoorCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="rolling-door"
      initial={{ y: "-100%" }}
      animate={{ y: phase === "covering" ? "0%" : "-100%" }}
      transition={
        phase === "covering"
          ? { duration: coverMs / 1000, ease: [0.7, 0, 0.84, 0] }
          : { duration: uncoverMs / 1000, ease: [0.16, 1, 0.3, 1] }
      }
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Corrugated slats — tighter, lower contrast, slightly warm */}
      <div
        className="absolute inset-0 bg-[#1a1b1e]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to bottom,
              rgba(255,255,255,0.05) 0px,
              rgba(255,255,255,0.018) 1px,
              transparent 2px,
              transparent 14px,
              rgba(0,0,0,0.42) 16px,
              rgba(0,0,0,0.18) 17px,
              transparent 18px),
            linear-gradient(180deg,
              #161719 0%,
              #1d1e21 35%,
              #1d1e21 65%,
              #131316 100%)
          `,
        }}
      />

      {/* Subtle vignette so the panel reads as a slab, not a flat color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Side rails — narrower, smaller rivets */}
      <div className="absolute inset-y-0 left-0 flex w-8 flex-col items-center justify-around bg-[#0c0d0f] py-12 shadow-[inset_-12px_0_22px_rgba(0,0,0,0.85)] md:w-10">
        {Array.from({ length: RIVET_COUNT }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-[#1f2024] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.7)]"
          />
        ))}
      </div>
      <div className="absolute inset-y-0 right-0 flex w-8 flex-col items-center justify-around bg-[#0c0d0f] py-12 shadow-[inset_12px_0_22px_rgba(0,0,0,0.85)] md:w-10">
        {Array.from({ length: RIVET_COUNT }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-[#1f2024] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.7)]"
          />
        ))}
      </div>

      {/* Tiny editorial serial plate — sits low, brushed, restrained */}
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-white/8 bg-[#1a1b1e] px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.6)]">
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-paper/55">
          Lopes · Unit II · MMXXVI
        </div>
      </div>

      {/* Bottom rail — brushed steel, minimal latch */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-[#2a2b2e] via-[#1f2023] to-[#101113] shadow-[0_-18px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.5)]">
        {/* Hairline brushed-metal grain */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
          }}
        />
        {/* Centered handle slot — single rectangular cutout, no labels */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-40 rounded-[2px] bg-gradient-to-b from-[#0a0b0d] to-[#16171a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.05)]" />
        {/* Hairline at the very bottom — door meeting jamb */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/80" />
      </div>
    </motion.div>
  );
}
