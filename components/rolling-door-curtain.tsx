"use client";

type Props = {
  phase: "covering" | "uncovering";
  coverMs: number;
  uncoverMs: number;
};

/**
 * Storage unit roll-up door — pale corrugated rollup with stenciled
 * unit number, hasp + padlock, dark steel jambs with bolt heads,
 * aluminum sill with grab pocket, concrete floor with cracks and
 * speckle. Slams down on cover, lifts off on uncover.
 */
export function RollingDoorCurtain({ phase, coverMs, uncoverMs }: Props) {
  const isCovering = phase === "covering";
  const coverSec = coverMs / 1000;
  const uncoverSec = uncoverMs / 1000;
  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        animation: isCovering
          ? `rdSlam ${coverSec}s cubic-bezier(0.7,0,0.84,0) both`
          : `rdLift ${uncoverSec}s cubic-bezier(0.16,1,0.3,1) both`,
      }}
    >
      {/* SVG defs for the stenciled paint filter */}
      <svg aria-hidden="true" className="absolute -top-px -left-px h-px w-px">
        <defs>
          <filter id="paint-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
          <filter id="paint-speckle" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" />
            <feColorMatrix values="0 0 0 0 0.85   0 0 0 0 0.82   0 0 0 0 0.74   0 0 0 1 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Steel jambs with mounting bolts — the door slides between these */}
      <SteelJamb side="left" />
      <SteelJamb side="right" />

      {/* Top header / track box */}
      <div className="absolute inset-x-4 top-0 z-[2] h-6 bg-gradient-to-b from-[#1a1a1c] via-[#222426] to-[#0e0e10] shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(0,0,0,0.6)] md:inset-x-5">
        {/* Subtle track curve hint */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      </div>

      {/* Door panel — fills between the jambs */}
      <div className="absolute inset-y-0 inset-x-4 md:inset-x-5">
        {/* Base door color — slight gradient for top-lit ambient feel */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #e8e1d0 0%, #ddd6c3 30%, #d2cab7 60%, #c2bba8 100%)",
          }}
        />

        {/* Corrugation ridges — repeating with proper highlight/shadow per rib */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom,
              rgba(255,255,255,0.55) 0px,
              rgba(255,255,255,0.30) 1px,
              rgba(255,255,255,0.10) 3px,
              transparent 6px,
              rgba(0,0,0,0.06) 9px,
              rgba(0,0,0,0.20) 12px,
              rgba(0,0,0,0.34) 13px,
              rgba(0,0,0,0.18) 14px,
              rgba(0,0,0,0.04) 16px,
              rgba(255,255,255,0.18) 18px,
              rgba(255,255,255,0.40) 20px)`,
          }}
        />

        {/* Slat seams every 80px — heavier shadow + thin highlight below the seam */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom,
              transparent 0px,
              transparent 76px,
              rgba(0,0,0,0.10) 77px,
              rgba(0,0,0,0.55) 79px,
              rgba(0,0,0,0.65) 80px,
              rgba(255,255,255,0.40) 81px,
              rgba(255,255,255,0.10) 83px,
              transparent 84px)`,
          }}
        />

        {/* Surface noise — fine matte metal grain */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1.4px), radial-gradient(rgba(255,255,255,0.4) 0.6px, transparent 0.8px)",
            backgroundSize: "5px 5px, 7px 7px",
          }}
        />

        {/* Vertical edge shadowing near the jambs (ambient occlusion) */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/45 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/45 to-transparent" />

        {/* Top ambient highlight (overhead light fixture above the unit) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

        {/* Weathering — irregular dirt streaks dripping down */}
        <div
          className="absolute inset-x-0 bottom-32 h-72 opacity-25 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 60px 120px at 12% 60%, rgba(70,55,35,0.55), transparent),
              radial-gradient(ellipse 40px 180px at 22% 80%, rgba(60,45,28,0.45), transparent),
              radial-gradient(ellipse 80px 60px at 45% 50%, rgba(70,55,35,0.35), transparent),
              radial-gradient(ellipse 50px 140px at 76% 70%, rgba(60,45,28,0.50), transparent),
              radial-gradient(ellipse 30px 80px at 90% 85%, rgba(70,55,35,0.55), transparent)
            `,
          }}
        />

        {/* Stenciled "042" — SVG with paint-rough filter for chipped edges */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            viewBox="0 0 600 280"
            className="h-[clamp(220px,32vw,420px)] w-auto"
            style={{ filter: "drop-shadow(0 2px 0 rgba(255,255,255,0.18))" }}
          >
            {/* Backdrop layer — slightly bigger, lighter "ghost" of the paint */}
            <text
              x="300"
              y="220"
              textAnchor="middle"
              fontFamily='"Arial Black", Impact, sans-serif'
              fontSize="280"
              fontWeight="900"
              fill="rgba(20,18,15,0.18)"
              filter="url(#paint-rough)"
            >
              042
            </text>
            {/* Main paint layer */}
            <text
              x="300"
              y="220"
              textAnchor="middle"
              fontFamily='"Arial Black", Impact, sans-serif'
              fontSize="280"
              fontWeight="900"
              fill="rgba(18,16,14,0.92)"
              filter="url(#paint-rough)"
              style={{ letterSpacing: "0.04em" }}
            >
              042
            </text>
            {/* Worn paint speckle — tiny dots showing where paint has chipped off */}
            <text
              x="300"
              y="220"
              textAnchor="middle"
              fontFamily='"Arial Black", Impact, sans-serif'
              fontSize="280"
              fontWeight="900"
              fill="rgba(216,207,189,0.55)"
              filter="url(#paint-speckle)"
              style={{ letterSpacing: "0.04em" }}
            >
              042
            </text>
          </svg>
        </div>

        {/* Property management plate — top center */}
        <div className="absolute left-1/2 top-12 -translate-x-1/2 z-[2]">
          <div
            className="rounded-[1px] border border-black/40 px-4 py-2 shadow-[0_3px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{
              background:
                "linear-gradient(180deg, #1f1f21 0%, #16161a 100%)",
            }}
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.5em] text-[#d6cfbd]">
              Lopes Self Storage
            </div>
            <div className="mt-0.5 text-center font-mono text-[7px] uppercase tracking-[0.45em] text-[#d6cfbd]/55">
              Scottsdale · AZ
            </div>
          </div>
          {/* Mounting screws */}
          <div className="absolute -top-1 left-2 h-1.5 w-1.5 rounded-full bg-[#0a0a0c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
          <div className="absolute -top-1 right-2 h-1.5 w-1.5 rounded-full bg-[#0a0a0c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Hasp + brass padlock at center bottom */}
        <HaspPadlock />

        {/* Bottom rail — heavy aluminum sill */}
        <div className="absolute inset-x-0 bottom-12 h-24 bg-gradient-to-b from-[#a09a92] via-[#7a7570] to-[#3e3a35] shadow-[0_-14px_28px_rgba(0,0,0,0.55),inset_0_2px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.5)]">
          {/* Brushed grain */}
          <div
            className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)",
            }}
          />
          {/* Recessed pull pocket */}
          <div className="absolute left-1/2 top-1/2 h-8 w-48 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-gradient-to-b from-[#08080a] via-[#16171a] to-[#1f2024] shadow-[inset_0_4px_8px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.06)]">
            {/* Inner shadow lip */}
            <div className="absolute inset-x-2 top-1 h-1 rounded-full bg-black/60 blur-[1px]" />
          </div>
          {/* Stamped unit code on the right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/65">
            UNIT 042
          </div>
          {/* Small dent / scratch marks */}
          <div className="absolute left-12 top-3 h-px w-8 bg-black/40" />
          <div className="absolute right-32 bottom-4 h-1 w-2 rounded-full bg-black/30" />
          {/* Hairline at the very bottom */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-black/80" />
        </div>

        {/* Concrete floor */}
        <ConcreteFloor />

        {/* Resolve scrim — darkens the busy door so the thesis reads */}
        <div
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 46%, rgba(8,7,6,0.74) 0%, rgba(8,7,6,0.55) 42%, rgba(8,7,6,0.80) 100%)",
            animation: `rdScrim 0.7s ease-out ${((coverMs / 1000) * 0.5).toFixed(2)}s both`,
          }}
        />
        {/* Section thesis — resolves after the door lands (CSS-driven) */}
        <div className="absolute inset-0 z-[5] flex items-center justify-center px-8 pointer-events-none">
          <div
            className="text-center"
            style={{ animation: `rdRise 0.6s cubic-bezier(0.16,1,0.3,1) ${((coverMs / 1000) * 0.6).toFixed(2)}s both` }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-paper/60">
              Vol. II · Real Estate
            </div>
            <div
              className="mt-4 font-display text-[clamp(38px,5.5vw,80px)] font-medium italic leading-[1.02] text-paper"
              style={{ textShadow: "0 0 38px rgba(229,165,43,0.30), 0 2px 12px rgba(0,0,0,0.7)" }}
            >
              Infrastructure for the overflow.
            </div>
          </div>
        </div>
        <style>{`@keyframes rdSlam{from{transform:translateY(-100%)}to{transform:translateY(0)}}@keyframes rdLift{from{transform:translateY(0)}to{transform:translateY(-100%)}}@keyframes rdScrim{from{opacity:0}to{opacity:1}}@keyframes rdRise{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:none}}`}</style>
      </div>
    </div>
  );
}

function SteelJamb({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute inset-y-0 ${
        isLeft ? "left-0" : "right-0"
      } z-[3] w-4 md:w-5`}
      style={{
        background: isLeft
          ? "linear-gradient(90deg, #0e0e10 0%, #2a2c2f 35%, #18181a 70%, #0a0a0c 100%)"
          : "linear-gradient(270deg, #0e0e10 0%, #2a2c2f 35%, #18181a 70%, #0a0a0c 100%)",
        boxShadow: isLeft
          ? "inset -2px 0 6px rgba(0,0,0,0.8), 2px 0 4px rgba(0,0,0,0.5)"
          : "inset 2px 0 6px rgba(0,0,0,0.8), -2px 0 4px rgba(0,0,0,0.5)",
      }}
    >
      {/* Mounting bolts down the jamb */}
      <div className="absolute inset-y-12 left-1/2 flex -translate-x-1/2 flex-col justify-around">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-gradient-to-br from-[#3a3a3c] to-[#0e0e10] shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.3),0_0.5px_1px_rgba(0,0,0,0.6)]"
          />
        ))}
      </div>
    </div>
  );
}

