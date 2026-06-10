"use client";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/**
 * Chalkboard — slate panel in a wood frame slides in horizontally,
 * a felt eraser sweeps across the chalk word, slides off other side.
 */
export function ChalkboardCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const coverSec = coverMs / 1000;
  const uncoverSec = uncoverMs / 1000;
  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        animation: isCovering
          ? `cbIn ${coverSec}s cubic-bezier(0.7,0,0.84,0) both`
          : `cbOut ${uncoverSec}s cubic-bezier(0.16,1,0.3,1) both`,
      }}
    >
      <style>{`@keyframes cbIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}@keyframes cbOut{from{transform:translateX(0)}to{transform:translateX(100%)}}@keyframes cbErase{0%{transform:translate(-30%,-50%);opacity:0}8%{opacity:1}100%{transform:translate(130%,-50%);opacity:1}}`}</style>
      {/* SVG defs — chalk paint filter for irregular edges */}
      <svg aria-hidden="true" className="absolute -top-px -left-px h-px w-px">
        <defs>
          <filter id="chalk-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.8" />
          </filter>
        </defs>
      </svg>

      {/* Wood frame — outer molding */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #6e4e2d 0%, #5a3e22 40%, #46301a 80%, #2a1e10 100%)",
        }}
      >
        {/* Wood grain on the frame */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg,
                rgba(255,230,180,0.10) 0,
                rgba(255,230,180,0.10) 1px,
                transparent 1px, transparent 4px,
                rgba(0,0,0,0.18) 4px, rgba(0,0,0,0.18) 5px,
                transparent 5px, transparent 9px,
                rgba(255,230,180,0.06) 9px, rgba(255,230,180,0.06) 10px,
                transparent 10px, transparent 14px),
              radial-gradient(ellipse 200px 6px at 30% 10%, rgba(0,0,0,0.25), transparent),
              radial-gradient(ellipse 100px 4px at 70% 50%, rgba(0,0,0,0.20), transparent)
            `,
          }}
        />
        {/* Inner bevel of the frame */}
        <div className="absolute inset-6 md:inset-10">
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),inset_0_-2px_4px_rgba(255,220,170,0.15)]" />
        </div>
      </div>

      {/* Slate inside the frame */}
      <div className="absolute inset-6 overflow-hidden md:inset-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 35% 25%, #2a3530 0%, #1a221e 50%, #0e1311 100%)",
          }}
        />
        {/* Slate texture — subtle uneven grain */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.4px), radial-gradient(rgba(0,0,0,0.30) 1px, transparent 1.4px)",
            backgroundSize: "6px 6px, 9px 9px",
          }}
        />
        {/* Old chalk dust haze */}
        <div
          className="absolute inset-0 opacity-22 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 70%, rgba(255,255,250,0.18) 0, transparent 45%), radial-gradient(circle at 78% 32%, rgba(255,255,250,0.13) 0, transparent 35%), radial-gradient(circle at 50% 90%, rgba(255,255,250,0.15) 0, transparent 30%)",
          }}
        />
        {/* Slate inset shadow + glassy reflection */}
        <div className="absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.65),inset_0_0_2px_rgba(255,255,255,0.08)] pointer-events-none" />

        {/* Chalk text — eyebrow + emphasis, irregular edges via filter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 1000 360" className="h-auto w-[84%]">
            {/* Eyebrow in mono chalk */}
            <text
              x="500"
              y="58"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize="15"
              fill="rgba(255,250,235,0.58)"
              letterSpacing="9"
              filter="url(#chalk-rough)"
            >
              VOL. III · EDUCATION
            </text>
            {/* Emphasis — chalk Fraunces italic, two lines */}
            <text
              x="500"
              y="190"
              textAnchor="middle"
              fontFamily='"Fraunces", "EB Garamond", Georgia, serif'
              fontSize="92"
              fontStyle="italic"
              fontWeight="400"
              fill="rgba(255,250,235,0.92)"
              filter="url(#chalk-rough)"
              style={{ filter: "url(#chalk-rough) drop-shadow(0 0 8px rgba(255,255,235,0.18))" }}
            >
              The new architecture
            </text>
            <text
              x="500"
              y="296"
              textAnchor="middle"
              fontFamily='"Fraunces", "EB Garamond", Georgia, serif'
              fontSize="92"
              fontStyle="italic"
              fontWeight="400"
              fill="rgba(255,250,235,0.92)"
              filter="url(#chalk-rough)"
              style={{ filter: "url(#chalk-rough) drop-shadow(0 0 8px rgba(255,255,235,0.18))" }}
            >
              of learning.
            </text>
          </svg>
        </div>

        {/* Chalk eraser sweep — felt block with wooden back (CSS-driven) */}
        <div
          className="absolute top-1/2 h-16 w-32"
          style={
            isCovering
              ? { animation: `cbErase 0.7s ease-in-out ${(coverMs / 2000).toFixed(2)}s both` }
              : { transform: "translate(-30%,-50%)", opacity: 0 }
          }
        >
          {/* Chalk dust trail behind */}
          <div className="absolute -inset-y-2 -left-12 w-12 bg-gradient-to-r from-transparent to-white/35 blur-[3px]" />
          {/* Wood backing */}
          <div
            className="absolute inset-x-0 top-0 h-7 rounded-t-sm"
            style={{
              background:
                "linear-gradient(180deg, #c2925a 0%, #8e6535 60%, #5e4423 100%)",
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,225,180,0.4), inset 0 -1px 0 rgba(0,0,0,0.4)",
            }}
          />
          {/* Wood grain on the back */}
          <div
            className="absolute inset-x-0 top-0 h-7 rounded-t-sm opacity-40 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.20) 0, rgba(0,0,0,0.20) 1px, transparent 1px, transparent 4px)",
            }}
          />
          {/* Felt body */}
          <div
            className="absolute inset-x-0 top-7 h-7 rounded-b-sm"
            style={{
              background:
                "linear-gradient(180deg, #d9c294 0%, #c0a978 50%, #a89060 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.35)",
            }}
          />
          {/* Chalk-stained underside */}
          <div className="absolute inset-x-0 bottom-0 h-2 rounded-b-sm bg-white/55 blur-[2px]" />
        </div>

        {/* Chalk tray with chalk pieces */}
        <div
          className="absolute inset-x-0 bottom-0 h-5"
          style={{
            background:
              "linear-gradient(180deg, #4a341c 0%, #2c1d10 60%, #1a0f08 100%)",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(0,0,0,0.5)",
          }}
        >
          {/* Chalk dust on the tray */}
          <div className="absolute inset-x-0 top-0 h-1 bg-white/25 blur-[1px]" />
          {/* Chalk pieces lying on the tray */}
          <div className="absolute left-[18%] top-1 h-2 w-12 rounded-sm bg-gradient-to-b from-[#f6f0db] to-[#d8cfb0] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
          <div className="absolute left-[70%] top-1 h-2 w-8 rounded-sm bg-gradient-to-b from-[#f6f0db] to-[#d8cfb0] shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </div>
  );
}
