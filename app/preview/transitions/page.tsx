"use client";

import type { CurtainVariant } from "@/components/curtain-link";

type Entry = {
  name: string;
  color: string;
  variant: CurtainVariant;
  desc: string;
  tag?: "Live" | "Candidate";
};

const ENTRIES: Entry[] = [
  {
    name: "Capital Markets",
    color: "#7A4FD9",
    variant: "candlestick",
    desc: "Bloomberg-style trading screen: header / chart with MAs / volume / RSI / time-and-sales tape. Playhead sweeps L→R.",
    tag: "Live",
  },
  {
    name: "Real Estate",
    color: "#8C6A2A",
    variant: "rolling-door",
    desc: "Storage-unit rollup: painted-stencil unit number, brass padlock + hasp, aluminum sill, concrete floor.",
    tag: "Live",
  },
  {
    name: "Education",
    color: "#7B2533",
    variant: "chalkboard",
    desc: "Wood-framed slate slides in, felt eraser sweeps across the chalk word, slides off other side.",
    tag: "Live",
  },
  {
    name: "Healthcare — EKG Monitor",
    color: "#244B4F",
    variant: "ekg-monitor",
    desc: "Multi-trace ICU monitor with bezel, status LEDs, soft keys. ECG / SpO₂ / ART / CO₂ with per-trace numerics.",
    tag: "Live",
  },
  {
    name: "Healthcare — Laser Scan",
    color: "#244B4F",
    variant: "laser-scan",
    desc: "Red laser line sweeps top→bottom across a black field, body silhouette in red contour fills in. Scan-percent readout.",
    tag: "Candidate",
  },
  {
    name: "Healthcare — Frequency Tuner",
    color: "#244B4F",
    variant: "frequency-tuner",
    desc: "Four sine-wave lanes at named frequencies (Schumann / Gamma / Verdi / Solfeggio). Each draws in and locks.",
    tag: "Candidate",
  },
  {
    name: "Healthcare — LED Panel",
    color: "#244B4F",
    variant: "led-panel",
    desc: "Photobiomodulation panel: brushed-aluminum housing, 5×7 grid of red LEDs ignite in an expanding wave from center.",
    tag: "Candidate",
  },
  {
    name: "Media & Consumer",
    color: "#3B4230",
    variant: "theater-curtains",
    desc: "Heavy velvet drapes meet under a gold-trimmed proscenium valance, then part to reveal.",
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
          Healthcare candidates,{" "}
          <em className="italic font-medium text-purple-2">side-by-side</em>.
        </h1>
        <p className="mt-3 max-w-[58ch] font-sans text-[14px] leading-[1.6] text-paper/65">
          Three laser/frequency variants are live for comparison alongside the
          current EKG monitor. Tell me which to keep.
        </p>

        <div className="mt-12 space-y-3">
          {ENTRIES.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => trigger(s.variant, s.color, `Opening ${s.name.toLowerCase()}`)}
              className="group relative flex w-full items-center gap-6 overflow-hidden rounded-md border border-paper/12 bg-paper/[0.03] p-5 text-left backdrop-blur-md transition-colors hover:border-paper/30 hover:bg-paper/[0.07]"
            >
              <span className="h-12 w-1 rounded-sm" style={{ background: s.color }} />
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
          Lopes · Preview · Pick one for the live tile.
        </div>
      </div>
    </div>
  );
}
