"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * ACCOUNTING LEDGER — heavy cordovan-leather book cover with
 * foil-stamped frames and title. Swings closed across the
 * screen on cover, opens off the top on uncover.
 * ============================================================ */
export function AccountingLedgerCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="accounting-ledger"
      initial={{ y: "-100%" }}
      animate={{ y: phase === "covering" ? "0%" : "-100%" }}
      transition={{
        duration: phase === "covering" ? coverMs / 1000 : uncoverMs / 1000,
        ease: phase === "covering" ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1],
      }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Cordovan leather field */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #5a2530 0%, #3a1620 55%, #1d0810 100%)",
        }}
      />
      {/* Leather grain — fine cross-hatch */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(35deg,
              rgba(255,255,255,0.05) 0,
              rgba(255,255,255,0.05) 1px,
              transparent 1px, transparent 3px),
            repeating-linear-gradient(-35deg,
              rgba(0,0,0,0.10) 0,
              rgba(0,0,0,0.10) 1px,
              transparent 1px, transparent 3px)
          `,
        }}
      />
      {/* Worn highlights — irregular soft glints */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 200px 80px at 25% 20%, rgba(255,230,200,0.10), transparent),
            radial-gradient(ellipse 150px 60px at 80% 75%, rgba(255,230,200,0.08), transparent)
          `,
        }}
      />
      {/* Spine shadow on the left edge */}
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      {/* Bottom shadow under the book */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Embossed double-frame in gold foil */}
      <div
        className="absolute inset-12 border-2 rounded-[1px]"
        style={{
          borderColor: "rgba(201, 166, 101, 0.55)",
          boxShadow:
            "inset 0 1px 0 rgba(255,230,180,0.25), inset 0 -1px 0 rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.7)",
        }}
      />
      <div
        className="absolute inset-16 border rounded-[1px]"
        style={{
          borderColor: "rgba(201, 166, 101, 0.35)",
        }}
      />

      {/* Centered foil-stamped title plate */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.55em] text-amber-200/55">
            Vol. I · Capital Markets
          </div>
          <div
            className="mt-5 font-display text-[clamp(48px,7vw,96px)] font-medium italic leading-none"
            style={{
              color: "#e8d09a",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.25), 0 -1px 0 rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            Lopes &amp; Co.
          </div>
          <div className="mx-auto mt-4 h-px w-40 bg-amber-200/35" />
          <div
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.6em]"
            style={{
              color: "#c9a665",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.18), 0 -1px 0 rgba(0,0,0,0.5)",
            }}
          >
            Ledger · MMXXVI
          </div>
        </div>
      </div>

      {/* Wax seal — bottom right corner */}
      <div className="absolute bottom-20 right-20 hidden md:block">
        <div
          className="relative h-16 w-16 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #b8201a 0%, #7a0e0a 60%, #3a0604 100%)",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center font-display text-[28px] font-semibold italic text-[#3a0604]"
            style={{
              textShadow: "0 1px 0 rgba(255,180,180,0.3), 0 -1px 0 rgba(0,0,0,0.5)",
            }}
          >
            L
          </div>
        </div>
      </div>
    </motion.div>
  );
}
