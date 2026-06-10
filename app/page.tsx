"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  LineChart,
  Building2,
  GraduationCap,
  Activity,
  Megaphone,
  UserPlus,
  Send,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { MistBackground, type FogPalette } from "@/components/mist-background";
import { CurtainLink, type CurtainVariant } from "@/components/curtain-link";
import { BootOverlay } from "@/components/boot-overlay";

// ---------------------------------------------------------------
// Date eyebrow (Roman numerals) — rendered client-side after mount.
// ---------------------------------------------------------------
function toRoman(n: number): string {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let r = n;
  for (const [v, s] of map) {
    while (r >= v) { out += s; r -= v; }
  }
  return out;
}
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

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

// Entrance reveal — pure CSS transition driven by a className swap (mirrors the
// canonical preview.html `.show`/`.rise` approach). Motion's per-element
// orchestration proved non-deterministic here: parent->child variant
// propagation, and even self-driven targets, intermittently stranded part of
// the tree at opacity:0 on a booted reload. A CSS class swap has no orchestration
// to drop, so every element reliably transitions to its shown state. The
// per-element stagger is applied via an inline `transitionDelay`.
const REVEAL_BASE =
  "transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:duration-200";

// ---------------------------------------------------------------
// SECTORS — the five capital volumes (the substance of the ledger).
// curtainAccent keeps the existing PageCurtain colors intact;
// displayAccent is the brighter on-page tint for dots/glows.
// variant fires the correct cinematic curtain on navigation.
// ---------------------------------------------------------------
type Sector = {
  vol: string;
  title: string;
  emphasis: string;
  meta: string;
  href: string;
  curtainAccent: string;
  displayAccent: string;
  variant: CurtainVariant;
  Icon: LucideIcon;
};

const SECTORS: Sector[] = [
  { vol: "VOL.01", title: "Capital Markets",  emphasis: "pricing the distortion",          meta: "QUANT · FUNDAMENTAL · ALT-DATA", href: "/capital-markets", curtainAccent: "#7A4FD9", displayAccent: "#A988F5", variant: "candlestick",      Icon: LineChart },
  { vol: "VOL.02", title: "Real Estate",      emphasis: "infrastructure for the overflow", meta: "ADAPTIVE-REUSE · STORAGE",        href: "/real-estate",     curtainAccent: "#8C6A2A", displayAccent: "#E5A52B", variant: "rolling-door",     Icon: Building2 },
  { vol: "VOL.03", title: "Education",        emphasis: "the new architecture of learning", meta: "K-20 · DECENTRALIZED",           href: "/education",       curtainAccent: "#4A1A24", displayAccent: "#E64A58", variant: "chalkboard",       Icon: GraduationCap },
  { vol: "VOL.04", title: "Healthcare",       emphasis: "the parallel health economy",     meta: "NEURO · FUNCTIONAL · DTC",       href: "/healthcare",      curtainAccent: "#244B4F", displayAccent: "#5BB8C0", variant: "ekg-monitor",      Icon: Activity },
  { vol: "VOL.05", title: "Media & Consumer", emphasis: "the infrastructure of influence", meta: "CREATOR · COMMERCE · OWNED",      href: "/media-consumer",  curtainAccent: "#3B4230", displayAccent: "#B7C474", variant: "theater-curtains", Icon: Megaphone },
];

const PRINCIPLES = [
  { code: "PR.I",   label: "Discover", blurb: "signal becomes thesis",   href: "/discover", accent: "#5028A0" },
  { code: "PR.II",  label: "Develop",  blurb: "capital becomes operation", href: "/develop",  accent: "#6E2E18" },
  { code: "PR.III", label: "Deliver",  blurb: "work becomes outcome",     href: "/deliver",  accent: "#8C6A2A" },
  { code: "PR.IV",  label: "Disrupt",  blurb: "comfortable becomes contested", href: "/discover", accent: "#5028A0" },
];

const PILLAR_NAV = [
  { label: "Discover", href: "/discover", accent: "#5028A0" },
  { label: "Develop",  href: "/develop",  accent: "#6E2E18" },
  { label: "Deliver",  href: "/deliver",  accent: "#8C6A2A" },
  { label: "Disrupt",  href: "/discover", accent: "#5028A0" },
];

// Entry portals — talent (internship + job applications) and inbound deal flow.
const PORTALS = [
  { eyebrow: "TALENT",    label: "Applications",    blurb: "internships & roles",     href: "/apply",  accent: "#5028A0", Icon: UserPlus },
  { eyebrow: "DEAL FLOW", label: "Deal submission", blurb: "bring us an opportunity", href: "/submit", accent: "#8C6A2A", Icon: Send },
] satisfies {
  eyebrow: string;
  label: string;
  blurb: string;
  href: string;
  accent: string;
  Icon: LucideIcon;
}[];

