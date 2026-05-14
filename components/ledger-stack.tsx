"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { Ledger, LedgerColor } from "@/lib/content";
import { ledgers } from "@/lib/content";

const COLOR_BG: Record<LedgerColor, string> = {
  purple: "bg-purple",
  gold: "bg-gold",
  burgundy: "bg-burgundy",
  teal: "bg-teal",
  olive: "bg-olive",
  paper: "bg-paper-warm",
};

const positionStyles = [
  { scale: 1, y: 8 },
  { scale: 0.96, y: -22 },
  { scale: 0.92, y: -50 },
];

const exitAnimation = { y: 500, scale: 1, zIndex: 10 };
const enterAnimation = { y: -50, scale: 0.92 };

type Card = { id: number; lIdx: number };

function CardFace({ ledger, index, total }: { ledger: Ledger; index: number; total: number }) {
  const onColored = ledger.color !== "paper";
  const colorBg = COLOR_BG[ledger.color];
  const headText = onColored ? "text-paper" : "text-ink";
  const metaOpacity = onColored ? "opacity-70" : "opacity-60";

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={`relative ${colorBg} ${headText} px-7 pt-6 pb-7 flex flex-col shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)]`}
        style={{ flex: "0 0 52%" }}
      >
        <div className={`flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.15em] ${metaOpacity}`}>
          <span>{ledger.vol}</span>
          <span>{ledger.meta}</span>
        </div>
        <div className="mt-auto">
          <h3 className="font-display font-normal text-[26px] md:text-[30px] leading-[1.05] tracking-[-0.02em]">
            {ledger.title}
            <em className="italic font-normal opacity-90"> — {ledger.emphasis}</em>
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 bg-paper text-ink px-7 pt-5 pb-5">
        <p className="font-sans text-[13.5px] leading-[1.55] text-ink/80 max-w-[58ch]">
          {ledger.body}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ledger.positions.slice(0, 5).map((p) => (
            <span
              key={p}
              className="font-mono text-[10px] uppercase tracking-[0.08em] px-2 py-[3px] border border-ink/25 text-ink/70"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <Link
            href={ledger.href}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink border-b border-ink pb-[2px] hover:opacity-70 transition-opacity"
          >
            Read full volume →
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

function StackCard({ card, slot, isAnimating }: { card: Card; slot: number; isAnimating: boolean }) {
  const ledger = ledgers[card.lIdx];
  const { scale, y } = positionStyles[slot] ?? positionStyles[2];
  const zIndex = slot === 0 && isAnimating ? 10 : 3 - slot;
  const exitAnim = slot === 0 ? exitAnimation : undefined;
  const initialAnim = slot === 2 ? enterAnimation : undefined;

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{ type: "spring", duration: 1, bounce: 0 }}
      style={{ zIndex, left: "50%", x: "-50%", bottom: 0 }}
      className="absolute h-[440px] w-[min(92vw,560px)] overflow-hidden rounded-t-md border-x border-t border-rule bg-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65),0_8px_16px_-8px_rgba(0,0,0,0.5)] will-change-transform"
    >
      <CardFace ledger={ledger} index={card.lIdx} total={ledgers.length} />
    </motion.div>
  );
}

export function LedgerStack() {
  const total = ledgers.length;
  const [cards, setCards] = useState<Card[]>(() => [
    { id: 0, lIdx: 0 },
    { id: 1, lIdx: 1 },
    { id: 2, lIdx: 2 },
  ]);
  const [nextId, setNextId] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  const advance = () => {
    setIsAnimating(true);
    const newL = (cards[2].lIdx + 1) % total;
    setCards([cards[1], cards[2], { id: nextId, lIdx: newL }]);
    setNextId((id) => id + 1);
    setIsAnimating(false);
  };

  const jumpTo = (target: number) => {
    if (cards[0].lIdx === target) return;
    setCards([
      { id: nextId, lIdx: target },
      { id: nextId + 1, lIdx: (target + 1) % total },
      { id: nextId + 2, lIdx: (target + 2) % total },
    ]);
    setNextId((id) => id + 3);
  };

  const activeLIdx = cards[0].lIdx;

  return (
    <div className="w-full max-w-[680px] mx-auto pt-2">
      <div className="flex justify-between items-baseline mb-9 font-mono text-[11px] text-paper-mute tracking-[0.1em] uppercase">
        <span>The stack ↓</span>
        <span>Tap below to advance</span>
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="relative h-[500px] w-full overflow-hidden">
          <AnimatePresence initial={false}>
            {cards.slice(0, 3).map((card, slot) => (
              <StackCard key={card.id} card={card} slot={slot} isAnimating={isAnimating} />
            ))}
          </AnimatePresence>
        </div>

        <div className="relative z-10 -mt-px flex w-full max-w-[min(92vw,560px)] items-center justify-between border-t border-rule px-4 py-4">
          <div className="flex items-center gap-2">
            {ledgers.map((l, i) => (
              <button
                key={l.vol}
                aria-label={`Jump to ${l.vol} ${l.title}`}
                onClick={() => jumpTo(i)}
                className={`h-[7px] w-[7px] rounded-full transition-all ${
                  i === activeLIdx ? "bg-paper scale-110" : "bg-paper/25 hover:bg-paper/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={advance}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper border-b border-paper pb-[2px] hover:opacity-70 transition-opacity cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
