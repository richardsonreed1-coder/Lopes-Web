"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/**
 * Theater curtains — heavy velvet drapes with soft fold gradients
 * meet under a gold-molded proscenium valance. Stage floor visible
 * at the bottom, soft footlight glow.
 */

// Velvet fold gradient — irregular highlights/shadows for soft cloth feel
const VELVET = `
  radial-gradient(ellipse 60px 100% at 12% 50%, rgba(255,200,200,0.10), transparent 60%),
  radial-gradient(ellipse 50px 100% at 28% 50%, rgba(0,0,0,0.30), transparent 60%),
  radial-gradient(ellipse 70px 100% at 46% 50%, rgba(255,200,200,0.12), transparent 60%),
  radial-gradient(ellipse 50px 100% at 64% 50%, rgba(0,0,0,0.32), transparent 60%),
  radial-gradient(ellipse 70px 100% at 82% 50%, rgba(255,200,200,0.10), transparent 60%),
  radial-gradient(ellipse 50px 100% at 96% 50%, rgba(0,0,0,0.40), transparent 60%),
  linear-gradient(180deg, #5a0c14 0%, #420810 35%, #2e0509 100%)
`;

const VELVET_R = `
  radial-gradient(ellipse 60px 100% at 4% 50%, rgba(0,0,0,0.40), transparent 60%),
  radial-gradient(ellipse 50px 100% at 18% 50%, rgba(255,200,200,0.12), transparent 60%),
  radial-gradient(ellipse 70px 100% at 36% 50%, rgba(0,0,0,0.32), transparent 60%),
  radial-gradient(ellipse 50px 100% at 54% 50%, rgba(255,200,200,0.10), transparent 60%),
  radial-gradient(ellipse 70px 100% at 72% 50%, rgba(0,0,0,0.30), transparent 60%),
  radial-gradient(ellipse 50px 100% at 88% 50%, rgba(255,200,200,0.10), transparent 60%),
  linear-gradient(180deg, #5a0c14 0%, #420810 35%, #2e0509 100%)
`;

const VALANCE_BG = `
  radial-gradient(ellipse 80px 100% at 8% 50%, rgba(255,210,140,0.18), transparent 60%),
  radial-gradient(ellipse 60px 100% at 24% 50%, rgba(0,0,0,0.28), transparent 60%),
  radial-gradient(ellipse 80px 100% at 42% 50%, rgba(255,210,140,0.20), transparent 60%),
  radial-gradient(ellipse 60px 100% at 60% 50%, rgba(0,0,0,0.30), transparent 60%),
  radial-gradient(ellipse 80px 100% at 78% 50%, rgba(255,210,140,0.18), transparent 60%),
  radial-gradient(ellipse 60px 100% at 94% 50%, rgba(0,0,0,0.28), transparent 60%),
  linear-gradient(180deg, #6e1018 0%, #4e0a12 100%)
`;

