"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MistBackground } from "@/components/mist-background";
import { VolumeCounter } from "@/components/volume-counter";

export default function FogPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-ink font-sans text-paper selection:bg-paper/10">
      <MistBackground />

      {/* Atmospheric blur spots — layered over the WebGL mist */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#1A1B22] blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-[#3a2d55] blur-[140px]" />
        <div className="absolute left-[30%] top-[40%] h-[40%] w-[40%] rounded-full bg-[#14151f] blur-[100px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col p-8 md:p-12 lg:p-16">
        {/* TOP NAV */}
        <nav className="mb-12 flex items-center justify-between md:mb-20">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.4em] md:text-xs">
            Lopes / Capital
          </div>
          <div className="hidden gap-10 font-mono text-[10px] uppercase tracking-[0.25em] opacity-60 md:flex">
            <Link href="/#categories" className="transition-opacity hover:opacity-100">Volumes</Link>
            <Link href="/#operators" className="transition-opacity hover:opacity-100">Operators</Link>
            <Link href="/#letters" className="transition-opacity hover:opacity-100">Letters</Link>
            <Link href="/#contact" className="transition-opacity hover:opacity-100">Contact</Link>
          </div>
        </nav>

        {/* HERO */}
        <main className="relative flex max-w-4xl flex-1 flex-col items-start justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-paper/30" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-55 md:text-[11px]">
                Volume IX · MMXXVI
              </span>
            </div>

            <h1 className="font-display -ml-1 mb-8 text-[64px] font-normal italic leading-[0.9] tracking-[-0.02em] sm:text-[84px] lg:text-[110px]">
              Quiet <br />
              <span className="ml-12 text-purple-2 md:ml-16">Capital.</span>
            </h1>

            <p className="max-w-md font-sans text-[17px] font-light leading-relaxed text-paper-dim md:text-[19px]">
              A multi-family office operating five sectors and written in six
              volumes — signed, dated, and on the record since 2017.
            </p>

            <div className="mt-14 flex w-full flex-col items-start gap-12 md:flex-row">
              <VolumeCounter />

              <div className="flex flex-col gap-8 pt-4">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-45">
                    Coverage Model
                  </span>
                  <p className="max-w-[230px] font-sans text-[12.5px] font-light leading-relaxed text-paper-dim">
                    Five lanes — private markets, public markets,
                    event-driven, signals, hard assets.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-45">
                    Cadence
                  </span>
                  <p className="max-w-[230px] font-sans text-[12.5px] font-light leading-relaxed text-paper-dim">
                    One letter per year, signed and dated. The archive runs
                    2018 through 2025.
                  </p>
                </div>
              </div>
            </div>

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

        {/* FOOTER META */}
        <footer className="mt-auto flex flex-col items-start justify-between gap-8 border-t border-paper/10 pt-8 md:flex-row md:items-end">
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
