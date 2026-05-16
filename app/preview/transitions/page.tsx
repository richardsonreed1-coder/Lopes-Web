"use client";

import type { CurtainVariant } from "@/components/curtain-link";

type Entry = {
  name: string;
  color: string;
  variant: CurtainVariant;
  desc: string;
  tag?: string;
};

const ENTRIES: Entry[] = [
  {
    name: "Capital Markets",
    color: "#7A4FD9",
    variant: "accounting-ledger",
    desc: "Cordovan-leather ledger with foil-stamped frames and a wax seal. Closes shut across the screen, opens to reveal.",
    tag: "Live",
  },
  {
    name: "Real Estate",
    color: "#8C6A2A",
    variant: "rolling-door",
    desc: "Industrial rolling door slams down with weight, lifts off the top with a slow ease-out.",
    tag: "Live",
  },
  {
    name: "Education",
    color: "#7B2533",
    variant: "chalkboard",
    desc: "Slate slides in from the left, an eraser sweeps across the chalk word, slides off the other side.",
    tag: "Live",
  },
  {
    name: "Healthcare — Privacy Screen",
    color: "#244B4F",
    variant: "privacy-screen",
    desc: "Folding linen hospital partition on caster wheels rolls in, settles with a small wobble, rolls out the other way.",
    tag: "Live",
  },
  {
    name: "Healthcare — X-Ray Lightbox",
    color: "#244B4F",
    variant: "xray-lightbox",
    desc: "Clinical viewing panel slides in with a backlit chest X-ray clipped to it. Fluorescent flicker on entry and exit.",
    tag: "Candidate",
  },
  {
    name: "Media & Consumer",
    color: "#3B4230",
    variant: "theater-curtains",
    desc: "Heavy velvet drapes meet in the center under a gold-trimmed proscenium valance, then part to reveal.",
    tag: "Live",
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
          One transition{" "}
          <em className="italic font-medium text-purple-2">per sector</em>.
        </h1>
        <p className="mt-3 max-w-[58ch] font-sans text-[14px] leading-[1.6] text-paper/65">
          Click any row to play the full cover &rarr; hold &rarr; uncover
          sequence in place. Healthcare currently has two candidates &mdash;
          tell me which to keep.
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
                  {s.tag && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em] ${
                        s.tag === "Live"
                          ? "border border-emerald-300/30 text-emerald-300/80"
                          : "border border-amber-300/30 text-amber-300/80"
                      }`}
                    >
                      {s.tag}
                    </span>
                  )}
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
          Lopes · Preview · Live variants are wired to the matching tiles on /.
        </div>
      </div>
    </div>
  );
}
