"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * VITALS TRACE — the Healthcare transition.
 *
 * A single luminous ECG heartbeat line draws itself across a
 * near-black field while a bright pulse runs along it; the trace
 * settles and the section title resolves. Healthcare-coded (vitals)
 * but abstract and editorial — no monitor bezel, LEDs, soft keys,
 * or numerics. Teal Obsidian palette.
 *
 * Driven entirely by CSS @keyframes (not Framer): in this stack
 * (Next 16 / React 19 / motion 12) Framer's mount-time `animate`
 * intermittently stranded elements; CSS animations run
 * deterministically on mount and never strand.
 * ============================================================ */

const ECG_W = 1000;
const ECG_MID = 150;

// One PQRST heartbeat complex as [fractionOfComplexWidth, yOffsetFromMid].
const ECG_SEG: [number, number][] = [
  [0.0, 0], [0.3, 0], [0.35, -20], [0.41, 0], [0.45, 16],
  [0.49, -118], [0.53, 58], [0.57, 0], [0.71, -32], [0.82, 0], [1.0, 0],
];

function buildEcgPath(complexes: number): string {
  const cw = ECG_W / complexes;
  const pts: string[] = [];
  for (let c = 0; c < complexes; c++) {
    const x0 = c * cw;
    for (const [fx, dy] of ECG_SEG) {
      pts.push(`${(x0 + fx * cw).toFixed(1)},${(ECG_MID + dy).toFixed(1)}`);
    }
  }
  return "M " + pts.join(" L ");
}

const ECG_PATH = buildEcgPath(4);

const HC_ACCENT = "#244B4F"; // curtain accent (kept stable for Healthcare)
const HC_BRIGHT = "#5BB8C0"; // on-screen teal
const HC_GLOW = "#8FE6EC"; // bright traveling pulse / glow

