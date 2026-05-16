"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * CHALKBOARD — slate panel slides in horizontally, an eraser
 * sweeps across, then it slides off.
 * ============================================================ */
export function ChalkboardCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="chalkboard"
      initial={{ x: "-100%" }}
      animate={{ x: phase === "covering" ? "0%" : "100%" }}
      transition={{
        duration: phase === "covering" ? coverMs / 1000 : uncoverMs / 1000,
        ease: phase === "covering" ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1],
      }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Wooden frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6b4a2a] via-[#4a321c] to-[#2a1e10] p-6 md:p-10">
        {/* Slate */}
        <div
          className="relative h-full w-full overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.6),inset_0_0_2px_rgba(255,255,255,0.06)]"
          style={{
            background:
              "radial-gradient(ellipse at 40% 30%, #2e3a35 0%, #1a201d 60%, #0e1311 100%)",
          }}
        >
          {/* Chalk dust speckle */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 0, transparent 50%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 0, transparent 40%)",
            }}
          />
          {/* Chalk text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="font-display text-[clamp(60px,9vw,140px)] font-normal italic"
                style={{
                  color: "rgba(255, 250, 235, 0.92)",
                  textShadow:
                    "0 0 12px rgba(255,255,235,0.15), 0 1px 0 rgba(0,0,0,0.4)",
                }}
              >
                Education.
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.5em] text-paper/40">
                §02 · the new architecture of learning
              </div>
            </div>
          </div>

          {/* Eraser sweep */}
          <motion.div
            initial={{ x: "-30%", opacity: 0 }}
            animate={{
              x: phase === "covering" ? "130%" : "-30%",
              opacity: 1,
            }}
            transition={{
              delay: phase === "covering" ? coverMs / 2000 : 0,
              duration: 0.7,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 -translate-y-1/2 h-16 w-28 rounded-sm"
            style={{
              background:
                "linear-gradient(180deg, #d9c294 0%, #a88a55 60%, #6e5a35 100%)",
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.7), inset 0 2px 2px rgba(255,255,255,0.3), inset 0 -2px 2px rgba(0,0,0,0.4)",
            }}
          >
            <div className="absolute inset-x-2 bottom-1 h-3 rounded-sm bg-white/40 blur-[2px]" />
          </motion.div>

          {/* Chalk tray */}
          <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-[#3a2814] to-[#1a0e08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
        </div>
      </div>
    </motion.div>
  );
}
