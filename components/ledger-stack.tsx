"use client";

import { useState } from "react";
import Link from "next/link";
import type { Ledger, LedgerColor } from "@/lib/content";
import { ledgers } from "@/lib/content";

const COLOR_CLASSES: Record<LedgerColor, { bg: string; text: string; border: string }> = {
  purple: { bg: "bg-purple", text: "text-paper", border: "border-paper/30" },
  gold: { bg: "bg-gold", text: "text-paper", border: "border-paper/30" },
  burgundy: { bg: "bg-burgundy", text: "text-paper", border: "border-paper/30" },
  teal: { bg: "bg-teal", text: "text-paper", border: "border-paper/30" },
  olive: { bg: "bg-olive", text: "text-paper", border: "border-paper/30" },
  paper: { bg: "bg-paper", text: "text-ink", border: "border-ink/30" },
};

function LedgerVolume({ ledger, isOpen, onToggle }: { ledger: Ledger; isOpen: boolean; onToggle: () => void }) {
  const c = COLOR_CLASSES[ledger.color];
  return (
    <div
      className={`relative ${c.bg} ${c.text} border-t border-black/25 overflow-hidden transition-transform duration-300 ease-out hover:translate-x-2`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`vol-${ledger.slug}`}
        className={`block w-full text-left px-5 md:px-6 ${isOpen ? "pt-6 pb-3" : "py-[18px]"} cursor-pointer transition-[padding] duration-300`}
      >
        <div className="grid grid-cols-[64px_1fr_auto] gap-4 md:gap-5 items-center md:items-baseline min-h-[44px]">
          <span className="font-mono text-[11px] opacity-60 whitespace-nowrap">
            {ledger.vol}
          </span>
          <span className="font-display font-medium text-[20px] md:text-[22px] leading-none">
            {ledger.title} —{" "}
            <em className="italic opacity-85 font-normal">{ledger.emphasis}</em>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] opacity-65 whitespace-nowrap hidden md:inline">
            {ledger.meta}
          </span>
        </div>
      </button>
      <div
        id={`vol-${ledger.slug}`}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out px-5 md:px-6 ${
          isOpen ? "[grid-template-rows:1fr] opacity-100 pb-7" : "[grid-template-rows:0fr] opacity-0 pb-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-sans text-[14px] leading-relaxed max-w-[56ch] opacity-90 ml-0 md:ml-[80px] mt-2">
            {ledger.body}
          </p>
          <div className="flex flex-wrap gap-2 mt-4 ml-0 md:ml-[80px]">
            {ledger.positions.map((p) => (
              <span
                key={p}
                className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-[3px] border ${c.border} opacity-80`}
              >
                {p}
              </span>
            ))}
          </div>
          <div className="mt-5 ml-0 md:ml-[80px]">
            <Link
              href={ledger.href}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] border-b border-current pb-[2px] opacity-90 hover:opacity-100 transition-opacity"
            >
              Read full volume →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LedgerStack() {
  const [openVol, setOpenVol] = useState<string | null>(ledgers[0].vol);

  return (
    <div className="w-full max-w-[680px] mx-auto pt-8">
      <div className="flex justify-between items-baseline mb-9 font-mono text-[11px] text-paper-mute tracking-[0.1em] uppercase">
        <span>The stack ↓</span>
        <span>Tap a volume to read</span>
      </div>
      <div className="flex flex-col">
        {ledgers.map((l) => (
          <LedgerVolume
            key={l.vol}
            ledger={l}
            isOpen={openVol === l.vol}
            onToggle={() => setOpenVol(openVol === l.vol ? null : l.vol)}
          />
        ))}
      </div>
    </div>
  );
}
