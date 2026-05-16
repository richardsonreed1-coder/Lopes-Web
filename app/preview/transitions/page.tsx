"use client";

import type { CurtainVariant } from "@/components/curtain-link";

type Entry = {
  name: string;
  color: string;
  variant: CurtainVariant;
  desc: string;
};

const ENTRIES: Entry[] = [
  {
    name: "Capital Markets",
    color: "#7A4FD9",
    variant: "candlestick",
    desc: "Bloomberg-terminal-style trading screen: header / chart with MAs / volume / RSI / time-and-sales tape. Playhead sweeps L→R.",
  },
  {
    name: "Real Estate",
    color: "#8C6A2A",
    variant: "rolling-door",
    desc: "Industrial rolling door slams down with weight, lifts off the top with a slow ease-out.",
  },
  {
    name: "Education",
    color: "#7B2533",
    variant: "chalkboard",
    desc: "Slate slides in from the left, an eraser sweeps across the chalk word, slides off the other side.",
  },
  {
    name: "Healthcare",
    color: "#244B4F",
    variant: "ekg-monitor",
    desc: "Multi-trace ICU monitor: ECG / SpO₂ pleth / arterial pressure / capnograph with per-trace numerics and alarm bar.",
  },
  {
    name: "Media & Consumer",
    color: "#3B4230",
    variant: "theater-curtains",
    desc: "Heavy velvet drapes meet in the center under a gold-trimmed proscenium valance, then part to reveal.",
  },
];

function trigger(variant: CurtainVariant, accent: string, label: string) {
  window.dispatchEvent(
    new CustomEvent("lopes:navigate", {
      detail: {
        href: "/preview/transitions",
        accent,
        label,
        variant,
      },
    })
  );
}

export default function TransitionsPreviewPage() {
  return (
    <div className="relative min-h-screen bg-ink px-8 py-12 text-paper md:px-12">
      <div className="mx-auto max-w-[900px]">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-2">
          Preview · Sector transitions
        </div>
        <h1 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-normal leading-[1.05] tracking-[-0.02em]">
          Five sectors,{" "}
          <em className="italic font-medium text-purple-2">five transitions</em>.
        </h1>
        <p className="mt-3 max-w-[58ch] font-sans text-[14px] leading-[1.6] text-paper/65">
          Click any row to play the full cover &rarr; hold &rarr; uncover
          sequence in place.
        </p>

        <div className="mt-12 space-y-3">
          {ENTRIES.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => trigger(s.variant, s.color, `Opening ${s.name.toLowerCase()}`)}
              className="group relative flex w-full items-center gap-6 overflow-hidden rounded-md border border-paper/12 bg-paper/[0.03] p-5 text-left backdrop-blur-md transition-colors hover:border-paper/30 hover:bg-paper/[0.07]"
            >
              <span
                className="h-12 w-1 rounded-sm"
                style={{ background: s.color }}
              />
              <div className="flex-1">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[20px] font-medium tracking-tight text-paper">
                    {s.name}
                  </span>
                  <code className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">
                    {s.variant}
                  </code>
                </div>
                <p className="mt-1 font-sans text-[13px] leading-[1.5] text-paper/60">
                  {s.desc}
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 transition-colors group-hover:text-paper">
                Play →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-16 border-t border-paper/10 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/45">
          Lopes · Preview · Variants are wired to the matching tiles on /.
        </div>
      </div>
    </div>
  );
}
