"use client";

import Link from "next/link";
import {
  LineChart,
  Building2,
  GraduationCap,
  Activity,
  Megaphone,
  ScrollText,
  Compass,
  Hammer,
  CheckCircle2,
  Calendar,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { MistBackground, type FogPalette } from "@/components/mist-background";
import { CurtainLink } from "@/components/curtain-link";

// Obsidian fog — near-black base, electric violet accent.
const OBSIDIAN_FOG: FogPalette = {
  base: [0.022, 0.025, 0.035],
  mist: [0.1, 0.06, 0.18],
  accent: [0.48, 0.31, 0.85],
  glow: [0.78, 0.55, 1.0],
  speed: 1.15,
  turbulence: 1.4,
  brightness: 1.45,
};

// ---------------------------------------------------------------
// TILES — the 10 doors. Each carries its accent so the curtain
// can match the destination's color during the transition.
// ---------------------------------------------------------------

type Tile = {
  vol: string;
  title: string;
  subtitle: string;
  href: string;
  /** color the PageCurtain paints during the slide */
  accent: string;
  Icon: LucideIcon;
};

const TILES: Tile[] = [
  { vol: "VOL.01", title: "Capital Markets",   subtitle: "pricing the distortion",          href: "/capital-markets", accent: "#7A4FD9", Icon: LineChart },
  { vol: "VOL.02", title: "Real Estate",       subtitle: "infrastructure for the overflow", href: "/real-estate",     accent: "#8C6A2A", Icon: Building2 },
  { vol: "VOL.03", title: "Education",         subtitle: "the new architecture of learning",href: "/education",       accent: "#4A1A24", Icon: GraduationCap },
  { vol: "VOL.04", title: "Healthcare",        subtitle: "the parallel health economy",     href: "/healthcare",      accent: "#244B4F", Icon: Activity },
  { vol: "VOL.05", title: "Media & Consumer",  subtitle: "the infrastructure of influence", href: "/media-consumer",  accent: "#3B4230", Icon: Megaphone },
  { vol: "VOL.06", title: "Letters",           subtitle: "annual notes, on the record",     href: "/#letters",         accent: "#EDE5D2", Icon: ScrollText },
  { vol: "PR.I",   title: "Discover",          subtitle: "where signal becomes thesis",     href: "/discover",        accent: "#5028A0", Icon: Compass },
  { vol: "PR.II",  title: "Develop",           subtitle: "where capital becomes operation", href: "/develop",         accent: "#6E2E18", Icon: Hammer },
  { vol: "PR.III", title: "Deliver",           subtitle: "where work becomes outcome",      href: "/deliver",         accent: "#8C6A2A", Icon: CheckCircle2 },
  { vol: "MMXXVI", title: "Vol. IX",           subtitle: "five volumes · four principles",  href: "/discover",        accent: "#7A4FD9", Icon: Calendar },
];

const PILLAR_NAV = [
  { label: "Discover", href: "/discover", accent: "#5028A0" },
  { label: "Develop",  href: "/develop",  accent: "#6E2E18" },
  { label: "Deliver",  href: "/deliver",  accent: "#8C6A2A" },
  { label: "Disrupt",  href: "/discover", accent: "#5028A0" }, // folded into Discover for now
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink py-12 px-8 md:px-12 lg:px-16">
      {/* SVG filters: refraction at perimeter */}
      <svg aria-hidden="true" className="pointer-events-none absolute -top-px -left-px h-px w-px">
        <defs>
          <filter id="lq-refract" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <MistBackground palette={OBSIDIAN_FOG} />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#1A1B22] blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[#3a2d55] blur-[140px]" />
        <div className="absolute left-[30%] top-[40%] h-[40%] w-[40%] rounded-full bg-[#14151f] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* TOP NAV */}
        <nav className="flex items-center justify-between pt-2 pb-12 md:pb-16">
          <Link
            href="/"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.4em] text-paper md:text-xs"
          >
            Lopes / Capital
          </Link>
          <div className="hidden gap-10 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60 md:flex">
            {PILLAR_NAV.map((n) => (
              <CurtainLink
                key={n.label}
                href={n.href}
                accent={n.accent}
                label={`Opening ${n.label.toLowerCase()}`}
                className="transition-opacity hover:opacity-100 hover:text-paper"
              >
                {n.label}
              </CurtainLink>
            ))}
          </div>
        </nav>

        {/* HEADER */}
        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-2">
            Volume IX · MMXXVI
          </div>
          <h1 className="mt-4 font-display text-[clamp(36px,5vw,56px)] font-normal leading-[1.02] tracking-[-0.02em] text-paper">
            Funding the{" "}
            <em className="italic font-medium text-purple-2">intelligent transition</em>.
          </h1>
        </div>

        {/* TILE GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {TILES.map((t) => (
            <LiquidCard key={t.title} tile={t} />
          ))}
        </div>

        {/* FOOTER STRIP */}
        <footer className="mt-20 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 md:flex-row md:items-center">
          <span>Lopes Capital · Operators since 2017</span>
          <span>Scottsdale · Arizona</span>
          <span>Obsidian · Vol. IX</span>
        </footer>
      </div>

      <style>{LIQUID_CSS}</style>
    </div>
  );
}

