"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MistBackground } from "@/components/mist-background";
import { VolumeCounter } from "@/components/volume-counter";

export default function FogPage() {
  return (
    <div
      id="app-container"
      className="relative h-screen text-white flex flex-col font-sans overflow-hidden selection:bg-white/10"
    >
      <MistBackground />

      {/* Atmospheric Blur Spots */}
      <div
        id="atmospheric-layers"
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30"
      >
        <div
          id="blur-1"
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1e2029] blur-[120px]"
        />
        <div
          id="blur-2"
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#2d3345] blur-[140px]"
        />
        <div
          id="blur-3"
          className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#14151f] blur-[100px]"
        />
      </div>

      {/* Content Layer */}
      <div
        id="content-layer"
        className="relative z-10 flex flex-col h-full p-8 md:p-12 lg:p-16"
      >
        {/* Navigation */}
        <nav
          id="top-nav"
          className="flex justify-between items-center mb-12 md:mb-24"
        >
          <div
            id="brand-logo"
            className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-semibold"
          >
            <b className="font-bold text-[#5028A0]">Lopes</b> / Capital
          </div>
          <div
            id="nav-links"
            className="hidden md:flex gap-10 text-[10px] tracking-[0.2em] uppercase opacity-60"
          >
            <Link href="/#categories" className="hover:opacity-100 transition-opacity">
              Volumes
            </Link>
            <Link href="/#operators" className="hover:opacity-100 transition-opacity">
              Operators
            </Link>
            <Link href="/#letters" className="hover:opacity-100 transition-opacity">
              Letters
            </Link>
            <Link href="/#contact" className="hover:opacity-100 transition-opacity">
              Contact
            </Link>
          </div>
        </nav>

        {/* Main Hero Section */}
        <main
          id="main-hero"
          className="flex-1 flex flex-col justify-center items-start max-w-4xl relative"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <div id="hero-status" className="mb-6 flex items-center gap-4">
              <span
                id="line-indicator"
                className="h-[1px] w-12 bg-gradient-to-r from-[#5028A0]/70 to-transparent"
              />
              <span
                id="status-label"
                className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-[#5028A0]/80"
              >
                Volume IX · MMXXVI
              </span>
            </div>

            <h1
              id="hero-title"
              className="text-[64px] sm:text-[84px] lg:text-[110px] leading-[0.9] font-serif italic mb-8 -ml-1"
            >
              Quiet <br />
              <span className="ml-12 md:ml-16 text-[#5028A0]">Capital.</span>
            </h1>

            <p
              id="hero-description"
              className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-md"
            >
              A multi-family office operating five sectors and written in six
              volumes &mdash; signed, dated, and on the record since 2017.
            </p>

            <div
              id="interactive-elements"
              className="mt-16 w-full flex flex-col md:flex-row items-start gap-12"
            >
              <VolumeCounter />

              <div
                id="simulation-meta"
                className="flex flex-col gap-8 pt-4"
              >
                <div id="meta-item-1" className="flex flex-col gap-2">
                  <span className="text-[10px] tracking-[0.3em] uppercase opacity-40">
                    Coverage Model
                  </span>
                  <p className="text-xs text-zinc-300 font-light max-w-[200px]">
                    Five lanes &mdash; private markets, public markets,
                    event-driven, signals, hard assets.
                  </p>
                </div>
                <div id="meta-item-2" className="flex flex-col gap-2">
                  <span className="text-[10px] tracking-[0.3em] uppercase opacity-40">
                    Cadence
                  </span>
                  <p className="text-xs text-zinc-300 font-light max-w-[200px]">
                    One letter per year, signed and dated. The archive runs
                    2018 through 2025.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/capital-markets"
              id="cta-button"
              className="mt-16 group flex items-center gap-6 cursor-pointer"
            >
              <div
                id="outer-circle"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors"
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  id="inner-dot"
                  className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"
                />
              </div>
              <span
                id="cta-text"
                className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase group-hover:opacity-100 opacity-60 transition-opacity font-medium"
              >
                Open Volume One
              </span>
            </Link>
          </motion.div>
        </main>

        {/* Footer Meta */}
        <footer
          id="bottom-footer"
          className="mt-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div
            id="tech-meta"
            className="flex flex-wrap gap-8 md:gap-16"
          >
            <div id="meta-tech" className="flex flex-col gap-2">
              <span className="text-[8px] md:text-[9px] tracking-widest uppercase opacity-40">
                Mandate
              </span>
              <span className="text-xs font-mono text-zinc-200">
                Multi-Family Office
              </span>
            </div>
            <div id="meta-fps" className="flex flex-col gap-2">
              <span className="text-[8px] md:text-[9px] tracking-widest uppercase opacity-40">
                Vintage
              </span>
              <span className="text-xs font-mono text-zinc-200 tracking-tighter">
                Est. 2017
              </span>
            </div>
            <div id="meta-origin" className="flex flex-col gap-2">
              <span className="text-[8px] md:text-[9px] tracking-widest uppercase opacity-40">
                Environment
              </span>
              <span className="text-xs font-mono text-zinc-200">
                Scottsdale · Arizona
              </span>
            </div>
          </div>

          <div
            id="section-index"
            className="text-right self-end md:self-auto"
          >
            <div className="text-[32px] md:text-[42px] font-serif italic leading-none text-[#5028A0]">
              IX
            </div>
            <div className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-40 mt-1">
              Volume Index
            </div>
          </div>
        </footer>
      </div>

      {/* Decorative Grid Overlay */}
      <div
        id="grid-overlay"
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Atmosphere depth vignette */}
      <div
        id="atmosphere-depth"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/60"
      />
    </div>
  );
}