export function TheaterCurtainsCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const tween = {
    duration: isCovering ? coverMs / 1000 : uncoverMs / 1000,
    ease: isCovering ? ([0.65, 0.05, 0.36, 1] as const) : ([0.16, 1, 0.3, 1] as const),
  };

  return (
    <>
      {/* Stage floor + footlights — backdrop behind everything */}
      <motion.div
        key="stage-floor"
        initial={{ opacity: 0 }}
        animate={{ opacity: isCovering ? 1 : 0 }}
        transition={{ duration: 0.25, delay: isCovering ? 0.3 : 0 }}
        className="fixed inset-0 z-[99] pointer-events-none"
      >
        {/* Wooden stage floor — gradient + grain */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, #2a1810 0%, #1a0e08 60%, #0a0604 100%)",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,200,140,0.04) 0, rgba(255,200,140,0.04) 1px, transparent 1px, transparent 5px), linear-gradient(180deg, #2a1810 0%, #1a0e08 60%, #0a0604 100%)",
          }}
        />
        {/* Footlight glow at the very bottom of the curtains */}
        <div
          className="absolute inset-x-0 bottom-32 h-32"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,200,140,0.22), transparent 70%)",
          }}
        />
      </motion.div>

      {/* Left velvet panel */}
      <motion.div
        key="theater-left"
        initial={{ x: "-100%" }}
        animate={{ x: isCovering ? "0%" : "-100%" }}
        transition={tween}
        className="fixed left-0 top-0 bottom-0 z-[100] w-[52%] pointer-events-none"
        style={{ background: VELVET }}
      >
        {/* Inner edge — meeting line shadow */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/85 via-black/30 to-transparent" />
        {/* Top hem */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/75 to-transparent" />
        {/* Bottom hem with weight pocket */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/85 to-transparent" />
        {/* Gold tassel cord at the bottom hem */}
        <div
          className="absolute inset-x-0 bottom-3 h-1.5"
          style={{
            background:
              "linear-gradient(180deg, #f0d27a 0%, #c89e44 40%, #8a6824 100%)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,235,180,0.5)",
          }}
        />
        {/* Tassel fringe — small triangular drops */}
        <div
          className="absolute inset-x-0 bottom-0 h-3"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #c89e44 0%, #8a6824 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle 6px at 6px 0, transparent 5px, black 5.5px)",
            WebkitMaskRepeat: "repeat-x",
            WebkitMaskSize: "12px 12px",
            maskImage:
              "radial-gradient(circle 6px at 6px 0, transparent 5px, black 5.5px)",
            maskRepeat: "repeat-x",
            maskSize: "12px 12px",
          }}
        />
      </motion.div>

      {/* Right velvet panel */}
      <motion.div
        key="theater-right"
        initial={{ x: "100%" }}
        animate={{ x: isCovering ? "0%" : "100%" }}
        transition={tween}
        className="fixed right-0 top-0 bottom-0 z-[100] w-[52%] pointer-events-none"
        style={{ background: VELVET_R }}
      >
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/85 to-transparent" />
        <div
          className="absolute inset-x-0 bottom-3 h-1.5"
          style={{
            background:
              "linear-gradient(180deg, #f0d27a 0%, #c89e44 40%, #8a6824 100%)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,235,180,0.5)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-3"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #c89e44 0%, #8a6824 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle 6px at 6px 0, transparent 5px, black 5.5px)",
            WebkitMaskRepeat: "repeat-x",
            WebkitMaskSize: "12px 12px",
            maskImage:
              "radial-gradient(circle 6px at 6px 0, transparent 5px, black 5.5px)",
            maskRepeat: "repeat-x",
            maskSize: "12px 12px",
          }}
        />
      </motion.div>

      {/* Proscenium valance — hangs from the top */}
      <motion.div
        key="theater-valance"
        initial={{ y: "-100%" }}
        animate={{ y: isCovering ? "0%" : "-100%" }}
        transition={{
          duration: isCovering ? (coverMs / 1000) * 0.7 : (uncoverMs / 1000) * 0.7,
          ease: isCovering ? "easeOut" : "easeIn",
        }}
        className="fixed inset-x-0 top-0 z-[101] h-28 pointer-events-none md:h-36"
        style={{ background: VALANCE_BG }}
      >
        {/* Top molding — gold trim above the valance */}
        <div
          className="absolute inset-x-0 top-0 h-3"
          style={{
            background:
              "linear-gradient(180deg, #f0d480 0%, #b8902f 60%, #6e5618 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,240,200,0.6), 0 2px 4px rgba(0,0,0,0.7)",
          }}
        />
        {/* Inner gold pinstripe */}
        <div
          className="absolute inset-x-0 top-4 h-px opacity-80"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #d8b65a 20%, #f0d480 50%, #d8b65a 80%, transparent 100%)",
          }}
        />
        {/* Scalloped bottom edge */}
        <div
          className="absolute inset-x-0 -bottom-4 h-7"
          style={{
            background: VALANCE_BG,
            WebkitMaskImage:
              "radial-gradient(circle 22px at 44px 0, transparent 20px, black 21px)",
            WebkitMaskRepeat: "repeat-x",
            WebkitMaskSize: "88px 28px",
            maskImage:
              "radial-gradient(circle 22px at 44px 0, transparent 20px, black 21px)",
            maskRepeat: "repeat-x",
            maskSize: "88px 28px",
          }}
        />
        {/* Gold fringe along the scalloped edge */}
        <div
          className="absolute inset-x-0 bottom-0 h-1"
          style={{
            background:
              "linear-gradient(180deg, #f0d480 0%, #b8902f 100%)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        />
        {/* Center medallion — small gold ornament */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="h-8 w-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #f8e29a 0%, #c89e44 50%, #6e5018 100%)",
              boxShadow:
                "0 2px 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,240,200,0.6)",
            }}
          />
        </div>
      </motion.div>

      {/* Marquee text appears once panels meet */}
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
              color: "#f0d480",
              textShadow:
                "0 1px 0 rgba(255,255,200,0.35), 0 -1px 0 rgba(0,0,0,0.8), 0 4px 14px rgba(0,0,0,0.7), 0 0 20px rgba(255,200,140,0.2)",
            }}
          >
            Lopes
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.6em] text-[#f0d480]/75">
            Now Showing · Vol. V
          </div>
        </div>
      </motion.div>
    </>
  );
}
