"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * DISTORTION FIELD — the Capital Markets transition.
 *
 * An abstract volatility waveform on near-black ink. A luminous
 * violet band ("price discovery") sweeps left→right; as it passes,
 * each bar surges and brightens then settles into a repriced state
 * — a wave of distortion rippling through the market. Resolves to
 * the section title. No skeuomorphic terminal chrome — purely
 * editorial, on the Obsidian palette.
 *
 * Driven entirely by CSS @keyframes (not Framer). In this stack
 * (Next 16 / React 19 / motion 12) Framer's mount-time `animate`
 * intermittently stranded elements at their initial opacity; CSS
 * animations run deterministically on mount and never strand.
 * ============================================================ */

const BAR_COUNT = 56;

// Deterministic volatility profile — calmer at the edges, more
// active through the middle (a soft envelope over layered sines).
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / (BAR_COUNT - 1);
  const envelope = 0.32 + 0.68 * Math.sin(Math.PI * t);
  const noise =
    0.5 +
    0.3 * Math.sin(i * 0.55) +
    0.18 * Math.sin(i * 1.27 + 1.1) +
    0.1 * Math.sin(i * 2.9 + 0.4);
  const amp = Math.min(1, Math.max(0.14, noise * envelope));
  return { amp };
});

const ACCENT = "#7A4FD9"; // curtain accent (kept stable for Capital Markets)
const ACCENT_BRIGHT = "#A988F5"; // on-screen display tint

export function CandlestickCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const coverSec = coverMs / 1000;
  const uncoverSec = uncoverMs / 1000;
  const rippleSpan = coverSec * 0.7; // ripple front crosses over most of cover
  const titleDelay = coverSec * 0.42;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0E0F12] pointer-events-none"
      style={{
        animation: isCovering
          ? `cmFade ${Math.min(0.2, coverSec)}s ease-out both`
          : `cmFadeOut ${uncoverSec}s ease-out both`,
      }}
    >
      <style>{`
        @keyframes cmFade{from{opacity:0}to{opacity:1}}
        @keyframes cmFadeOut{from{opacity:1}to{opacity:0}}
        @keyframes cmRise{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:none}}
        @keyframes cmBar{0%{transform:scaleY(0.16);opacity:.2}45%{transform:scaleY(1.22);opacity:1}100%{transform:scaleY(1);opacity:.88}}
        @keyframes cmAxis{0%{transform:scaleX(0);opacity:0}100%{transform:scaleX(1);opacity:.6}}
        @keyframes cmSweep{0%{left:-16%;opacity:0}12%{opacity:1}82%{opacity:1}100%{left:108%;opacity:0}}
      `}</style>

      {/* Ambient violet bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 80% at 50% 52%, rgba(122,79,217,0.32) 0%, rgba(122,79,217,0.12) 40%, transparent 72%)",
        }}
      />
      {/* Edge vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* PAYLOAD — title resolves as the wave passes through */}
      <div
        className="absolute inset-x-0 top-[20%] flex flex-col items-center text-center"
        style={{ animation: `cmRise 0.6s cubic-bezier(0.16,1,0.3,1) ${titleDelay}s both` }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-paper/55">
          Vol. I · Capital Markets
        </div>
        <div
          className="mt-4 font-display text-[clamp(40px,6vw,84px)] font-medium italic leading-none text-paper"
          style={{ textShadow: "0 0 40px rgba(122,79,217,0.35)" }}
        >
          Pricing the distortion.
        </div>
      </div>

      {/* WAVEFORM BAND */}
      <div className="absolute inset-x-0 top-[46%] h-[40vh] px-[6vw]">
        <div className="relative h-full w-full">
          {/* fair-value axis */}
          <div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{
              transformOrigin: "left",
              background: `linear-gradient(90deg, transparent, ${ACCENT_BRIGHT} 12%, ${ACCENT_BRIGHT} 88%, transparent)`,
              boxShadow: `0 0 10px ${ACCENT}aa`,
              animation: `cmAxis ${(coverSec * 0.9).toFixed(2)}s ease-out both`,
            }}
          />

          {/* bars, centered on the axis */}
          <div className="absolute inset-0 flex items-center justify-between gap-[2px]">
            {BARS.map((b, i) => (
              <div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: `${(b.amp * 100).toFixed(2)}%`,
                  transformOrigin: "center",
                  background: `linear-gradient(180deg, #C9B5FF, ${ACCENT})`,
                  boxShadow: `0 0 14px ${ACCENT}aa`,
                  animation: `cmBar 0.55s cubic-bezier(0.16,1,0.3,1) ${(
                    (i / (BAR_COUNT - 1)) *
                    rippleSpan
                  ).toFixed(3)}s both`,
                  willChange: "transform, opacity",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* PRICE-DISCOVERY SWEEP — luminous band lights the wave as it crosses */}
      <div
        className="absolute inset-y-0 w-[16%]"
        style={{
          background: `radial-gradient(60% 50% at 50% 50%, ${ACCENT_BRIGHT}66 0%, ${ACCENT}33 40%, transparent 75%)`,
          filter: "blur(28px)",
          mixBlendMode: "screen",
          animation: `cmSweep ${(coverSec * 0.92).toFixed(2)}s linear both`,
        }}
      />
      {/* the sweep's bright leading edge */}
      <div
        className="absolute inset-y-[20%] w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${ACCENT_BRIGHT}, transparent)`,
          boxShadow: `0 0 12px 2px ${ACCENT_BRIGHT}`,
          animation: `cmSweep ${(coverSec * 0.92).toFixed(2)}s linear both`,
        }}
      />
    </div>
  );
}