function LiquidCard({ tile }: { tile: Tile }) {
  const Icon = tile.Icon;
  return (
    <CurtainLink
      href={tile.href}
      accent={tile.accent}
      label={`Opening ${tile.title}`}
      className="lq-parent"
      ariaLabel={`${tile.title} — ${tile.subtitle}`}
    >
      <span className="lq-refract" aria-hidden="true" />
      <span className="lq-glass" aria-hidden="true" />
      <span className="lq-rim" aria-hidden="true" />

      <div className="lq-content">
        <div className="lq-top">
          <div className="lq-icon">
            <Icon size={16} strokeWidth={1.5} />
          </div>
          <span className="lq-vol">{tile.vol}</span>
        </div>

        <div className="lq-meta">
          <h3 className="lq-title">{tile.title}</h3>
          <p className="lq-sub">— {tile.subtitle}</p>
          <div className="lq-cta">
            <span>Open</span>
            <ArrowRight size={12} className="lq-arrow" />
          </div>
        </div>
      </div>
    </CurtainLink>
  );
}

const LIQUID_CSS = `
  .lq-parent {
    position: relative;
    display: block;
    aspect-ratio: 4 / 5;
    border-radius: 26px;
    overflow: hidden;
    isolation: isolate;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow:
      0 24px 48px -20px rgba(58, 45, 85, 0.5),
      0 4px 16px -8px rgba(0, 0, 0, 0.4);
  }
  .lq-parent:hover { transform: translateY(-3px); }

  .lq-refract {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    backdrop-filter: blur(0.5px);
    -webkit-backdrop-filter: blur(0.5px);
    filter: url(#lq-refract);
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
            mask-composite: exclude;
    padding: 14px;
    z-index: 1;
    pointer-events: none;
  }

  .lq-glass {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    backdrop-filter: blur(22px) saturate(180%);
    -webkit-backdrop-filter: blur(22px) saturate(180%);
    background:
      linear-gradient(180deg,
        rgba(255, 255, 255, 0.10) 0%,
        rgba(255, 255, 255, 0.04) 60%,
        rgba(255, 255, 255, 0.02) 100%);
    z-index: 2;
    pointer-events: none;
  }

  .lq-rim {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    z-index: 3;
    pointer-events: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.32),
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 -1px 0 rgba(0, 0, 0, 0.18);
  }

  .lq-content {
    position: relative;
    z-index: 4;
    height: 100%;
    padding: 22px;
    display: flex;
    flex-direction: column;
    color: #F4EFE3;
  }
  .lq-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: auto;
  }
  .lq-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: grid;
    place-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.10);
    color: rgba(244, 239, 227, 0.95);
  }
  .lq-vol {
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(244, 239, 227, 0.65);
    margin-top: 6px;
  }
  .lq-meta { margin-top: 16px; }
  .lq-title {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 22px;
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: #F4EFE3;
    margin: 0;
  }
  .lq-sub {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 13.5px;
    line-height: 1.35;
    color: rgba(244, 239, 227, 0.78);
    margin: 4px 0 18px;
  }
  .lq-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(244, 239, 227, 0.78);
    transition: color 0.25s ease;
  }
  .lq-parent:hover .lq-cta { color: #F4EFE3; }
  .lq-arrow { transition: transform 0.25s ease; }
  .lq-parent:hover .lq-arrow { transform: translateX(2px); }

  @media (prefers-reduced-motion: reduce) {
    .lq-parent { transition: none; }
    .lq-parent:hover { transform: none; }
    .lq-arrow, .lq-cta { transition: none; }
    .lq-parent:hover .lq-arrow { transform: none; }
  }
`;
