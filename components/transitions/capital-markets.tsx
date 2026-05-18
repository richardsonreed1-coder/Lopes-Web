"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * CANDLESTICK — Bloomberg-terminal-style trading screen.
 * Multi-pane layout: header / main chart with MAs / volume /
 * RSI / time-and-sales tape. A green playhead sweeps L→R
 * revealing the chart in its wake.
 * ============================================================ */

const CANDLE_COUNT = 56;
const CANDLES = Array.from({ length: CANDLE_COUNT }).map((_, i) => {
  const drift = Math.sin(i * 0.14) * 14 + Math.sin(i * 0.41) * 4;
  const open = 184.2 + drift;
  const close = open + Math.sin(i * 0.83 + 0.3) * 1.6 + (Math.sin(i * 0.27) > 0 ? 0.4 : -0.4);
  const high = Math.max(open, close) + Math.abs(Math.cos(i * 0.71)) * 1.2;
  const low = Math.min(open, close) - Math.abs(Math.sin(i * 0.93)) * 1.2;
  const vol = 80_000 + Math.abs(Math.sin(i * 0.45) * 220_000) + Math.abs(Math.cos(i * 0.31) * 180_000);
  return { open, close, high, low, up: close >= open, vol };
});

// Simple moving averages
function sma(series: number[], window: number) {
  return series.map((_, i) => {
    if (i < window - 1) return null;
    let sum = 0;
    for (let j = i - window + 1; j <= i; j++) sum += series[j];
    return sum / window;
  });
}
const CLOSES = CANDLES.map((c) => c.close);
const MA20 = sma(CLOSES, 20);
const MA50 = sma(CLOSES, 50);

// Time-and-sales tape (most recent trades, descending time)
const TS_ROWS = Array.from({ length: 14 }).map((_, i) => {
  const sec = 42 - i * 3;
  const minutes = 9;
  const px = CANDLES[CANDLES.length - 1 - i].close;
  const sz = [100, 200, 300, 500, 700, 1000, 1500, 2000][Math.abs(Math.floor(Math.sin(i * 1.3) * 7))];
  const side = Math.sin(i * 1.7) > 0 ? "B" : "S";
  return {
    time: `${minutes}:${(sec < 0 ? sec + 60 : sec).toString().padStart(2, "0")}:${Math.abs(Math.floor(Math.sin(i * 2.1) * 60)).toString().padStart(2, "0")}`,
    px: px.toFixed(2),
    sz: sz.toString(),
    side,
  };
});

const VIEW_W = 1000;
const MAIN_H = 240;
const VOL_H = 60;
const RSI_H = 40;
const VIEW_H = MAIN_H + VOL_H + RSI_H + 20;
const PAD_X = 40;
const COL_W = (VIEW_W - PAD_X * 2) / CANDLE_COUNT;
const BODY_W = COL_W * 0.55;

const ALL = CANDLES.flatMap((c) => [c.high, c.low]);
const Y_MIN = Math.min(...ALL) - 0.5;
const Y_MAX = Math.max(...ALL) + 0.5;
const yToMain = (v: number) => 8 + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * (MAIN_H - 16);

const VOL_MAX = Math.max(...CANDLES.map((c) => c.vol));
const yToVol = (v: number) => MAIN_H + 8 + (1 - v / VOL_MAX) * (VOL_H - 12);

// Fake RSI 14 series
const RSI_SERIES = CANDLES.map((_, i) =>
  50 + Math.sin(i * 0.32) * 22 + Math.sin(i * 0.11) * 8
);
const yToRsi = (v: number) =>
  MAIN_H + VOL_H + 8 + (1 - (v / 100)) * (RSI_H - 10);

const UP = "rgba(96, 220, 140, 0.95)";
const DOWN = "rgba(244, 100, 100, 0.95)";
const LAST = CANDLES[CANDLES.length - 1];