/* ============================================================
 * ORDER BOOK COLLISION — two opposing walls of terminal data
 * (bids in blue, asks in red) close in toward center, collide
 * in a white kinetic flash, then shatter into a particle burst
 * of ASCII characters that decelerate and fade.
 * ============================================================ */

const WALL_ROWS = 50;
const PARTICLE_CHARS = ["+", ".", "1", "0", ":", "-", "·", "|", "/", "\\"];
const PARTICLE_COUNT = 140;

// Deterministic PRNG so the burst is the same every replay.
function mulberry32(seed: number) {
  return function () {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(0xc0ffee);

type Particle = {
  id: number;
  dx: number;
  dy: number;
  char: string;
  color: string;
  duration: number;
};

const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = rand() * Math.PI * 2;
  const speed = 240 + rand() * 520;
  return {
    id: i,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    char: PARTICLE_CHARS[Math.floor(rand() * PARTICLE_CHARS.length)],
    color: rand() < 0.5 ? "#7ab8ff" : "#ff6a6a",
    duration: 1.1 + rand() * 0.7,
  };
});

// Bid/ask rows of plausible book data — generated once.
const BID_ROWS = Array.from({ length: WALL_ROWS }, (_, i) => {
  const px = (184.20 - i * 0.02).toFixed(2);
  const sz = (100 + Math.abs(Math.floor(Math.sin(i * 1.7) * 1800))).toString().padStart(5, " ");
  return `B  ${px}  ×${sz}  █████`;
});
const ASK_ROWS = Array.from({ length: WALL_ROWS }, (_, i) => {
  const px = (184.22 + i * 0.02).toFixed(2);
  const sz = (100 + Math.abs(Math.floor(Math.cos(i * 1.3) * 1800))).toString().padStart(5, " ");
  return `█████  ${sz}×  ${px}  A`;
});