export function EkgMonitorCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const coverSec = coverMs / 1000;
  const uncoverSec = uncoverMs / 1000;
  const drawDur = (coverSec * 0.85).toFixed(2);
  const titleDelay = coverSec * 0.5;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0E0F12] pointer-events-none"
      style={{
        animation: isCovering
          ? `hcFade ${Math.min(0.2, coverSec)}s ease-out both`
          : `hcFadeOut ${uncoverSec}s ease-out both`,
      }}
    >
      <style>{`
        @keyframes hcFade{from{opacity:0}to{opacity:1}}
        @keyframes hcFadeOut{from{opacity:1}to{opacity:0}}
        @keyframes hcRise{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:none}}
        @keyframes ecgDraw{to{stroke-dashoffset:0}}
        @keyframes ecgPulse{from{stroke-dashoffset:1.06}to{stroke-dashoffset:-0.04}}
        @keyframes ecgBaseline{0%{transform:scaleX(0);opacity:0}100%{transform:scaleX(1);opacity:.45}}
      `}</style>

      {/* Ambient teal bloom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 80% at 50% 54%, rgba(91,184,192,0.20) 0%, rgba(36,75,79,0.14) 42%, transparent 72%)",
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

      {/* PAYLOAD — title resolves as the trace completes */}
      <div
        className="absolute inset-x-0 top-[22%] flex flex-col items-center text-center"
        style={{ animation: `hcRise 0.6s cubic-bezier(0.16,1,0.3,1) ${titleDelay}s both` }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-paper/55">
          Vol. IV · Healthcare
        </div>
        <div
          className="mt-4 font-display text-[clamp(40px,6vw,84px)] font-medium italic leading-none text-paper"
          style={{ textShadow: `0 0 40px ${HC_BRIGHT}55` }}
        >
          The parallel health economy.
        </div>
      </div>

      {/* ECG TRACE */}
      <div className="absolute inset-x-0 top-[52%] h-[34vh] px-[5vw]">
        <div className="relative h-full w-full">
          {/* faint isoelectric baseline */}
          <div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{
              transformOrigin: "left",
              background: `linear-gradient(90deg, transparent, ${HC_ACCENT} 10%, ${HC_ACCENT} 90%, transparent)`,
              boxShadow: `0 0 8px ${HC_ACCENT}`,
              animation: `ecgBaseline ${drawDur}s ease-out both`,
            }}
          />
          <svg viewBox={`0 0 ${ECG_W} 300`} className="h-full w-full" preserveAspectRatio="none">
            {/* the trace draws itself in */}
            <path
              d={ECG_PATH}
              pathLength={1}
              fill="none"
              stroke={HC_BRIGHT}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1"
              strokeDashoffset={1}
              style={{
                filter: `drop-shadow(0 0 5px ${HC_BRIGHT}) drop-shadow(0 0 1px ${HC_BRIGHT})`,
                animation: `ecgDraw ${drawDur}s linear both`,
              }}
            />
            {/* a bright pulse runs along the trace */}
            <path
              d={ECG_PATH}
              pathLength={1}
              fill="none"
              stroke={HC_GLOW}
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0.05 0.95"
              strokeDashoffset={1.06}
              style={{
                filter: `drop-shadow(0 0 8px ${HC_GLOW}) drop-shadow(0 0 3px ${HC_GLOW})`,
                animation: `ecgPulse ${drawDur}s linear both`,
              }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * LASER SCAN — pure black overlay. A red laser line sweeps top
 * to bottom, leaving a phosphor trail. A body silhouette in red
 * contour fills in as the scan progresses. Percent readout.
 * ============================================================ */
export function LaserScanCurtain({ phase, coverMs, uncoverMs }: Props) {
  const progress = useMotionValue(0);
  const [pct, setPct] = useState("000");

  useEffect(() => {
    const target = phase === "covering" ? 1 : 0;
    const controls = animate(progress, target, {
      duration: (phase === "covering" ? coverMs : uncoverMs) / 1000,
      ease: "linear",
    });
    const unsub = progress.on("change", (v) => {
      setPct(Math.round(v * 100).toString().padStart(3, "0"));
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [phase, coverMs, uncoverMs, progress]);

  const lineY = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      key="laser-scan"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "covering" ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] pointer-events-none bg-[#04060a]"
    >
      {/* Scanline grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 30px, rgba(255,80,80,0.06) 30px, rgba(255,80,80,0.06) 31px), repeating-linear-gradient(90deg, transparent 0, transparent 30px, rgba(255,80,80,0.06) 30px, rgba(255,80,80,0.06) 31px)",
        }}
      />

      {/* Body silhouette — fades in as scan progresses */}
      <motion.div
        style={{ opacity: useTransform(progress, [0, 0.4, 1], [0, 0.4, 0.85]) }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 200 480" className="h-[78vh] w-auto max-w-[420px]">
          <g
            fill="none"
            stroke="rgba(255,60,60,0.85)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,60,60,0.7))" }}
          >
            {/* Head */}
            <circle cx="100" cy="42" r="28" />
            <line x1="100" y1="40" x2="100" y2="42" />
            {/* Neck */}
            <line x1="92" y1="70" x2="92" y2="86" />
            <line x1="108" y1="70" x2="108" y2="86" />
            {/* Shoulders + torso */}
            <line x1="60" y1="100" x2="140" y2="100" />
            <line x1="60" y1="100" x2="64" y2="220" />
            <line x1="140" y1="100" x2="136" y2="220" />
            {/* Arms */}
            <line x1="60" y1="100" x2="46" y2="220" />
            <line x1="46" y1="220" x2="40" y2="280" />
            <line x1="140" y1="100" x2="154" y2="220" />
            <line x1="154" y1="220" x2="160" y2="280" />
            {/* Hands */}
            <circle cx="40" cy="290" r="6" />
            <circle cx="160" cy="290" r="6" />
            {/* Waist + hips */}
            <line x1="64" y1="220" x2="136" y2="220" />
            <line x1="68" y1="240" x2="132" y2="240" />
            {/* Legs */}
            <line x1="80" y1="240" x2="76" y2="380" />
            <line x1="120" y1="240" x2="124" y2="380" />
            <line x1="76" y1="380" x2="78" y2="440" />
            <line x1="124" y1="380" x2="122" y2="440" />
            {/* Feet */}
            <line x1="66" y1="445" x2="92" y2="445" />
            <line x1="108" y1="445" x2="134" y2="445" />
            {/* Contour cross-lines (chakras / meridians) */}
            <line x1="78" y1="140" x2="122" y2="140" strokeDasharray="2 3" opacity="0.5" />
            <line x1="78" y1="180" x2="122" y2="180" strokeDasharray="2 3" opacity="0.5" />
            <line x1="78" y1="260" x2="122" y2="260" strokeDasharray="2 3" opacity="0.5" />
            <line x1="80" y1="320" x2="120" y2="320" strokeDasharray="2 3" opacity="0.5" />
          </g>
        </svg>
      </motion.div>

      {/* Phosphor trail behind the laser */}
      <motion.div
        style={{ top: lineY }}
        className="absolute inset-x-0 -translate-y-full h-[40vh]"
      >
        <div className="h-full w-full bg-gradient-to-b from-transparent to-red-500/20" />
      </motion.div>

      {/* The laser line itself */}
      <motion.div
        style={{ top: lineY }}
        className="absolute inset-x-0 -translate-y-1/2 h-px bg-red-500"
      >
        <div className="absolute inset-0 bg-red-500" style={{ boxShadow: "0 0 12px rgba(255,40,40,1), 0 0 24px rgba(255,40,40,0.8), 0 0 48px rgba(255,40,40,0.5)" }} />
      </motion.div>

      {/* Corner readouts */}
      <div className="absolute left-8 top-8 font-mono text-[11px] uppercase tracking-[0.25em] text-red-400/85 space-y-1">
        <div>Scan · <span className="text-red-300">in progress</span></div>
        <div>Subject · PT.LOPES</div>
        <div>Wavelength · 660 / 850 nm</div>
        <div>Frequency · 40.0 hz</div>
      </div>
      <div className="absolute right-8 top-8 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55 space-y-1">
        <div>Lopes · BiOFIELD · IV</div>
        <div>Protocol · PBM-04</div>
        <div>Session · {new Date().toISOString().slice(0, 10).replace(/-/g, "/")}</div>
      </div>
      <div className="absolute left-1/2 top-8 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-red-400/85">
        SCAN · <span className="tabular-nums text-red-300">{pct}</span>%
      </div>

      <div className="absolute left-8 bottom-8 font-mono text-[10px] uppercase tracking-[0.3em] text-red-400/55">
        ▮ rec · {new Date().toISOString().slice(0, 10)}
      </div>
    </motion.div>
  );
}

/* ============================================================
 * FREQUENCY TUNER — four horizontal sine-wave lanes at different
 * frequencies. Each draws in left→right with stagger; the
 * frequencies "lock" with a LOCKED indicator.
 * ============================================================ */

function sinePath(cycles: number, amplitude: number, width: number, height: number) {
  const points: string[] = [];
  const step = 4;
  for (let x = 0; x <= width; x += step) {
    const y = height / 2 + amplitude * Math.sin((x / width) * cycles * Math.PI * 2);
    points.push(`${x},${y.toFixed(2)}`);
  }
  return "M " + points.join(" L ");
}

const FREQS = [
  { hz: "7.83", label: "Schumann", color: "rgb(255, 90, 90)",  cycles: 2.5 },
  { hz: "40.00", label: "Gamma",   color: "rgb(255, 180, 80)", cycles: 6 },
  { hz: "432.0", label: "Verdi",   color: "rgb(120, 220, 200)", cycles: 14 },
  { hz: "528.0", label: "Solfeggio", color: "rgb(180, 140, 255)", cycles: 18 },
];

export function FrequencyTunerCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="frequency-tuner"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "covering" ? 1 : 0 }}
      transition={{
        duration: phase === "covering" ? coverMs / 1000 : uncoverMs / 1000,
        ease: "easeOut",
      }}
      className="fixed inset-0 z-[100] pointer-events-none bg-[#04060a]"
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(180, 140, 255, 0.04) 2px, rgba(180, 140, 255, 0.04) 3px)",
        }}
      />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 border-b border-paper/15 bg-black/80 px-6 py-3">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper/85">
          <div className="flex items-center gap-5">
            <span className="text-emerald-300">●</span>
            <span className="text-paper">Frequency · Tuner</span>
            <span className="text-paper/55">Protocol · Daingle-04</span>
          </div>
          <div className="text-paper/65">SESSION · LOCKED</div>
        </div>
      </div>

      {/* Lanes */}
      <div className="absolute inset-x-0 top-[52px] bottom-[44px] flex flex-col px-6">
        {FREQS.map((f, idx) => (
          <div
            key={f.hz}
            className="flex flex-1 items-center gap-4 border-b border-paper/10 last:border-b-0"
          >
            {/* Label */}
            <div className="w-28 shrink-0">
              <div
                className="font-mono text-[12px] font-bold tabular-nums tracking-[0.15em]"
                style={{ color: f.color, textShadow: `0 0 6px ${f.color}55` }}
              >
                {f.hz} Hz
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40">
                {f.label}
              </div>
            </div>

            {/* Waveform */}
            <div className="relative h-[68%] flex-1">
              <svg viewBox="0 0 1000 100" className="h-full w-full" preserveAspectRatio="none">
                <defs>
                  <pattern id={`grid-f-${f.hz}`} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(180,140,255,0.05)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="1000" height="100" fill={`url(#grid-f-${f.hz})`} />
                <line x1="0" x2="1000" y1="50" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <motion.path
                  d={sinePath(f.cycles, 32, 1000, 100)}
                  fill="none"
                  stroke={f.color}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 5px ${f.color}) drop-shadow(0 0 1px ${f.color})` }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: coverMs / 1000,
                    ease: "linear",
                    delay: idx * 0.08,
                  }}
                />
              </svg>
            </div>

            {/* Lock indicator */}
            <div className="w-24 shrink-0 text-right">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "covering" ? 1 : 0 }}
                transition={{
                  delay: phase === "covering" ? (coverMs / 1000) * 0.75 + idx * 0.08 : 0,
                  duration: 0.2,
                }}
                className="inline-flex items-center gap-2 rounded-sm border px-2 py-1"
                style={{
                  borderColor: `${f.color}66`,
                  color: f.color,
                  boxShadow: `0 0 8px ${f.color}30`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: f.color, boxShadow: `0 0 4px ${f.color}` }}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em]">Lock</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-paper/15 bg-black/80 px-6 py-2.5">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
          <div className="flex items-center gap-5">
            <span className="text-emerald-300">●</span>
            <span>Resonance · Phase coherent</span>
          </div>
          <div className="text-paper/45">▮ Lopes · Frequency · IV</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
 * LED PANEL — red-light therapy device. Brushed-aluminum
 * housing, grid of LEDs that ignite in an expanding wave from
 * the center outward.
 * ============================================================ */

const PANEL_ROWS = 5;
const PANEL_COLS = 7;

export function LedPanelCurtain({ phase, coverMs, uncoverMs }: Props) {
  // Precompute LED positions + their distance from center
  const leds = [];
  const cx = (PANEL_COLS - 1) / 2;
  const cy = (PANEL_ROWS - 1) / 2;
  const maxDist = Math.hypot(cx, cy);
  for (let r = 0; r < PANEL_ROWS; r++) {
    for (let c = 0; c < PANEL_COLS; c++) {
      const dist = Math.hypot(c - cx, r - cy);
      const delay = (dist / maxDist) * 0.7; // normalized 0..0.7
      leds.push({ r, c, delay });
    }
  }

  return (
    <motion.div
      key="led-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "covering" ? 1 : 0 }}
      transition={{
        duration: phase === "covering" ? (coverMs / 1000) * 0.3 : (uncoverMs / 1000) * 0.6,
        ease: "easeOut",
      }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Dark exam room behind the panel */}
      <div className="absolute inset-0 bg-[#0a0c0e]" />

      {/* Aluminum housing — fills most of the screen with margins */}
      <div className="absolute inset-6 md:inset-12">
        {/* Outer chassis */}
        <div
          className="absolute inset-0 rounded-[3px]"
          style={{
            background:
              "linear-gradient(180deg, #4a4c50 0%, #3a3c40 35%, #2a2c30 100%)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.5)",
          }}
        />
        {/* Brushed grain on housing */}
        <div
          className="absolute inset-0 rounded-[3px] opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Inner inset frame around the LEDs */}
        <div className="absolute inset-6 rounded-[2px] bg-[#0e1012] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)] md:inset-10">
          {/* LED grid */}
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              gridTemplateColumns: `repeat(${PANEL_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${PANEL_ROWS}, 1fr)`,
              gap: "8px",
              padding: "20px",
            }}
          >
            {leds.map(({ r, c, delay }) => (
              <motion.div
                key={`${r}-${c}`}
                initial={{ opacity: 0.18 }}
                animate={{ opacity: phase === "covering" ? 1 : 0.18 }}
                transition={{
                  delay: phase === "covering" ? delay : 0,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="relative h-12 w-12 rounded-full md:h-16 md:w-16"
              >
                {/* LED housing (dark ring) */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, #1a0808 0%, #0a0404 70%, #050202 100%)",
                    boxShadow:
                      "inset 0 1px 2px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.08)",
                  }}
                />
                {/* Lit center */}
                <div
                  className="absolute inset-[18%] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 35%, #ffd0c0 0%, #ff3030 30%, #c40808 70%, #5a0404 100%)",
                    boxShadow:
                      "0 0 16px rgba(255,40,40,0.95), 0 0 32px rgba(255,40,40,0.65), 0 0 48px rgba(255,40,40,0.3), inset 0 1px 2px rgba(255,255,255,0.45)",
                  }}
                />
                {/* Hotspot */}
                <div className="absolute left-[28%] top-[22%] h-2 w-2 rounded-full bg-white/60 blur-[1px]" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top label */}
        <div className="absolute left-6 top-2 flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              background: "#60dc8c",
              boxShadow: "0 0 6px #60dc8c",
            }}
          />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-paper/70">
            Lopes PB-04
          </span>
        </div>
        <div className="absolute right-6 top-2 font-mono text-[9px] uppercase tracking-[0.3em] text-paper/45">
          660 nm · 850 nm
        </div>

        {/* Bottom label */}
        <div className="absolute left-6 bottom-2 font-mono text-[9px] uppercase tracking-[0.3em] text-paper/45">
          Photobiomodulation · Class IV
        </div>
        <div className="absolute right-6 bottom-2 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-paper/45">
          <span>Session · 042</span>
          <span>·</span>
          <span>20 min</span>
        </div>
      </div>

      {/* Soft red wash from the panel onto the surrounding room */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,40,40,0.10) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

/* ============================================================
 * SPECTRAL SCAN — two terminal buffers stacked over a black
 * field. A bright cyan scanner line traverses left → right;
 * to the left of the line is the NEW buffer (active / cyan),
 * to the right is the OLD buffer (idle / dim white).
 * ============================================================ */

// Buffer A — idle / awaiting-biometrics state
const OLD_BUFFER = [
  "▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
  "[ LOPES · BIOFIELD · IV ]               BUFFER A · IDLE              [ STAND BY ]                ",
  "                                                                                                  ",
  ".. SENSOR_A ..  CH 01   STATUS  OFFLINE       SIGNAL  ---  dB    NOISE  ---  dB                  ",
  ".. SENSOR_B ..  CH 02   STATUS  OFFLINE       SIGNAL  ---  dB    NOISE  ---  dB                  ",
  ".. SENSOR_C ..  CH 03   STATUS  OFFLINE       SIGNAL  ---  dB    NOISE  ---  dB                  ",
  ".. SENSOR_D ..  CH 04   STATUS  OFFLINE       SIGNAL  ---  dB    NOISE  ---  dB                  ",
  "                                                                                                  ",
  "                                                                                                  ",
  "                       █████  █     █ █████ ████ █████ █████ █   █  █████                        ",
  "                       █   █  █     █ █   █  █     █     █   ██  █  █                            ",
  "                       █████  █  █  █ █████  █     █     █   █ █ █  █  ██                        ",
  "                       █   █  █ █ █ █ █   █  █     █     █   █  ██  █   █                        ",
  "                       █   █  ██   ██ █   █  █   █████ █████ █   █  █████                        ",
  "                                                                                                  ",
  "                  █████  █  █████ █     █ █████ █████ █████ █████ █  █████ █████                 ",
  "                  █   █  █ █    █ ██   ██ █     █   █ █   █ █   █ █ █     █                      ",
  "                  █████  █ █    █ █ █ █ █ █████ █████ █████ █████ █ █     █████                  ",
  "                  █   █  █ █    █ █  █  █ █     █   █ █  █  █     █ █         █                  ",
  "                  █████  █  █████ █     █ █████ █   █ █   █ █     █  █████ █████                 ",
  "                                                                                                  ",
  "                                                                                                  ",
  "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
  "[ CALIBRATING · NO SUBJECT DETECTED · 00:00:00 ]                                                  ",
];

// Buffer B — active / parallel-health-economy state
const NEW_BUFFER = [
  "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
  "[ LOPES · BIOFIELD · IV ]               BUFFER B · LIVE              [ STREAM ACTIVE ]           ",
  "                                                                                                  ",
  "** SENSOR_A **  CH 01   STATUS  ◉ ACTIVE     SIGNAL  −18  dB    NOISE  −62  dB                   ",
  "** SENSOR_B **  CH 02   STATUS  ◉ ACTIVE     SIGNAL  −22  dB    NOISE  −60  dB                   ",
  "** SENSOR_C **  CH 03   STATUS  ◉ ACTIVE     SIGNAL  −16  dB    NOISE  −64  dB                   ",
  "** SENSOR_D **  CH 04   STATUS  ◉ ACTIVE     SIGNAL  −20  dB    NOISE  −63  dB                   ",
  "                                                                                                  ",
  "                                                                                                  ",
  "      █████ █   █ █████   █████  █████ █████ █████ █     █     █████ █                           ",
  "        █   █   █ █       █   █  █   █ █   █ █   █ █     █     █     █                           ",
  "        █   █████ █████   █████  █████ █████ █████ █     █     █████ █                           ",
  "        █   █   █ █       █      █   █ █  █  █   █ █     █     █     █                           ",
  "        █   █   █ █████   █      █   █ █   █ █   █ █████ █████ █████ █████                       ",
  "                                                                                                  ",
  "      █   █ █████ █████ █     █████ █   █ █████ █████ █████ █████ █████ █████ █████              ",
  "      █   █ █     █   █ █       █   █   █ █     █     █   █ █   █ █   █ █   █ █   █              ",
  "      █████ █████ █████ █       █   █████ █████ █     █████ █████ █   █ █████ █████              ",
  "      █   █ █     █   █ █       █   █   █     █ █     █  █  █   █ █   █ █  █  █                  ",
  "      █   █ █████ █   █ █████   █   █   █ █████ █████ █   █ █████ █████ █   █ █                  ",
  "                                                                                                  ",
  "                                                                                                  ",
  "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓",
  "[ SUBJECT  LOPES, J ]  [ PROTOCOL  DAINGLE-04 ]  [ COHERENCE  98% ]  [ ▮ rec ]                   ",
];

export function SpectralScanCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const sweepDuration = (isCovering ? coverMs : uncoverMs) / 1000;

  return (
    <motion.div
      key="spectral-scan"
      initial={{ opacity: 0 }}
      animate={{ opacity: isCovering ? 1 : 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#040608] pointer-events-none"
      style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      {/* Phosphor scanlines */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,240,255,0.05) 2px, rgba(0,240,255,0.05) 3px)",
        }}
      />
      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Buffer A — OLD / idle (visible to the right of the scanner) */}
      <pre className="absolute inset-0 whitespace-pre p-8 text-[clamp(10px,1.05vw,14px)] leading-[1.5] tracking-tight text-paper/35">
        {OLD_BUFFER.join("\n")}
      </pre>

      {/* Buffer B — NEW / active (clip-path reveals as scanner sweeps right) */}
      <motion.div
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{
          clipPath: isCovering ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        }}
        transition={{ duration: sweepDuration, ease: "linear" }}
        className="absolute inset-0"
      >
        <pre
          className="absolute inset-0 whitespace-pre p-8 text-[clamp(10px,1.05vw,14px)] leading-[1.5] tracking-tight"
          style={{
            color: "rgba(120, 240, 255, 0.92)",
            textShadow:
              "0 0 4px rgba(0, 240, 255, 0.6), 0 0 8px rgba(0, 240, 255, 0.3)",
          }}
        >
          {NEW_BUFFER.join("\n")}
        </pre>
      </motion.div>

      {/* SCANNER LINE — bright cyan vertical bar with glow + soft trail */}
      <motion.div
        initial={{ left: "0%" }}
        animate={{ left: isCovering ? "100%" : "0%" }}
        transition={{ duration: sweepDuration, ease: "linear" }}
        className="absolute inset-y-0 w-px"
        style={{
          background: "rgba(180, 250, 255, 0.95)",
          boxShadow:
            "0 0 14px rgba(0, 240, 255, 1), 0 0 28px rgba(0, 240, 255, 0.7), 0 0 56px rgba(0, 240, 255, 0.35)",
        }}
      >
        {/* Trailing afterglow behind the scanner */}
        <div
          className="absolute right-0 top-0 h-full w-64 -mr-px"
          style={{
            background:
              "linear-gradient(270deg, rgba(0, 240, 255, 0.18), transparent)",
          }}
        />
      </motion.div>

      {/* Top status strip */}
      <div className="absolute inset-x-0 top-0 border-b border-cyan-300/15 bg-black/70 px-6 py-2">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper/65">
          <div className="flex items-center gap-5">
            <span className="text-cyan-300">●</span>
            <span className="text-paper">Spectral · Scan</span>
            <span className="text-paper/45">Sweep · in progress</span>
          </div>
          <div className="text-paper/55">
            {new Date().toISOString().slice(0, 10).replace(/-/g, "/")}
            {" · "}
            <span className="text-paper">{new Date().toISOString().slice(11, 19)}</span>
            {" UTC"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