function HaspPadlock() {
  return (
    <div className="absolute left-1/2 bottom-[148px] z-[3] -translate-x-1/2">
      <div className="relative h-28 w-20">
        {/* Hasp mounting plate */}
        <div
          className="absolute inset-x-0 top-3 h-20 rounded-[2px]"
          style={{
            background:
              "linear-gradient(180deg, #7a7a7c 0%, #5a5a5c 30%, #2a2a2c 70%, #16161a 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.7), 0 6px 14px rgba(0,0,0,0.6)",
          }}
        />
        {/* Mounting bolts on the hasp */}
        <div className="absolute left-1.5 top-5 h-1.5 w-1.5 rounded-full bg-[#0a0a0c] shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.4)]" />
        <div className="absolute right-1.5 top-5 h-1.5 w-1.5 rounded-full bg-[#0a0a0c] shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.4)]" />
        <div className="absolute left-1.5 bottom-9 h-1.5 w-1.5 rounded-full bg-[#0a0a0c] shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.4)]" />
        <div className="absolute right-1.5 bottom-9 h-1.5 w-1.5 rounded-full bg-[#0a0a0c] shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.4)]" />

        {/* Hasp loop (the metal ring the lock goes through) */}
        <div
          className="absolute left-1/2 top-6 h-7 w-7 -translate-x-1/2 rounded-full border-[3.5px]"
          style={{
            borderColor: "#0e0e10",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.7)",
          }}
        />

        {/* Padlock body */}
        <div
          className="absolute left-1/2 top-9 h-14 w-12 -translate-x-1/2 rounded-[4px]"
          style={{
            background:
              "linear-gradient(135deg, #d8c479 0%, #b09850 35%, #7a6630 70%, #4a3e1e 100%)",
            boxShadow:
              "0 6px 12px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -1px 1px rgba(0,0,0,0.55), inset 1px 0 1px rgba(255,255,255,0.2)",
          }}
        >
          {/* Brand stamp — small embossed text */}
          <div
            className="absolute inset-x-1 top-2 text-center font-mono text-[6px] font-bold uppercase tracking-[0.15em]"
            style={{
              color: "rgba(58, 46, 16, 0.7)",
              textShadow: "0 0.5px 0 rgba(255,225,160,0.3)",
            }}
          >
            LOPES
          </div>
          {/* Key cylinder */}
          <div
            className="absolute left-1/2 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #2a2010 0%, #1a1408 50%, #08050a 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(0,0,0,0.8), 0 0.5px 0 rgba(255,225,160,0.3)",
            }}
          >
            {/* Key slot */}
            <div className="absolute left-1/2 top-1/2 h-1.5 w-px -translate-x-1/2 -translate-y-1/2 bg-[#08050a]" />
          </div>
          {/* Bottom serial groove */}
          <div className="absolute inset-x-1.5 bottom-1.5 h-px bg-[#3a2e10]/65" />
        </div>

        {/* Shackle — top arc going through the hasp ring */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2">
          <div
            className="h-7 w-9 rounded-t-full border-[3.5px] border-b-0"
            style={{
              borderColor: "#9c9c9e",
              borderImageSlice: "1",
              background:
                "linear-gradient(180deg, transparent 0%, transparent 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.7)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ConcreteFloor() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-12 overflow-hidden">
      {/* Base concrete */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #6a6660 0%, #565350 40%, #423f3c 100%)",
        }}
      />
      {/* Speckle — multiple sizes for depth */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1.5px), radial-gradient(rgba(0,0,0,0.25) 1px, transparent 1.5px), radial-gradient(rgba(0,0,0,0.15) 0.5px, transparent 0.7px)",
          backgroundSize: "7px 7px, 11px 11px, 4px 4px",
        }}
      />
      {/* Hairline cracks */}
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        <path d="M 12% 4 L 18% 12 L 14% 24 L 22% 36" stroke="rgba(0,0,0,0.55)" strokeWidth="0.5" fill="none" />
        <path d="M 60% 8 L 62% 18 L 58% 28" stroke="rgba(0,0,0,0.45)" strokeWidth="0.4" fill="none" />
        <path d="M 84% 16 L 88% 26 L 82% 40" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" fill="none" />
      </svg>
      {/* Expansion seam */}
      <div className="absolute inset-x-0 top-3 h-px bg-black/55" />
      {/* Cast shadow from the door */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
    </div>
  );
}
