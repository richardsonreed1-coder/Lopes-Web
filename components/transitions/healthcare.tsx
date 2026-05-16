"use client";

import { motion } from "motion/react";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/* ============================================================
 * X-RAY LIGHTBOX — clinical viewing panel slides in
 * horizontally with a clipped chest X-ray film. Backlight
 * flickers on, holds, flickers off as it slides out.
 * ============================================================ */
export function XRayLightboxCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="xray-lightbox"
      initial={{ x: "-100%" }}
      animate={{ x: phase === "covering" ? "0%" : "100%" }}
      transition={{
        duration: phase === "covering" ? coverMs / 1000 : uncoverMs / 1000,
        ease: phase === "covering" ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1],
      }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Dark exam room — frames the lightbox */}
      <div className="absolute inset-0 bg-[#0c0e12]" />
      {/* Lightbox panel — fills most of the screen with a margin */}
      <div className="absolute inset-6 md:inset-10 overflow-hidden rounded-[2px] shadow-[0_0_60px_rgba(220,235,255,0.18)]">
        {/* Flickering backlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              phase === "covering"
                ? [0, 0.4, 0.15, 0.85, 0.6, 0.95, 0.9, 1]
                : [1, 0.6, 0.95, 0.2, 0],
          }}
          transition={{
            duration: phase === "covering" ? (coverMs / 1000) * 0.6 : (uncoverMs / 1000) * 0.6,
            ease: "linear",
            times: phase === "covering" ? [0, 0.1, 0.2, 0.35, 0.5, 0.7, 0.85, 1] : undefined,
          }}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, #f5f8ff 0%, #dde4ef 70%, #b8c4d4 100%)",
          }}
        />
        {/* Fluorescent tube tint — cool clinical white */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background:
              "linear-gradient(180deg, rgba(180,210,240,0.3) 0%, transparent 50%, rgba(180,210,240,0.3) 100%)",
          }}
        />

        {/* X-ray film clipped to the lightbox */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[78%] w-[58%] max-w-[640px]">
          {/* Chrome clips at the top */}
          <div className="absolute -top-3 left-[15%] h-5 w-12 rounded-sm bg-gradient-to-b from-[#d8dde3] to-[#7d8389] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]" />
          <div className="absolute -top-3 left-[44%] h-5 w-12 rounded-sm bg-gradient-to-b from-[#d8dde3] to-[#7d8389] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]" />
          <div className="absolute -top-3 right-[15%] h-5 w-12 rounded-sm bg-gradient-to-b from-[#d8dde3] to-[#7d8389] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]" />

          {/* Film: dark base, semi-transparent so the lightbox shows through */}
          <div
            className="absolute inset-0 rounded-[1px]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(20,28,38,0.92) 0%, rgba(8,12,18,0.98) 70%)",
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.7)",
            }}
          >
            {/* Chest X-ray silhouette — ribs + spine */}
            <svg
              viewBox="0 0 400 600"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Spine */}
              <line
                x1="200" y1="80" x2="200" y2="500"
                stroke="rgba(220,235,255,0.6)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Vertebrae notches */}
              {Array.from({ length: 14 }).map((_, i) => (
                <line
                  key={i}
                  x1="180" x2="220"
                  y1={100 + i * 28} y2={100 + i * 28}
                  stroke="rgba(180,200,220,0.4)"
                  strokeWidth="1"
                />
              ))}
              {/* Ribs — left side */}
              {Array.from({ length: 7 }).map((_, i) => (
                <path
                  key={`l-${i}`}
                  d={`M 200 ${140 + i * 36} Q 80 ${175 + i * 34} 105 ${260 + i * 30}`}
                  fill="none"
                  stroke="rgba(220,235,255,0.45)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
              {/* Ribs — right side */}
              {Array.from({ length: 7 }).map((_, i) => (
                <path
                  key={`r-${i}`}
                  d={`M 200 ${140 + i * 36} Q 320 ${175 + i * 34} 295 ${260 + i * 30}`}
                  fill="none"
                  stroke="rgba(220,235,255,0.45)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
              {/* Heart shadow */}
              <ellipse cx="170" cy="280" rx="55" ry="70" fill="rgba(40,55,72,0.6)" />
            </svg>

            {/* Patient label corner */}
            <div className="absolute bottom-3 right-3 rounded-[1px] border border-paper/25 bg-black/60 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.3em] text-paper/80">
              Lopes · PT.042 · {new Date().toISOString().slice(0, 10)}
            </div>
            {/* Orientation marker */}
            <div className="absolute top-3 right-4 font-mono text-[14px] font-bold text-paper/85">
              R
            </div>
          </div>
        </div>

        {/* Lightbox label plate */}
        <div className="absolute left-4 bottom-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[#3a4856]">
          Lopes · Radiology · IV
        </div>
        <div className="absolute right-4 bottom-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[#3a4856]">
          Viewer · 02
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
 * PRIVACY SCREEN — folding hospital partition on caster wheels
 * rolls in from one side, settles with a tiny wobble, rolls
 * out the other way.
 * ============================================================ */
export function PrivacyScreenCurtain({ phase, coverMs, uncoverMs }: Props) {
  return (
    <motion.div
      key="privacy-screen"
      initial={{ x: "-100%" }}
      animate={{ x: phase === "covering" ? "0%" : "100%" }}
      transition={{
        duration: phase === "covering" ? coverMs / 1000 : uncoverMs / 1000,
        ease: phase === "covering" ? [0.34, 1.2, 0.64, 1] : [0.16, 1, 0.3, 1],
      }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Pale teal-grey hospital-wall backdrop fills any gap behind the linen */}
      <div className="absolute inset-0 bg-[#c8cdc8]" />

      {/* Steel top rail */}
      <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#7d8389] via-[#9da3a8] to-[#5d6368] shadow-[inset_0_-1px_0_rgba(0,0,0,0.4)]" />
      {/* Steel bottom rail with wheels mounted below */}
      <div className="absolute inset-x-0 bottom-12 h-3 bg-gradient-to-b from-[#7d8389] via-[#9da3a8] to-[#5d6368] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.3)]" />

      {/* Three linen panels */}
      <div className="absolute inset-x-0 top-3 bottom-15 flex" style={{ bottom: "60px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative flex-1"
            style={{
              background:
                "linear-gradient(180deg, #efe8d4 0%, #e7dfca 50%, #d9d0b8 100%)",
              boxShadow:
                i === 1
                  ? "inset 4px 0 6px rgba(0,0,0,0.12), inset -4px 0 6px rgba(0,0,0,0.12)"
                  : i === 0
                    ? "inset -4px 0 6px rgba(0,0,0,0.12)"
                    : "inset 4px 0 6px rgba(0,0,0,0.12)",
            }}
          >
            {/* Linen weave */}
            <div
              className="absolute inset-0 opacity-35 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(120,100,70,0.18) 0, rgba(120,100,70,0.18) 1px, transparent 1px, transparent 3px),
                  repeating-linear-gradient(90deg, rgba(120,100,70,0.16) 0, rgba(120,100,70,0.16) 1px, transparent 1px, transparent 3px)
                `,
              }}
            />
            {/* Vertical stiles inside each panel — the steel frame */}
            <div className="absolute inset-y-0 left-0 w-px bg-[#3a3a3a]/40" />
            <div className="absolute inset-y-0 right-0 w-px bg-[#3a3a3a]/40" />

            {/* Center panel gets a small stenciled plate */}
            {i === 1 && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-[#3a3a3a]/30 bg-[#e0d8c2] px-4 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#3a3a3a]/65">
                  Lopes · Ward IV
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hinge shadows between panels */}
      <div
        className="absolute inset-y-3 left-1/3 w-2 pointer-events-none"
        style={{ bottom: "60px" }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-black/12 to-transparent" />
      </div>
      <div
        className="absolute inset-y-3 left-2/3 w-2 pointer-events-none"
        style={{ bottom: "60px" }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-black/12 to-transparent" />
      </div>

      {/* Wheels at the bottom — four small chrome casters */}
      <div className="absolute inset-x-0 bottom-2 flex justify-around px-12">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative h-8 w-8"
          >
            {/* Caster mounting bracket */}
            <div className="absolute inset-x-2 top-0 h-3 bg-gradient-to-b from-[#9da3a8] to-[#5d6368] rounded-t-sm" />
            {/* Wheel */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #d8dde3 0%, #7d8389 50%, #3a3d40 100%)",
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)",
              }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