export function CandlestickCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="candlestick"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "covering" ? 1 : 0 }}
      transition={{
        duration: phase === "covering" ? coverMs / 1000 : uncoverMs / 1000,
        ease: "easeOut",
      }}
      className="fixed inset-0 z-[100] pointer-events-none bg-[#06070a]"
    >
      {/* Subtle phosphor scanlines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(220,180,80,0.05) 2px, rgba(220,180,80,0.05) 3px)",
        }}
      />
      {/* Soft CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Top header bar — Bloomberg-amber on black */}
      <div className="absolute inset-x-0 top-0 border-b border-amber-300/20 bg-black/60 px-6 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300/90">
          <div className="flex items-center gap-6">
            <span className="font-bold text-amber-300">LCAP US Equity</span>
            <span className="text-paper/55">Lopes Capital Corp</span>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <span>BID <span className="text-amber-300">184.20</span></span>
            <span>ASK <span className="text-amber-300">184.24</span></span>
            <span>LAST <span className="font-bold text-amber-300">{LAST.close.toFixed(2)}</span></span>
            <span className="text-emerald-300">+0.42</span>
            <span className="text-emerald-300">+0.23%</span>
          </div>
          <div className="text-amber-300/60">{new Date().toISOString().slice(0, 10)}</div>
        </div>
      </div>

      {/* Sub-header row — OHLC + range */}
      <div className="absolute inset-x-0 top-[52px] border-b border-amber-300/10 bg-black/40 px-6 py-2">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-paper/55">
          <div className="flex gap-5">
            <span>O <span className="text-paper">{LAST.open.toFixed(2)}</span></span>
            <span>H <span className="text-paper">{LAST.high.toFixed(2)}</span></span>
            <span>L <span className="text-paper">{LAST.low.toFixed(2)}</span></span>
            <span>C <span className="text-paper">{LAST.close.toFixed(2)}</span></span>
          </div>
          <div className="hidden gap-5 md:flex">
            <span>52W H <span className="text-paper">198.40</span></span>
            <span>52W L <span className="text-paper">142.18</span></span>
            <span>VOL <span className="text-paper">1.24M</span></span>
            <span>MKT CAP <span className="text-paper">42.8B</span></span>
          </div>
          <div className="text-amber-300/55">5m · LIVE</div>
        </div>
      </div>

      {/* Main grid: left chart pane + right time-and-sales sidebar */}
      <div className="absolute inset-x-0 top-[96px] bottom-[44px] flex px-6">
        {/* Chart pane */}
        <div className="flex-1 pr-6">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id="chart-sweep">
                <motion.rect
                  x="0" y="0" height={VIEW_H}
                  initial={{ width: 0 }}
                  animate={{ width: phase === "covering" ? VIEW_W : VIEW_W }}
                  transition={{ duration: coverMs / 1000, ease: "linear" }}
                />
              </clipPath>
              <pattern id="chart-grid-main" x="0" y="0" width={20} height={(MAIN_H - 16) / 6} patternUnits="userSpaceOnUse">
                <path d={`M 20 0 L 0 0 0 ${(MAIN_H - 16) / 6}`} fill="none" stroke="rgba(220,180,80,0.07)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Main chart background grid */}
            <rect x={PAD_X} y={8} width={VIEW_W - PAD_X * 2} height={MAIN_H - 16} fill="url(#chart-grid-main)" />
            {/* Volume pane separator */}
            <line x1={PAD_X} x2={VIEW_W - PAD_X} y1={MAIN_H + 4} y2={MAIN_H + 4} stroke="rgba(220,180,80,0.2)" strokeWidth="0.5" />
            {/* RSI pane separator */}
            <line x1={PAD_X} x2={VIEW_W - PAD_X} y1={MAIN_H + VOL_H + 4} y2={MAIN_H + VOL_H + 4} stroke="rgba(220,180,80,0.2)" strokeWidth="0.5" />

            {/* Pane labels */}
            <text x={PAD_X + 4} y={20} fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fill="rgba(220,180,80,0.45)" letterSpacing="2">PRICE</text>
            <text x={PAD_X + 4} y={MAIN_H + 18} fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fill="rgba(220,180,80,0.45)" letterSpacing="2">VOLUME</text>
            <text x={PAD_X + 4} y={MAIN_H + VOL_H + 18} fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="8" fill="rgba(220,180,80,0.45)" letterSpacing="2">RSI 14</text>

            {/* RSI levels */}
            <line x1={PAD_X} x2={VIEW_W - PAD_X} y1={yToRsi(70)} y2={yToRsi(70)} stroke="rgba(244,100,100,0.25)" strokeWidth="0.4" strokeDasharray="2 2" />
            <line x1={PAD_X} x2={VIEW_W - PAD_X} y1={yToRsi(30)} y2={yToRsi(30)} stroke="rgba(96,220,140,0.25)" strokeWidth="0.4" strokeDasharray="2 2" />

            {/* Y-axis labels — price */}
            {Array.from({ length: 5 }).map((_, i) => {
              const v = Y_MIN + ((Y_MAX - Y_MIN) * (4 - i)) / 4;
              return (
                <text
                  key={i}
                  x={VIEW_W - PAD_X + 4}
                  y={yToMain(v) + 3}
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                  fontSize="9"
                  fill="rgba(220,180,80,0.55)"
                >
                  {v.toFixed(2)}
                </text>
              );
            })}

            {/* All content revealed by the sweep */}
            <g clipPath="url(#chart-sweep)">
              {/* Candles */}
              {CANDLES.map((c, i) => {
                const x = PAD_X + i * COL_W + COL_W / 2;
                const yH = yToMain(c.high);
                const yL = yToMain(c.low);
                const yTop = Math.min(yToMain(c.open), yToMain(c.close));
                const h = Math.max(1.5, Math.abs(yToMain(c.close) - yToMain(c.open)));
                const color = c.up ? UP : DOWN;
                return (
                  <g key={i}>
                    <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth="1" />
                    <rect x={x - BODY_W / 2} y={yTop} width={BODY_W} height={h} fill={color} />
                  </g>
                );
              })}

              {/* MA20 — bright */}
              <polyline
                fill="none"
                stroke="rgba(120,180,255,0.85)"
                strokeWidth="1.2"
                points={MA20.map((v, i) => v == null ? "" : `${PAD_X + i * COL_W + COL_W / 2},${yToMain(v)}`).filter(Boolean).join(" ")}
              />
              {/* MA50 — dim orange */}
              <polyline
                fill="none"
                stroke="rgba(255,170,80,0.7)"
                strokeWidth="1.2"
                points={MA50.map((v, i) => v == null ? "" : `${PAD_X + i * COL_W + COL_W / 2},${yToMain(v)}`).filter(Boolean).join(" ")}
              />

              {/* Volume bars */}
              {CANDLES.map((c, i) => {
                const x = PAD_X + i * COL_W + COL_W / 2;
                const y0 = MAIN_H + VOL_H - 4;
                const y1 = yToVol(c.vol);
                const color = c.up ? "rgba(96,220,140,0.6)" : "rgba(244,100,100,0.6)";
                return (
                  <rect
                    key={`v-${i}`}
                    x={x - BODY_W / 2}
                    y={y1}
                    width={BODY_W}
                    height={Math.max(1, y0 - y1)}
                    fill={color}
                  />
                );
              })}

              {/* RSI line */}
              <polyline
                fill="none"
                stroke="rgba(220,180,80,0.85)"
                strokeWidth="1"
                points={RSI_SERIES.map((v, i) => `${PAD_X + i * COL_W + COL_W / 2},${yToRsi(v)}`).join(" ")}
              />
            </g>

            {/* Playhead scanline */}
            <motion.line
              initial={{ x: 0 }}
              animate={{ x: phase === "covering" ? VIEW_W : VIEW_W }}
              transition={{ duration: coverMs / 1000, ease: "linear" }}
              y1="0" y2={VIEW_H}
              stroke="rgba(120,255,180,0.9)"
              strokeWidth="1.2"
              style={{ filter: "drop-shadow(0 0 4px rgba(120,255,180,0.9))" }}
            />

            {/* Crosshair + last-price label after sweep */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "covering" ? 1 : 0 }}
              transition={{ delay: phase === "covering" ? coverMs / 1000 : 0, duration: 0.25 }}
            >
              <line x1={PAD_X} x2={VIEW_W - PAD_X} y1={yToMain(LAST.close)} y2={yToMain(LAST.close)} stroke="rgba(244,239,227,0.45)" strokeWidth="0.5" strokeDasharray="3 3" />
              <rect x={VIEW_W - PAD_X} y={yToMain(LAST.close) - 9} width="52" height="18" fill="rgba(96,220,140,0.95)" />
              <text x={VIEW_W - PAD_X + 26} y={yToMain(LAST.close) + 4} fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="11" fontWeight="700" fill="#06070a" textAnchor="middle">
                {LAST.close.toFixed(2)}
              </text>
            </motion.g>
          </svg>
        </div>

        {/* Time-and-sales sidebar */}
        <div className="hidden w-[220px] flex-col border-l border-amber-300/15 pl-4 lg:flex">
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-amber-300/55">
            Time &amp; Sales
          </div>
          <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.05em]">
            <span className="text-paper/35">Time</span>
            <span className="text-paper/35">Px</span>
            <span className="text-right text-paper/35">Sz</span>
            <span className="text-right text-paper/35">·</span>
            {TS_ROWS.map((r, i) => (
              <div key={i} className="contents">
                <span className="text-paper/55">{r.time}</span>
                <span className={r.side === "B" ? "text-emerald-300" : "text-red-400"}>{r.px}</span>
                <span className="text-right text-paper/65">{r.sz}</span>
                <span className={`text-right ${r.side === "B" ? "text-emerald-300/80" : "text-red-400/80"}`}>{r.side}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-amber-300/20 bg-black/60 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <span>SESSION · OPEN</span>
          <span className="hidden md:inline">MA(20) <span className="text-[#78b4ff]">●</span>   MA(50) <span className="text-[#ffaa50]">●</span>   VOL  RSI</span>
          <span>Lopes · Tape · MMXXVI</span>
        </div>
      </div>
    </motion.div>
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
