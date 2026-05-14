"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ledgers, type LedgerColor } from "@/lib/content";

const SECTORS = ledgers.filter((l) => l.slug !== "letters");

const SWATCH: Record<LedgerColor, string> = {
  purple: "bg-purple",
  gold: "bg-gold",
  burgundy: "bg-burgundy",
  teal: "bg-teal",
  olive: "bg-olive",
  paper: "bg-paper-warm",
};

const COLLAPSED_TOP = [
  "top-6",
  "top-[calc(1.5rem+0.5rem)]",
  "top-[calc(1.5rem+1rem)]",
  "top-[calc(1.5rem+1.5rem)]",
  "top-[calc(1.5rem+2rem)]",
];

const EXPANDED_TOP = [
  "top-6",
  "top-[calc(1.5rem+80px+0.5rem)]",
  "top-[calc(1.5rem+160px+1rem)]",
  "top-[calc(1.5rem+240px+1.5rem)]",
  "top-[calc(1.5rem+320px+2rem)]",
];

const SPRING = { type: "spring" as const, bounce: 0.06, duration: 0.55 };

export function SectorStack() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const active = activeSlug
    ? SECTORS.find((s) => s.slug === activeSlug) ?? null
    : null;

  useEffect(() => {
    if (active) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [active]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSlug(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div
        className={`relative w-full max-w-sm transition-[min-height] duration-1000 ease-[cubic-bezier(0.075,0.82,0.165,1)] ${
          isExpanded ? "min-h-[510px]" : "min-h-[140px]"
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="pointer-events-none absolute inset-x-1 top-0 -mt-1 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper/45">
            Volume Index
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper/35">
            {isExpanded ? "5 / 5" : "Tap to fan out"}
          </span>
        </div>

        {SECTORS.map((s, i) => (
          <motion.button
            key={s.slug}
            type="button"
            layoutId={`sector-card-${s.slug}`}
            transition={SPRING}
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpanded) {
                setIsExpanded(true);
                return;
              }
              setActiveSlug(s.slug);
            }}
            aria-haspopup="dialog"
            aria-expanded={activeSlug === s.slug}
            className={`group absolute inset-x-0 flex h-20 cursor-pointer items-center gap-4 rounded-2xl border border-paper/10 bg-paper/[0.03] p-4 text-left shadow-lg shadow-black/40 backdrop-blur-xl transition-colors hover:border-paper/20 hover:bg-paper/[0.06] ${
              isExpanded ? EXPANDED_TOP[i] : COLLAPSED_TOP[i]
            }`}
            style={{ zIndex: 10 + i }}
          >
            <motion.div
              layoutId={`sector-swatch-${s.slug}`}
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-paper/15 ${SWATCH[s.color]}`}
            >
              <span
                className={`font-mono text-[11px] font-semibold tracking-[0.1em] ${
                  s.color === "paper" ? "text-ink/85" : "text-paper/90"
                }`}
              >
                {s.vol.replace("VOL.", "")}
              </span>
            </motion.div>
            <div className="min-w-0 flex-1">
              <motion.p
                layoutId={`sector-title-${s.slug}`}
                className="mb-0.5 truncate font-display text-[15px] font-medium text-paper"
              >
                {s.title}
              </motion.p>
              <motion.p
                layoutId={`sector-emphasis-${s.slug}`}
                className="line-clamp-1 font-sans text-[12px] italic text-paper/60"
              >
                {s.emphasis}
              </motion.p>
            </div>
            <span className="font-mono text-[12px] text-paper/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-paper/85">
              +
            </span>
          </motion.button>
        ))}

        <div
          className={`absolute inset-x-0 top-[calc(1.5rem+400px+2.5rem)] flex justify-end transition-all duration-300 ease-in-out ${
            isExpanded
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
        >
          <button className="inline-flex h-9 items-center justify-center rounded-md border border-paper/15 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/65 transition-colors hover:border-paper/30 hover:bg-paper/5 hover:text-paper">
            Collapse
          </button>
        </div>
      </div>

      {/* MORPHING DIALOG */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveSlug(null)}
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-md"
            />
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div
                layoutId={`sector-card-${active.slug}`}
                transition={SPRING}
                role="dialog"
                aria-modal="true"
                aria-label={`${active.title} — full detail`}
                className="pointer-events-auto relative w-full max-w-[540px] overflow-hidden rounded-3xl border border-paper/15 bg-ink-2/85 p-8 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(244,239,227,0.08)] backdrop-blur-2xl"
              >
                {/* color tint glow */}
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl ${SWATCH[active.color]}`}
                />
                {/* glossy top sheen */}
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-paper/25 to-transparent" />

                {/* close */}
                <button
                  type="button"
                  onClick={() => setActiveSlug(null)}
                  aria-label="Close dialog"
                  className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 bg-paper/[0.05] text-paper/65 transition-colors hover:border-paper/30 hover:bg-paper/[0.1] hover:text-paper"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>

                <div className="relative flex items-start gap-5">
                  <motion.div
                    layoutId={`sector-swatch-${active.slug}`}
                    className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ring-1 ring-paper/20 ${SWATCH[active.color]}`}
                  >
                    <span
                      className={`font-mono text-[13px] font-semibold tracking-[0.1em] ${
                        active.color === "paper" ? "text-ink/85" : "text-paper/95"
                      }`}
                    >
                      {active.vol.replace("VOL.", "")}
                    </span>
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45">
                      {active.vol} · {active.meta}
                    </span>
                    <motion.h3
                      layoutId={`sector-title-${active.slug}`}
                      className="mt-2 font-display text-[34px] font-medium leading-[1.05] tracking-[-0.01em] text-paper"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`sector-emphasis-${active.slug}`}
                      className="mt-1 font-display text-[16px] italic text-paper/65"
                    >
                      — {active.emphasis}
                    </motion.p>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="relative mt-8 font-sans text-[15px] leading-[1.6] text-paper-dim"
                >
                  {active.body}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="relative mt-6 flex flex-wrap gap-1.5"
                >
                  {active.positions.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-paper/15 bg-paper/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-paper/70"
                    >
                      {p}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="relative mt-8 flex items-center justify-between border-t border-paper/10 pt-5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">
                    Esc · or · click outside
                  </span>
                  <Link
                    href={active.href}
                    className="group inline-flex items-center gap-3 rounded-full border border-paper/20 bg-paper/[0.04] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors hover:border-paper/40 hover:bg-paper/[0.08]"
                  >
                    Open volume
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
