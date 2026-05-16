"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * THEATER CURTAINS — heavy velvet drapes part / meet in the
 * center. Gold-trimmed proscenium valance hangs from the top.
 * ============================================================ */

// Vertical pleat shadows so the drape reads as cloth, not a flat color.
const PLEAT_BG = `
  repeating-linear-gradient(90deg,
    rgba(0,0,0,0.55) 0,
    rgba(0,0,0,0.30) 8px,
    rgba(255,255,255,0.05) 22px,
    rgba(0,0,0,0.18) 36px,
    rgba(0,0,0,0.55) 48px),
  linear-gradient(180deg, #6e0f1a 0%, #4a0a13 60%, #2a0509 100%)
`;

const VALANCE_BG = `
  repeating-linear-gradient(90deg,
    rgba(0,0,0,0.45) 0,
    rgba(0,0,0,0.20) 6px,
    rgba(255,255,255,0.06) 18px,
    rgba(0,0,0,0.20) 30px,
    rgba(0,0,0,0.45) 40px),
  linear-gradient(180deg, #7e1422 0%, #5a0e18 100%)
`;

export function TheaterCurtainsCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const tween = {
    duration: isCovering ? coverMs / 1000 : uncoverMs / 1000,
    ease: isCovering ? ([0.65, 0.05, 0.36, 1] as const) : ([0.16, 1, 0.3, 1] as const),
  };

  return (
    <>
      {/* Left panel — slides in from the left to cover left half, parts back to the left on uncover */}
      <motion.div
        key="theater-left"
        initial={{ x: "-100%" }}
        animate={{ x: isCovering ? "0%" : "-100%" }}
        transition={tween}
        className="fixed left-0 top-0 bottom-0 z-[100] w-[52%] pointer-events-none"
        style={{ background: PLEAT_BG }}
      >
        {/* Soft inner edge highlight where the panels meet */}
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/60 to-transparent" />
        {/* Top hem shadow */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/70 to-transparent" />
        {/* Bottom hem with gold cord */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent" />
        <div
          className="absolute inset-x-0 bottom-2 h-1"
          style={{
            background:
              "linear-gradient(180deg, #d9b566 0%, #8a6f30 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        />
      </motion.div>

      {/* Right panel — mirror */}
      <motion.div
        key="theater-right"
        initial={{ x: "100%" }}
        animate={{ x: isCovering ? "0%" : "100%" }}
        transition={tween}
        className="fixed right-0 top-0 bottom-0 z-[100] w-[52%] pointer-events-none"
        style={{ background: PLEAT_BG }}
      >
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent" />
        <div
          className="absolute inset-x-0 bottom-2 h-1"
          style={{
            background:
              "linear-gradient(180deg, #d9b566 0%, #8a6f30 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        />
      </motion.div>

      {/* Proscenium valance — hangs from the top, doesn't move */}
      <motion.div
        key="theater-valance"
        initial={{ y: "-100%" }}
        animate={{ y: isCovering ? "0%" : "-100%" }}
        transition={{
          duration: isCovering ? (coverMs / 1000) * 0.7 : (uncoverMs / 1000) * 0.7,
          ease: isCovering ? "easeOut" : "easeIn",
        }}
        className="fixed inset-x-0 top-0 z-[101] h-24 pointer-events-none md:h-32"
        style={{ background: VALANCE_BG }}
      >
        {/* Scalloped bottom edge */}
        <div
          className="absolute inset-x-0 -bottom-3 h-6"
          style={{
            background: VALANCE_BG,
            WebkitMaskImage:
              "radial-gradient(circle 18px at 36px 0, transparent 16px, black 17px)",
            WebkitMaskRepeat: "repeat-x",
            WebkitMaskSize: "72px 24px",
            maskImage:
              "radial-gradient(circle 18px at 36px 0, transparent 16px, black 17px)",
            maskRepeat: "repeat-x",
            maskSize: "72px 24px",
          }}
        />
        {/* Gold fringe */}
        <div
          className="absolute inset-x-0 bottom-0 h-1"
          style={{
            background:
              "linear-gradient(180deg, #e3c272 0%, #8a6f30 100%)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        />
      </motion.div>

      {/* Centered marquee text appears after the panels meet */}
      <motion.div
        key="theater-marquee"
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: isCovering ? 1 : 0,
          y: isCovering ? 0 : 6,
        }}
        transition={{
          delay: isCovering ? (coverMs / 1000) * 0.6 : 0,
          duration: 0.35,
          ease: "easeOut",
        }}
        className="fixed inset-0 z-[102] flex items-center justify-center pointer-events-none"
      >
        <div className="text-center">
          <div
            className="font-display text-[clamp(36px,5vw,72px)] font-medium italic leading-none"
            style={{
              color: "#e8d09a",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.25), 0 -1px 0 rgba(0,0,0,0.7), 0 4px 14px rgba(0,0,0,0.6)",
            }}
          >
            Lopes
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.6em] text-amber-200/70">
            Now Showing · Vol. V
          </div>
        </div>
      </motion.div>
    </>
  );
}
