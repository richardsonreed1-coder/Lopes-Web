"use client";

import { useState } from "react";
import {
  MistBackground,
  type FogPalette,
  type FogEntryDir,
} from "@/components/mist-background";

const OBSIDIAN_FOG: FogPalette = {
  base: [0.022, 0.025, 0.035],
  mist: [0.1, 0.06, 0.18],
  accent: [0.48, 0.31, 0.85],
  glow: [0.78, 0.55, 1.0],
  speed: 1.15,
  turbulence: 1.4,
  brightness: 1.45,
};

const DIRS: { key: FogEntryDir; label: string; blurb: string }[] = [
  { key: "bottom", label: "Rise from bottom", blurb: "Fog crawls up the page from below." },
  { key: "left",   label: "Drift in from left", blurb: "Fog drifts horizontally across." },
];

type DensityKey = "bottom" | "edges" | "denser";
const DENSITIES: { key: DensityKey; label: string; blurb: string }[] = [
  { key: "bottom", label: "Heavier at bottom", blurb: "Mist pools near the footer, thins toward the top." },
  { key: "edges",  label: "Heavier at edges",  blurb: "Vignette of dense fog around the perimeter." },
  { key: "denser", label: "Uniform but denser", blurb: "Same coverage as default, mist turned up." },
];

const ENTRY_DURATION = 1.5;

export default function FogPreviewPage() {
  const [dir, setDir] = useState<FogEntryDir>("bottom");
  const [density, setDensity] = useState<DensityKey>("bottom");
  const [replay, setReplay] = useState(0);

  const shaderDensity =
    density === "bottom" ? "bottom" : density === "edges" ? "edges" : "uniform";
  const intensity = density === "denser" ? 1.4 : 1.0;

  // Bumping the `key` remounts MistBackground so the entry animation replays.
  const fogKey = `${dir}-${density}-${replay}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-paper">
      <MistBackground
        key={fogKey}
        palette={OBSIDIAN_FOG}
        entry={{ dir, duration: ENTRY_DURATION }}
        density={shaderDensity}
        intensity={intensity}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1100px] flex-col px-8 py-12 md:px-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-2">
              Preview · Fog entry &amp; density
            </div>
            <h1 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-normal leading-[1.05] tracking-[-0.02em]">
              Pick a fog{" "}
              <em className="italic font-medium text-purple-2">behavior</em>.
            </h1>
            <p className="mt-3 max-w-[52ch] font-sans text-[14px] leading-[1.6] text-paper/65">
              Animation length: {ENTRY_DURATION.toFixed(1)}s cinematic. Hit
              replay to re-run the entry — every chip change replays on its own.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 space-y-6">
          <ChipRow
            label="Direction"
            options={DIRS.map((d) => ({ key: d.key as string, label: d.label, blurb: d.blurb }))}
            active={dir as string}
            onSelect={(k) => setDir(k as FogEntryDir)}
          />
          <ChipRow
            label="Thickness"
            options={DENSITIES.map((d) => ({ key: d.key, label: d.label, blurb: d.blurb }))}
            active={density}
            onSelect={(k) => setDensity(k as DensityKey)}
          />
          <div>
            <button
              type="button"
              onClick={() => setReplay((r) => r + 1)}
              className="rounded-full border border-paper/30 bg-paper/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper backdrop-blur-md transition-colors hover:border-paper/50 hover:bg-paper/[0.10]"
            >
              ↻ Replay entry
            </button>
          </div>
        </div>

        <div className="mt-auto pt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45">
          Current: {dir} · {density}
        </div>
      </div>
    </div>
  );
}

function ChipRow({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: { key: string; label: string; blurb: string }[];
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-paper/45">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const isActive = o.key === active;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onSelect(o.key)}
              title={o.blurb}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur-md transition-colors ${
                isActive
                  ? "border-paper/45 bg-paper/[0.10] text-paper"
                  : "border-paper/15 bg-paper/[0.03] text-paper/55 hover:border-paper/30 hover:bg-paper/[0.06] hover:text-paper"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
