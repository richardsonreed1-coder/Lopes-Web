"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * CANDLESTICK CHART — black monitor screen. A vertical green
 * playhead sweeps left→right, revealing candles in its wake
 * like an ECG trace drawing in real time.
 * ============================================================ */

const CANDLE_COUNT = 36;
const CANDLES = Array.from({ length: CANDLE_COUNT }).map((_, i) => {
  const drift = Math.sin(i * 0.18) * 14 + Math.sin(i * 0.41) * 5;
  const open = 100 + drift;
  const close = open + Math.sin(i * 1.07 + 0.4) * 7 + (Math.sin(i * 0.31) > 0 ? 2 : -2);
  const high = Math.max(open, close) + Math.abs(Math.cos(i * 0.83)) * 5;
  const low = Math.min(open, close) - Math.abs(Math.sin(i * 0.97)) * 5;
  return { open, close, high, low, up: close >= open };
});

const VIEW_W = 1000;
const VIEW_H = 360;
const PAD_X = 32;
const PAD_Y = 40;
const COL_W = (VIEW_W - PAD_X * 2) / CANDLE_COUNT;
const BODY_W = COL_W * 0.55;

const ALL_VALS = CANDLES.flatMap((c) => [c.high, c.low]);
const Y_MIN = Math.min(...ALL_VALS) - 2;
const Y_MAX = Math.max(...ALL_VALS) + 2;
const yToPx = (v: number) =>
  PAD_Y + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * (VIEW_H - PAD_Y * 2);

const UP_COLOR = "rgba(110, 231, 183, 0.95)";   // emerald
const DOWN_COLOR = "rgba(244, 114, 114, 0.95)"; // muted red
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
      className="fixed inset-0 z-[100] pointer-events-none bg-black"
    >
      {/* Phosphor scanlines — same as EKG monitor */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(80, 220, 120, 0.06) 2px, rgba(80, 220, 120, 0.06) 3px)",
        }}
      />

      {/* Top-left vitals-style readout */}
      <div className="absolute left-8 top-8 font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-300/85 space-y-1">
        <div>LCAP · <span className="text-emerald-300">+0.42</span></div>
        <div>OPEN · <span className="text-emerald-300">{LAST.open.toFixed(2)}</span></div>
        <div>HIGH · <span className="text-emerald-300">{LAST.high.toFixed(2)}</span></div>
        <div>LOW · <span className="text-emerald-300">{LAST.low.toFixed(2)}</span></div>
      </div>
      {/* Top-right system label */}
      <div className="absolute right-8 top-8 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45 text-right space-y-1">
        <div>Lopes · Unit I</div>
        <div>Tape · MMXXVI</div>
        <div>5m · LIVE</div>
      </div>

      {/* Chart */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[clamp(280px,42vh,420px)] px-4 md:px-10">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Reveal mask that sweeps L→R with the same timing as the EKG trace */}
            <clipPath id="candle-sweep">
              <motion.rect
                x="0"
                y="0"
                height={VIEW_H}
                initial={{ width: 0 }}
                animate={{ width: phase === "covering" ? VIEW_W : VIEW_W }}
                transition={{ duration: coverMs / 1000, ease: "linear" }}
              />
            </clipPath>
            {/* EKG-style grid */}
            <pattern id="candle-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(80,220,120,0.10)" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width={VIEW_W} height={VIEW_H} fill="url(#candle-grid)" />

          {/* Candles revealed under the sweep */}
          <g clipPath="url(#candle-sweep)">
            {CANDLES.map((c, i) => {
              const x = PAD_X + i * COL_W + COL_W / 2;
              const yHigh = yToPx(c.high);
              const yLow = yToPx(c.low);
              const bodyTop = Math.min(yToPx(c.open), yToPx(c.close));
              const bodyH = Math.max(2, Math.abs(yToPx(c.close) - yToPx(c.open)));
              const color = c.up ? UP_COLOR : DOWN_COLOR;
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={color} strokeWidth="1" />
                  <rect
                    x={x - BODY_W / 2}
                    y={bodyTop}
                    width={BODY_W}
                    height={bodyH}
                    fill={color}
                  />
                </g>
              );
            })}
          </g>

          {/* Playhead — vertical green scanline at the leading edge of the reveal */}
          <motion.line
            initial={{ x: 0 }}
            animate={{ x: phase === "covering" ? VIEW_W : VIEW_W }}
            transition={{ duration: coverMs / 1000, ease: "linear" }}
            y1="0"
            y2={VIEW_H}
            stroke="rgba(110, 231, 183, 0.9)"
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 6px rgba(110,231,183,0.9))" }}
          />

          {/* Final crosshair + price label, fades in once the sweep finishes */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "covering" ? 1 : 0 }}
            transition={{
              delay: phase === "covering" ? coverMs / 1000 : 0,
              duration: 0.25,
            }}
          >
            <line
              x1={PAD_X}
              x2={VIEW_W - PAD_X}
              y1={yToPx(LAST.close)}
              y2={yToPx(LAST.close)}
              stroke="rgba(244,239,227,0.4)"
              strokeWidth="0.6"
              strokeDasharray="3 3"
            />
            <rect
              x={VIEW_W - PAD_X - 50}
              y={yToPx(LAST.close) - 10}
              width="48"
              height="18"
              fill="rgba(110,231,183,0.9)"
              rx="2"
            />
            <text
              x={VIEW_W - PAD_X - 26}
              y={yToPx(LAST.close) + 3}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="11"
              fontWeight="700"
              fill="#0a0b10"
              textAnchor="middle"
            >
              {LAST.close.toFixed(2)}
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Bottom corner status — matches the EKG monitor */}
      <div className="absolute left-8 bottom-8 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/55">
        ▮ rec · {new Date().toISOString().slice(0, 10)}
      </div>
    </motion.div>
  );
}
