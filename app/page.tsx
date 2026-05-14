"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MistBackground } from "@/components/mist-background";
import { SectorStack } from "@/components/sector-stack";
import { pillars } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink font-sans text-paper selection:bg-paper/10">
      <MistBackground />

      {/* Atmospheric blur spots — layered over the WebGL mist */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#1A1B22] blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[#3a2d55] blur-[140px]" />
        <div className="absolute left-[30%] top-[40%] h-[40%] w-[40%] rounded-full bg-[#14151f] blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col p-8 md:p-12 lg:p-16">
        {/* TOP NAV */}
        <nav className="mb-12 flex items-center justify-between md:mb-20">
          <Link
            href="/"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.4em] md:text-xs"
          >
            Lopes / Capital
          </Link>
          <div className="hidden gap-10 font-mono text-[10px] uppercase tracking-[0.3em] opacity-60 md:flex">
            {pillars.map((p) => (
              <Link
                key={p.slug}
                href={`#${p.slug}`}
                className="transition-opacity hover:opacity-100"
              >
                {p.word}
              </Link>
            ))}
          </div>
        </nav>

        {/* HERO — SECTOR STACK */}
        <main className="relative flex max-w-4xl flex-1 flex-col items-start justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col items-start"
          >
            <SectorStack />

            <Link href="/capital-markets" className="group mt-14 flex items-center gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/20 transition-colors group-hover:border-paper/55 md:h-14 md:w-14">
                <motion.div
                  animate={{ scale: [1, 1.55, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="h-1.5 w-1.5 rounded-full bg-paper md:h-2 md:w-2"
                />
              </div>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] opacity-65 transition-opacity group-hover:opacity-100">
                Open Volume One →
              </span>
            </Link>
          </motion.div>
        </main>

        {/* PILLAR SECTIONS */}
        <div className="mt-24 md:mt-32">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
            §02 · Operating principles
          </div>
          <h2 className="mt-5 max-w-[18ch] font-display text-[clamp(36px,5vw,56px)] font-normal leading-[1.02] tracking-[-0.02em] text-paper">
            Four moves,{" "}
            <em className="italic text-purple-2">in order</em>.
          </h2>
        </div>

        {pillars.map((p, i) => (
          <section
            key={p.slug}
            id={p.slug}
            className="mt-14 border-t border-paper/10 pt-14 scroll-mt-24"
          >
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[180px_1fr]">
              <div className="font-display text-[clamp(72px,9vw,140px)] italic font-medium leading-[0.85] text-purple-2/80">
                {p.numeral}
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                  Principle · {String(i + 1).padStart(2, "0")} of 04
                </div>
                <h3 className="mt-4 font-display text-[clamp(40px,5vw,68px)] font-normal italic leading-[0.95] tracking-[-0.02em] text-paper">
                  {p.word}.
                </h3>
                <div className="mt-3 font-display text-[clamp(18px,2vw,22px)] italic text-paper/65">
                  — {p.emphasis}
                </div>
                <p className="mt-6 max-w-[60ch] font-sans text-[16px] leading-[1.65] text-paper-dim md:text-[17px]">
                  {p.body}
                </p>
                <Link
                  href={`/${p.slug}`}
                  className="group mt-8 inline-flex items-center gap-3 border-b border-paper/20 pb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/80 transition-colors hover:border-paper/60 hover:text-paper"
                >
                  Read the file
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </section>
        ))}

        {/* COVERAGE STRIP */}
        <section className="mt-24 grid grid-cols-1 gap-10 border-t border-paper/10 pt-10 sm:grid-cols-2 md:mt-32">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-45">
              Coverage Model
            </span>
            <p className="max-w-[36ch] font-sans text-[13px] font-light leading-relaxed text-paper-dim">
              Five lanes — private markets, public markets, event-driven,
              signals, hard assets.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-45">
              Cadence
            </span>
            <p className="max-w-[36ch] font-sans text-[13px] font-light leading-relaxed text-paper-dim">
              One letter per year, signed and dated. The archive runs 2018
              through 2025.
            </p>
          </div>
        </section>

        {/* FOOTER META */}
        <footer className="mt-12 flex flex-col items-start justify-between gap-8 border-t border-paper/10 pt-8 md:flex-row md:items-end">
          <div className="flex flex-wrap gap-8 md:gap-16">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-45">
                Mandate
              </span>
              <span className="font-mono text-xs tracking-tight text-paper-dim">
                Multi-Family Office
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-45">
                Vintage
              </span>
              <span className="font-mono text-xs tracking-tight text-paper-dim">
                Est. 2017
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-45">
                Domicile
              </span>
              <span className="font-mono text-xs tracking-tight text-paper-dim">
                Scottsdale, Arizona
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-45">
                Lineage
              </span>
              <span className="font-mono text-xs tracking-tight text-paper-dim">
                GCU · 2003 — 2018
              </span>
            </div>
          </div>

          <div className="self-end text-right md:self-auto">
            <div className="font-display text-[36px] font-normal italic leading-none text-paper/85 md:text-[44px]">
              IX
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] opacity-45">
              Volume Stack · MMXXVI
            </div>
          </div>
        </footer>
      </div>

      {/* Decorative radial grid */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Bottom vignette */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-ink/70" />
    </div>
  );
}
