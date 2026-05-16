"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/**
 * Storage unit roll-up door — pale corrugated rollup with horizontal
 * slat seams, a big stenciled unit number, a hasp + padlock at the
 * bottom center, dark steel jambs on each side, and a concrete sliver
 * at the very bottom. Slams down on cover, lifts off on uncover.
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
      {/* Steel jambs on each side — narrow, painted dark */}
      <div className="absolute inset-y-0 left-0 z-[2] w-4 bg-gradient-to-r from-[#1a1a1c] via-[#222426] to-[#161618] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.7)] md:w-5" />
      <div className="absolute inset-y-0 right-0 z-[2] w-4 bg-gradient-to-l from-[#1a1a1c] via-[#222426] to-[#161618] shadow-[inset_2px_0_4px_rgba(0,0,0,0.7)] md:w-5" />

      {/* Door panel — fills between the jambs */}
      <div className="absolute inset-y-0 inset-x-4 md:inset-x-5">
        {/* Base off-white storage door color */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #e0d9c8 0%, #d6cfbd 50%, #c8c1af 100%)",
          }}
        />

        {/* Corrugation — repeating ridges every 20px */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom,
              rgba(255,255,255,0.45) 0px,
              rgba(255,255,255,0.20) 2px,
              rgba(0,0,0,0.04) 6px,
              rgba(0,0,0,0.18) 11px,
              rgba(0,0,0,0.30) 13px,
              rgba(0,0,0,0.10) 15px,
              rgba(255,255,255,0.30) 18px,
              rgba(255,255,255,0.45) 20px)`,
          }}
        />

        {/* Slat seams — darker horizontal lines every 80px (joins between panels) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom,
              transparent 0px,
              transparent 78px,
              rgba(0,0,0,0.45) 78px,
              rgba(0,0,0,0.55) 80px,
              rgba(255,255,255,0.30) 80.5px,
              transparent 82px)`,
          }}
        />

        {/* Vertical edge shadowing — slight darkening near the jambs */}
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/35 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/35 to-transparent" />

        {/* Weathering — irregular dirt streaks near the bottom */}
        <div
          className="absolute inset-x-0 bottom-32 h-40 opacity-30 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80px 30px at 18% 60%, rgba(80,60,40,0.5), transparent),
              radial-gradient(ellipse 60px 80px at 35% 80%, rgba(60,45,30,0.4), transparent),
              radial-gradient(ellipse 100px 20px at 70% 50%, rgba(80,60,40,0.4), transparent),
              radial-gradient(ellipse 70px 90px at 88% 70%, rgba(60,45,30,0.45), transparent)
            `,
          }}
        />

        {/* Stenciled unit number — centered, big, slightly worn black paint */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <span
              className="font-bold leading-none tracking-[0.04em]"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                fontSize: "clamp(180px, 28vw, 360px)",
                color: "#171614",
                textShadow:
                  "0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.2)",
                opacity: 0.88,
              }}
            >
              042
            </span>
            {/* Worn-paint speckle on the number */}
            <div
              className="absolute inset-0 mix-blend-screen pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(216,207,189,0.9) 1.5px, transparent 1.6px)",
                backgroundSize: "9px 9px",
                opacity: 0.18,
              }}
            />
          </div>
        </div>

        {/* Small property-management plate — top center */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 rounded-[1px] border border-black/30 bg-[#1a1a1a] px-3 py-1.5 shadow-md">
          <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-[#d6cfbd]">
            Lopes Self Storage
          </span>
        </div>

        {/* Hasp + padlock — center bottom, just above the bottom rail */}
        <div className="absolute left-1/2 bottom-[136px] -translate-x-1/2 z-[3]">
          {/* Hasp plate (back) */}
          <div className="relative h-20 w-16">
            <div
              className="absolute inset-x-0 top-0 h-14 rounded-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, #6a6a6c 0%, #3a3a3c 60%, #1e1e20 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.5)",
              }}
            />
            {/* Hasp loop / ring */}
            <div
              className="absolute left-1/2 top-2 -translate-x-1/2 h-7 w-7 rounded-full border-[3px]"
              style={{
                borderColor: "#1c1c1e",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2)",
              }}
            />
            {/* Padlock body */}
            <div
              className="absolute left-1/2 top-4 -translate-x-1/2 h-12 w-10 rounded-[3px]"
              style={{
                background:
                  "radial-gradient(ellipse at 35% 30%, #c8b56a 0%, #8a7634 55%, #4a3e1a 100%)",
                boxShadow:
                  "0 4px 8px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.5)",
              }}
            >
              {/* Key cylinder */}
              <div className="absolute left-1/2 top-3 -translate-x-1/2 h-3 w-3 rounded-full border border-[#3a2e10] bg-[#1a1408] shadow-inner" />
              {/* Brand stripe */}
              <div className="absolute inset-x-1 bottom-2 h-px bg-[#3a2e10]/60" />
            </div>
            {/* Shackle (top arc) */}
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 h-6 w-7 rounded-t-full border-[3px] border-b-0"
              style={{
                borderColor: "#9a9a9c",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.6)",
              }}
            />
          </div>
        </div>

        {/* Bottom rail — heavy aluminum sill with a recessed pull handle */}
        <div className="absolute inset-x-0 bottom-12 h-20 bg-gradient-to-b from-[#9a9590] via-[#7a7570] to-[#4a4540] shadow-[0_-12px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.5)]">
          {/* Hairline grain */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
            }}
          />
          {/* Pull handle — recessed grab slot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-44 rounded-[2px] bg-gradient-to-b from-[#0a0a0c] via-[#16171a] to-[#1f2024] shadow-[inset_0_3px_6px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.06)]" />
          {/* Stamped unit number on the rail (small) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/65">
            UNIT 042
          </div>
          {/* Hairline at the very bottom — meets the floor */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-black/70" />
        </div>

        {/* Concrete floor sliver at the very bottom */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-[#5d5a55] via-[#48464a] to-[#3a383c]">
          {/* Concrete speckle */}
          <div
            className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.5px), radial-gradient(rgba(0,0,0,0.20) 1px, transparent 1.5px)",
              backgroundSize: "6px 6px, 9px 9px",
            }}
          />
          {/* Expansion seam */}
          <div className="absolute inset-x-0 top-3 h-px bg-black/40" />
          {/* Hint of door shadow on the floor */}
          <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-black/60 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