export default function HomePage() {
  const [dateline, setDateline] = useState("");
  const [reduced, setReduced] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [firstBoot, setFirstBoot] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect --
     Intentional: these are browser-only reads (Date, matchMedia, sessionStorage)
     that must run post-mount to stay hydration-safe on this SSR-prerendered route.
     The single mount-time state sync is deliberate, not a cascading-render bug. */
  useEffect(() => {
    const now = new Date();
    setDateline(`${toRoman(now.getDate())} · ${MONTHS[now.getMonth()]} · ${toRoman(now.getFullYear())}`);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    // Fog only rises on the first load of the session (boot moment).
    let booted = false;
    try { booted = sessionStorage.getItem("lopes:booted") === "1"; } catch { booted = false; }
    setFirstBoot(!booted);

    // If reduced motion or already-booted, reveal immediately so content
    // never stays stuck in its hidden state.
    if (prefersReduced || booted) setRevealed(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Entrance choreography. `revealed` toggles the shown/hidden utility classes;
  // CSS transitions the swap. Each element gets a staggered transitionDelay.
  const revealState = revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";
  const revealDelay = (i: number) =>
    revealed && !reduced ? { transitionDelay: `${80 + i * 70}ms` } : undefined;

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink px-6 py-10 md:px-12 lg:px-16">
      {/* LOAD TRANSITION */}
      <BootOverlay onComplete={() => setRevealed(true)} />

      {/* Fog — rises from the bottom on first boot, ambient thereafter */}
      <MistBackground
        palette={OBSIDIAN_FOG}
        entry={firstBoot && !reduced ? { dir: "bottom", duration: 1.6 } : undefined}
      />

      {/* Atmospheric blur spots */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#1A1B22] blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[#3a2d55] blur-[140px]" />
        <div className="absolute left-[30%] top-[40%] h-[40%] w-[40%] rounded-full bg-[#14151f] blur-[100px]" />
      </div>

      <motion.div className="relative z-10 mx-auto max-w-[1180px]">
        {/* TOP NAV */}
        <motion.nav style={revealDelay(0)} className={`${REVEAL_BASE} ${revealState} flex items-center justify-between pb-14 md:pb-20`}>
          <Link
            href="/"
            className="rounded-sm font-mono text-[10px] font-semibold uppercase tracking-[0.4em] text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-2 focus-visible:ring-offset-4 focus-visible:ring-offset-ink md:text-xs"
          >
            Lopes / Capital
          </Link>
          <div className="hidden gap-9 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55 md:flex">
            {PILLAR_NAV.map((n) => (
              <CurtainLink
                key={n.label}
                href={n.href}
                accent={n.accent}
                label={`Opening ${n.label.toLowerCase()}`}
                className="rounded-sm transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-2 focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                {n.label}
              </CurtainLink>
            ))}
          </div>
        </motion.nav>

        {/* HERO — the thesis is the hero */}
        <header className="mb-16 md:mb-24">
          <motion.div
            suppressHydrationWarning
            style={revealDelay(1)}
            className={`${REVEAL_BASE} ${revealState} flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-purple-2`}
          >
            <span>{dateline || " "}</span>
            <span className="h-px flex-1 bg-paper/10" />
            <span className="text-paper/45">Operators since 2017</span>
          </motion.div>

          <motion.h1
            style={revealDelay(2)}
            className={`${REVEAL_BASE} ${revealState} mt-8 font-display text-[clamp(48px,9vw,116px)] font-normal leading-[0.92] tracking-[-0.03em] text-paper`}
          >
            The architecture
            <br />
            of <em className="italic font-medium text-purple-2">capital</em>.
          </motion.h1>

          <motion.p
            style={revealDelay(3)}
            className={`${REVEAL_BASE} ${revealState} mt-9 max-w-[56ch] font-sans text-[16px] leading-[1.65] text-paper-dim md:text-[18px]`}
          >
            A Scottsdale multi-family office. Operator-built, capital-deployed —
            direct positions and operational weight across five domains, written
            down one volume at a time.
          </motion.p>
        </header>

        {/* THE LEDGER — five sectors as the primary index */}
        <motion.div style={revealDelay(4)} className={`${REVEAL_BASE} ${revealState} mb-5 flex items-baseline justify-between`}>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.35em] text-paper/55">
            The ledger
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/35">
            Five volumes · four principles
          </span>
        </motion.div>

        <div className="overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.02] backdrop-blur-md">
          {SECTORS.map((s, i) => (
            <motion.div key={s.href} style={revealDelay(5 + i)} className={`${REVEAL_BASE} ${revealState}`}>
              <CurtainLink
                href={s.href}
                accent={s.curtainAccent}
                label={`Opening ${s.title.toLowerCase()}`}
                variant={s.variant}
                ariaLabel={`${s.title} — ${s.emphasis}`}
                className={`group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-6 transition-colors hover:bg-paper/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-2 md:gap-8 md:px-8 md:py-7 ${
                  i < SECTORS.length - 1 ? "border-b border-paper/8" : ""
                }`}
              >
                {/* accent glow on hover */}
                <div
                  className="pointer-events-none absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{ background: s.displayAccent }}
                />

                {/* left: vol + icon */}
                <div className="flex items-center gap-4">
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.25em]"
                    style={{ color: s.displayAccent }}
                  >
                    {s.vol}
                  </span>
                  <span
                    className="hidden h-9 w-9 place-content-center rounded-lg border border-paper/10 bg-paper/[0.04] text-paper/80 sm:grid"
                  >
                    <s.Icon size={15} strokeWidth={1.5} />
                  </span>
                </div>

                {/* middle: title + emphasis + meta */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-[clamp(22px,3vw,30px)] font-medium leading-tight tracking-tight text-paper">
                      {s.title}
                    </span>
                    <span className="font-display text-[14px] italic text-paper/55 md:text-[15px]">
                      — {s.emphasis}
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-paper/40">
                    {s.meta}
                  </div>
                </div>

                {/* right: open affordance */}
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/55 transition-colors group-hover:text-paper">
                  <span className="hidden sm:inline">Open</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </CurtainLink>
            </motion.div>
          ))}
        </div>

        {/* SECONDARY — principles + letters */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
          {/* principles */}
          <motion.div style={revealDelay(10)} className={`${REVEAL_BASE} ${revealState}`}>
            <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-paper/55">
              Operating principles
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PRINCIPLES.map((p) => (
                <CurtainLink
                  key={p.code}
                  href={p.href}
                  accent={p.accent}
                  label={`Opening ${p.label.toLowerCase()}`}
                  className="group rounded-xl border border-paper/10 bg-paper/[0.02] px-5 py-4 backdrop-blur-md transition-colors hover:border-paper/25 hover:bg-paper/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper/40">
                    {p.code}
                  </div>
                  <div className="mt-2 font-display text-[19px] font-medium tracking-tight text-paper">
                    {p.label}
                  </div>
                  <div className="mt-1 font-display text-[13px] italic text-paper/55">
                    {p.blurb}
                  </div>
                </CurtainLink>
              ))}
            </div>
          </motion.div>

          {/* portals — talent + deal flow */}
          <motion.div style={revealDelay(11)} className={`${REVEAL_BASE} ${revealState} flex h-full flex-col`}>
            <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-paper/55">
              Get in
            </h2>
            <div className="flex flex-1 flex-col gap-3">
              {PORTALS.map((p) => (
                <CurtainLink
                  key={p.href}
                  href={p.href}
                  accent={p.accent}
                  label={`Opening ${p.label.toLowerCase()}`}
                  className="group flex flex-1 flex-col justify-between rounded-xl border border-paper/10 bg-paper/[0.02] px-5 py-4 backdrop-blur-md transition-colors hover:border-paper/25 hover:bg-paper/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper/40">
                      {p.eyebrow}
                    </span>
                    <p.Icon size={16} strokeWidth={1.5} className="text-paper/55 transition-colors group-hover:text-paper" />
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-3">
                    <div>
                      <div className="font-display text-[20px] font-medium tracking-tight text-paper">
                        {p.label}
                      </div>
                      <div className="mt-1 font-display text-[13px] italic text-paper/55">
                        {p.blurb}
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="mb-1 shrink-0 text-paper/45 transition-all duration-300 group-hover:translate-x-1 group-hover:text-paper"
                    />
                  </div>
                </CurtainLink>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FOOTER */}
        <motion.footer
          style={revealDelay(12)}
          className={`${REVEAL_BASE} ${revealState} mt-20 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 md:flex-row md:items-center`}
        >
          <span>Lopes Capital · Operators since 2017</span>
          <span>Scottsdale · Arizona</span>
          <span>Obsidian · Vol. IX</span>
        </motion.footer>
      </motion.div>
    </div>
  );
}
