"use client";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/**
 * Theater curtains — heavy velvet drapes with vertical pleat shadows meet under
 * a gold-trimmed proscenium valance, then resolve to the section thesis.
 * CSS-driven (deterministic on mount; Framer's mount-time animate strands here).
 */

const VELVET = `
  repeating-linear-gradient(90deg,
    rgba(0,0,0,0.55) 0,
    rgba(0,0,0,0.30) 8px,
    rgba(255,255,255,0.06) 22px,
    rgba(0,0,0,0.20) 36px,
    rgba(0,0,0,0.55) 48px),
  linear-gradient(180deg, #6e0f1a 0%, #4a0a13 60%, #2a0509 100%)
`;

const VALANCE = `
  repeating-linear-gradient(90deg,
    rgba(0,0,0,0.45) 0,
    rgba(0,0,0,0.20) 6px,
    rgba(255,255,255,0.07) 18px,
    rgba(0,0,0,0.20) 30px,
    rgba(0,0,0,0.45) 40px),
  linear-gradient(180deg, #7e1422 0%, #5a0e18 100%)
`;

export function TheaterCurtainsCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const coverSec = coverMs / 1000;
  const uncoverSec = uncoverMs / 1000;
  const coverEase = "cubic-bezier(0.65,0.05,0.36,1)";
  const uncoverEase = "cubic-bezier(0.16,1,0.3,1)";

  return (
    <>
      <style>{`
        @keyframes tcLeftIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes tcLeftOut{from{transform:translateX(0)}to{transform:translateX(-100%)}}
        @keyframes tcRightIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes tcRightOut{from{transform:translateX(0)}to{transform:translateX(100%)}}
        @keyframes tcValIn{from{transform:translateY(-100%)}to{transform:translateY(0)}}
        @keyframes tcValOut{from{transform:translateY(0)}to{transform:translateY(-100%)}}
        @keyframes tcRise{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:none}}
      `}</style>

      {/* Left velvet panel */}
      <div
        className="fixed left-0 top-0 bottom-0 z-[100] w-[52%] pointer-events-none"
        style={{
          background: VELVET,
          animation: isCovering
            ? `tcLeftIn ${coverSec}s ${coverEase} both`
            : `tcLeftOut ${uncoverSec}s ${uncoverEase} both`,
        }}
      >
        {/* Inner meeting edge shadow */}
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/85 to-transparent" />
        {/* Gold cord at the bottom hem */}
        <div
          className="absolute inset-x-0 bottom-3 h-1.5"
          style={{
            background: "linear-gradient(180deg, #f0d27a 0%, #c89e44 40%, #8a6824 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,235,180,0.5)",
          }}
        />
      </div>

      {/* Right velvet panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[100] w-[52%] pointer-events-none"
        style={{
          background: VELVET,
          animation: isCovering
            ? `tcRightIn ${coverSec}s ${coverEase} both`
            : `tcRightOut ${uncoverSec}s ${uncoverEase} both`,
        }}
      >
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/85 to-transparent" />
        <div
          className="absolute inset-x-0 bottom-3 h-1.5"
          style={{
            background: "linear-gradient(180deg, #f0d27a 0%, #c89e44 40%, #8a6824 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,235,180,0.5)",
          }}
        />
      </div>

      {/* Proscenium valance — drops from the top */}
      <div
        className="fixed inset-x-0 top-0 z-[101] h-24 pointer-events-none md:h-32"
        style={{
          background: VALANCE,
          animation: isCovering
            ? `tcValIn ${(coverSec * 0.7).toFixed(2)}s ease-out both`
            : `tcValOut ${(uncoverSec * 0.7).toFixed(2)}s ease-in both`,
        }}
      >
        {/* Gold top molding */}
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{
            background: "linear-gradient(180deg, #f0d480 0%, #b8902f 60%, #6e5618 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,240,200,0.6), 0 2px 4px rgba(0,0,0,0.7)",
          }}
        />
        {/* Scalloped bottom edge */}
        <div
          className="absolute inset-x-0 -bottom-3 h-6"
          style={{
            background: VALANCE,
            WebkitMaskImage: "radial-gradient(circle 18px at 36px 0, transparent 16px, black 17px)",
            WebkitMaskRepeat: "repeat-x",
            WebkitMaskSize: "72px 24px",
            maskImage: "radial-gradient(circle 18px at 36px 0, transparent 16px, black 17px)",
            maskRepeat: "repeat-x",
            maskSize: "72px 24px",
          }}
        />
        {/* Gold fringe */}
        <div
          className="absolute inset-x-0 bottom-0 h-1"
          style={{
            background: "linear-gradient(180deg, #e3c272 0%, #8a6f30 100%)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        />
      </div>

      {/* Section thesis — resolves once the drapes meet */}
      <div
        className="fixed inset-0 z-[102] flex items-center justify-center text-center pointer-events-none"
        style={
          isCovering
            ? { animation: `tcRise 0.6s cubic-bezier(0.16,1,0.3,1) ${(coverSec * 0.62).toFixed(2)}s both` }
            : { opacity: 0, transition: `opacity ${uncoverSec.toFixed(2)}s ease` }
        }
      >
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-200/65">
            Vol. V · Media &amp; Consumer
          </div>
          <div
            className="mt-4 font-display text-[clamp(38px,5.5vw,80px)] font-medium italic leading-[1.02] text-paper"
            style={{ textShadow: "0 0 40px rgba(232,208,154,0.35), 0 2px 12px rgba(0,0,0,0.65)" }}
          >
            The infrastructure of influence.
          </div>
        </div>
      </div>
    </>
  );
}