export function OrderBookCollisionCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";

  // Phase timing as a fraction of coverMs
  const approachEnd = 0.45;   // walls have met by 45% through cover
  const flashStart  = 0.45;
  const flashEnd    = 0.55;
  const particleStart = 0.52;
  const payloadStart  = 0.80;

  const coverSec = coverMs / 1000;
  const uncoverSec = uncoverMs / 1000;

  return (
    <motion.div
      key="order-book-collision"
      initial={{ opacity: 0 }}
      animate={{ opacity: isCovering ? 1 : 0 }}
      transition={{ duration: isCovering ? 0.12 : uncoverSec, ease: "easeOut" }}
      className="fixed inset-0 z-[100] overflow-hidden bg-black pointer-events-none"
    >
      {/* Terminal scanlines */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(120,180,255,0.05) 2px, rgba(120,180,255,0.05) 3px)",
        }}
      />

      {/* LEFT WALL — bids, blue */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{
          x: isCovering ? "0%" : "-100%",
          opacity: isCovering ? [1, 1, 0] : 1,
        }}
        transition={{
          x: { duration: coverSec * approachEnd, ease: [0.55, 0, 0.65, 0] },
          opacity: {
            duration: 0.08,
            delay: coverSec * flashEnd,
            times: [0, 0.5, 1],
          },
        }}
        className="absolute left-0 top-0 h-full w-1/2 overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #0a1430 0%, #142a5e 60%, #1d3d82 100%)",
          boxShadow: "inset -20px 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <pre className="absolute inset-0 whitespace-pre p-4 font-mono text-[11px] leading-[14px] tracking-wide text-[#7ab8ff]/85">
          {BID_ROWS.join("\n")}
        </pre>
        {/* Wall depth — repeating bid header */}
        <div className="absolute left-4 top-2 font-mono text-[9px] uppercase tracking-[0.4em] text-[#cfe4ff]/65">
          BIDS · DOM
        </div>
      </motion.div>

      {/* RIGHT WALL — asks, red */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{
          x: isCovering ? "0%" : "100%",
          opacity: isCovering ? [1, 1, 0] : 1,
        }}
        transition={{
          x: { duration: coverSec * approachEnd, ease: [0.55, 0, 0.65, 0] },
          opacity: {
            duration: 0.08,
            delay: coverSec * flashEnd,
            times: [0, 0.5, 1],
          },
        }}
        className="absolute right-0 top-0 h-full w-1/2 overflow-hidden"
        style={{
          background: "linear-gradient(270deg, #1a0a0a 0%, #4a1414 60%, #7a1a1a 100%)",
          boxShadow: "inset 20px 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <pre className="absolute inset-0 whitespace-pre p-4 text-right font-mono text-[11px] leading-[14px] tracking-wide text-[#ff8a8a]/85">
          {ASK_ROWS.join("\n")}
        </pre>
        <div className="absolute right-4 top-2 font-mono text-[9px] uppercase tracking-[0.4em] text-[#ffd0d0]/65">
          ASKS · DOM
        </div>
      </motion.div>

      {/* FLASH — white kinetic impact across the screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isCovering ? [0, 1, 0.4, 0] : 0 }}
        transition={{
          duration: coverSec * (flashEnd - flashStart) + 0.05,
          delay: coverSec * flashStart,
          times: [0, 0.25, 0.6, 1],
          ease: "easeOut",
        }}
        className="absolute inset-0 bg-white"
        style={{ mixBlendMode: "screen" }}
      />

      {/* PARTICLE BURST — characters spray outward from the impact point */}
      {isCovering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative h-0 w-0">
            {PARTICLES.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 1.4 }}
                animate={{
                  x: p.dx,
                  y: p.dy,
                  opacity: [0, 1, 1, 0],
                  scale: [1.4, 1, 0.9, 0.6],
                }}
                transition={{
                  duration: p.duration,
                  delay: coverSec * particleStart,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.05, 0.5, 1],
                }}
                className="absolute font-mono text-[16px] font-bold leading-none"
                style={{
                  color: p.color,
                  textShadow: `0 0 6px ${p.color}, 0 0 12px ${p.color}80`,
                  willChange: "transform, opacity",
                }}
              >
                {p.char}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* PAYLOAD — section title revealed behind the dispersing particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isCovering ? 1 : 0 }}
        transition={{
          duration: 0.45,
          delay: coverSec * payloadStart,
          ease: "easeOut",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-paper/55">
            VOL. I · CAPITAL MARKETS
          </div>
          <div className="mt-4 font-display text-[clamp(40px,6vw,80px)] font-medium italic leading-none text-paper">
            Pricing the distortion.
          </div>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.4em] text-paper/45">
            Spread crossed · {new Date().toISOString().slice(11, 19)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
