"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ledgers } from "@/lib/content";

export function VolumeCounter() {
  const [idx, setIdx] = useState(0);
  const total = ledgers.length;
  const cur = ledgers[idx];
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);
  const num = String(idx + 1).padStart(2, "0");

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 backdrop-blur-sm transition-colors hover:bg-white/[0.035]">
      <h3 className="mb-1 font-mono text-[10px] uppercase tracking-[0.4em] text-white/45">
        Volume Index
      </h3>

      <div className="relative flex flex-col items-center justify-center">
        <motion.div
          key={num}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[72px] leading-none tracking-tighter text-white/90"
        >
          {num}
        </motion.div>
        <motion.div
          key={`label-${num}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-3 max-w-[220px] text-center font-serif text-[15px] italic leading-tight text-white/75"
        >
          {cur.title}
          <span className="block font-sans not-italic text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">
            {cur.emphasis}
          </span>
        </motion.div>
        <div className="absolute inset-0 -z-10 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="mt-2 flex items-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous volume"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all hover:border-white/30 hover:bg-white/5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-white/45 transition-opacity group-hover:text-white/95">
            <path d="M5 12h14" />
          </svg>
        </button>
        <div className="h-px w-8 bg-white/10" />
        <button
          onClick={next}
          aria-label="Next volume"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all hover:border-white/30 hover:bg-white/5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-white/45 transition-opacity group-hover:text-white/95">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 pt-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7A4FD9] shadow-[0_0_8px_rgba(122,79,217,0.7)]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/45">
            Currently in flight
          </span>
        </div>
      </div>
    </div>
  );
}
