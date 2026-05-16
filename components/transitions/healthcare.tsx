"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/**
 * Multi-trace ICU monitor with a proper bezel, status LEDs, soft
 * keys, manufacturer plate, and AC + battery indicators around the
 * screen. ECG / SpO₂ pleth / ART pressure / CO₂ capnograph stacked
 * vertically, each with numerics. Each trace draws across with a
 * tiny lane-by-lane delay.
 */

type Trace = {
  key: string;
  label: string;
  unit: string;
  value: string;
  color: string;
  path: string;
  small?: string;
};

const TRACES: Trace[] = [
  {
    key: "ecg",
    label: "ECG II",
    unit: "bpm",
    value: "72",
    color: "rgb(96, 220, 140)",
    small: "PVC 0/min",
    path:
      "M 0 50 L 80 50 L 100 50 L 110 25 L 120 75 L 130 35 L 145 50 L 250 50 L 270 50 L 280 25 L 290 75 L 300 35 L 315 50 L 420 50 L 440 50 L 450 25 L 460 75 L 470 35 L 485 50 L 590 50 L 610 50 L 620 25 L 630 75 L 640 35 L 655 50 L 760 50 L 780 50 L 790 25 L 800 75 L 810 35 L 825 50 L 1000 50",
  },
  {
    key: "spo2",
    label: "SpO₂",
    unit: "%",
    value: "98",
    color: "rgb(255, 220, 90)",
    small: "PI 1.4",
    path:
      "M 0 60 Q 30 40 50 50 Q 75 75 100 60 Q 130 30 160 55 Q 185 70 210 60 Q 240 35 270 55 Q 295 70 320 60 Q 350 35 380 55 Q 405 70 430 60 Q 460 35 490 55 Q 515 70 540 60 Q 570 35 600 55 Q 625 70 650 60 Q 680 35 710 55 Q 735 70 760 60 Q 790 35 820 55 Q 845 70 870 60 Q 900 35 930 55 Q 955 70 980 60 L 1000 60",
  },
  {
    key: "art",
    label: "ART",
    unit: "mmHg",
    value: "118/76",
    color: "rgb(244, 100, 100)",
    small: "MAP 90",
    path:
      "M 0 70 L 50 70 L 60 20 L 80 35 L 90 30 L 110 70 L 175 70 L 185 20 L 205 35 L 215 30 L 235 70 L 300 70 L 310 20 L 330 35 L 340 30 L 360 70 L 425 70 L 435 20 L 455 35 L 465 30 L 485 70 L 550 70 L 560 20 L 580 35 L 590 30 L 610 70 L 675 70 L 685 20 L 705 35 L 715 30 L 735 70 L 800 70 L 810 20 L 830 35 L 840 30 L 860 70 L 1000 70",
  },
  {
    key: "co2",
    label: "CO₂",
    unit: "mmHg",
    value: "38",
    color: "rgb(170, 220, 255)",
    small: "RR 14",
    path:
      "M 0 80 L 60 80 L 75 30 L 130 30 L 145 80 L 220 80 L 235 30 L 290 30 L 305 80 L 380 80 L 395 30 L 450 30 L 465 80 L 540 80 L 555 30 L 610 30 L 625 80 L 700 80 L 715 30 L 770 30 L 785 80 L 860 80 L 875 30 L 930 30 L 945 80 L 1000 80",
  },
];

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
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Hospital wall behind the monitor */}
      <div className="absolute inset-0 bg-[#1a1c1f]" />

      {/* Outer bezel — dark medical-grade plastic frame */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #2c2e32 0%, #1c1e22 50%, #14161a 100%)",
        }}
      >
        {/* Bezel inner bevel — gives it depth */}
        <div className="absolute inset-2 rounded-[1px] shadow-[inset_0_2px_3px_rgba(0,0,0,0.6),inset_0_-1px_2px_rgba(255,255,255,0.06)]" />

        {/* Top bezel — manufacturer plate + status LEDs */}
        <div className="absolute inset-x-2 top-2 flex h-10 items-center justify-between px-6">
          {/* Manufacturer plate */}
          <div className="flex items-center gap-3">
            <div
              className="h-5 w-5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #244B4F 0%, #15292d 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            />
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-paper/70">
              Lopes Medical
            </div>
            <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-paper/35">
              IntelliVue MX-450
            </div>
          </div>
          {/* Status LEDs cluster */}
          <div className="flex items-center gap-3">
            <StatusLed color="#60dc8c" label="AC" />
            <StatusLed color="#60dc8c" label="BAT" />
            <StatusLed color="#60dc8c" label="NET" />
            <StatusLed color="#dcd060" label="ALM" pulse />
          </div>
        </div>

        {/* Bottom bezel — soft keys / function buttons */}
        <div className="absolute inset-x-2 bottom-2 flex h-10 items-center justify-around px-4">
          {["MENU", "ALARMS", "TRENDS", "PRINT", "SILENCE", "SETTINGS"].map((k, i) => (
            <div
              key={k}
              className="flex flex-col items-center gap-0.5"
            >
              <div
                className="h-5 w-12 rounded-[2px]"
                style={{
                  background:
                    "linear-gradient(180deg, #3a3c40 0%, #1e2024 60%, #14161a 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 1px rgba(0,0,0,0.6), 0 1px 1px rgba(0,0,0,0.5)",
                }}
              />
              <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-paper/45">
                {k}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* The screen — inset with a slight inner shadow */}
      <div
        className="absolute inset-x-3 top-14 bottom-14 overflow-hidden bg-[#040608]"
        style={{
          boxShadow:
            "inset 0 0 30px rgba(0,0,0,0.95), inset 0 0 1px rgba(120,200,255,0.15)",
        }}
      >
        {/* Glass reflection — subtle top-left highlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%)",
          }}
        />

        {/* CRT scanlines */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(120, 200, 255, 0.05) 2px, rgba(120, 200, 255, 0.05) 3px)",
          }}
        />
        {/* Soft vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Top patient bar */}
        <div className="absolute inset-x-0 top-0 border-b border-paper/15 bg-black/80 px-6 py-3">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper/85">
            <div className="flex items-center gap-5">
              <span className="text-emerald-300">●</span>
              <span className="text-paper">ICU · 4</span>
              <span className="text-paper/55">Bed 042</span>
              <span className="text-paper/55">PT.LOPES, J · M · 47</span>
            </div>
            <div className="hidden items-center gap-5 md:flex">
              <span className="text-paper/55">ADM 05/14</span>
              <span className="text-paper/55">DAY 03</span>
              <span className="text-paper/55">DR. KWON</span>
            </div>
            <div className="text-paper/65">
              {new Date().toISOString().slice(0, 10).replace(/-/g, "/")}
              {" · "}
              <span className="text-paper">{new Date().toISOString().slice(11, 16)}</span>
              {" UTC"}
            </div>
          </div>
        </div>

        {/* Trace lanes */}
        <div className="absolute inset-x-0 top-[52px] bottom-[44px] flex flex-col px-6">
          {TRACES.map((tr, idx) => (
            <div
              key={tr.key}
              className="flex flex-1 items-center gap-4 border-b border-paper/10 last:border-b-0"
            >
              {/* Trace label */}
              <div className="w-20 shrink-0">
                <div
                  className="font-mono text-[12px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: tr.color, textShadow: `0 0 6px ${tr.color}50` }}
                >
                  {tr.label}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40">
                  {tr.small}
                </div>
              </div>

              {/* Trace waveform */}
              <div className="relative h-[80%] flex-1">
                <svg
                  viewBox="0 0 1000 100"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern id={`grid-${tr.key}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(120,200,255,0.06)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="1000" height="100" fill={`url(#grid-${tr.key})`} />
                  <motion.path
                    d={tr.path}
                    fill="none"
                    stroke={tr.color}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0 0 5px ${tr.color}) drop-shadow(0 0 1px ${tr.color})` }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: phase === "covering" ? 1 : 1 }}
                    transition={{
                      duration: coverMs / 1000,
                      ease: "linear",
                      delay: idx * 0.06,
                    }}
                  />
                </svg>
              </div>

              {/* Numeric readout */}
              <div className="w-36 shrink-0 text-right">
                <div
                  className="font-mono text-[clamp(28px,4.5vw,52px)] font-bold leading-none tabular-nums"
                  style={{
                    color: tr.color,
                    textShadow: `0 0 8px ${tr.color}40`,
                  }}
                >
                  {tr.value}
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-paper/45">
                  {tr.unit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom alarm bar */}
        <div className="absolute inset-x-0 bottom-0 border-t border-paper/15 bg-black/80 px-6 py-2.5">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
            <div className="flex items-center gap-5">
              <span className="text-emerald-300">●</span>
              <span>Telemetry · Stable</span>
              <span className="hidden text-paper/40 md:inline">Alarms 2 silenced</span>
            </div>
            <div className="hidden md:block">
              HR limit <span className="text-paper">50–110</span>
              {"   "}SpO₂ limit <span className="text-paper">≥ 92</span>
            </div>
            <div className="text-paper/45">▮ rec · Lopes · Unit IV</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusLed({
  color,
  label,
  pulse = false,
}: {
  color: string;
  label: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`h-2 w-2 rounded-full ${pulse ? "animate-pulse" : ""}`}
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}, 0 0 2px ${color}`,
        }}
      />
      <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-paper/50">
        {label}
      </span>
    </div>
  );
}
