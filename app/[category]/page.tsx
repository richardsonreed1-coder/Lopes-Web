import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_SLUGS,
  isCategorySlug,
  ledgerBySlug,
  ledgers,
  operatorsForCategory,
} from "@/lib/content";
import type { LedgerColor } from "@/lib/content";
import { MistBackground } from "@/components/mist-background";
import { CurtainLink, type CurtainVariant } from "@/components/curtain-link";

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const ledger = ledgerBySlug(category);
  if (!ledger) return {};
  return {
    title: `${ledger.title} — Lopes Capital`,
    description: ledger.body,
  };
}

const ACCENT_FALLBACK: Record<LedgerColor, string> = {
  purple: "#A988F5",
  gold: "#E5A52B",
  burgundy: "#E64A58",
  teal: "#5BB8C0",
  olive: "#B7C474",
  paper: "#F4EFE3",
};

/** Capitalize first letter; split off the last word as the italic accent.
 *  e.g. "pricing the distortion" → ["Pricing the", "distortion"] */
function splitHeadline(emphasis: string): [string, string] {
  const words = emphasis.trim().split(/\s+/);
  const last = words.pop() ?? "";
  const lead = words.join(" ");
  const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  return [cap(lead), last];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategorySlug(category)) notFound();
  const ledger = ledgerBySlug(category);
  if (!ledger) notFound();

  const ops = operatorsForCategory(category);
  const others = ledgers.filter((l) => l.slug !== category);
  const volNum = ledger.vol.replace("VOL.", "");
  const accent = ledger.accent ?? ACCENT_FALLBACK[ledger.color];
  const [leadTitle, accentTitle] = splitHeadline(ledger.emphasis);
  const stats = ledger.stats ?? [];
  const timeline = ledger.timeline ?? [];
  // Each sector exits via the same transition it entered with, so the visual
  // language stays consistent in both directions.
  const BACK_VARIANT: Record<string, CurtainVariant> = {
    "capital-markets": "candlestick",
    "real-estate":     "rolling-door",
    "education":       "chalkboard",
    "healthcare":      "ekg-monitor",
    "media-consumer":  "theater-curtains",
  };
  const backVariant: CurtainVariant = BACK_VARIANT[category] ?? "default";

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink font-sans text-paper selection:bg-paper/10">
      {/* PER-SECTOR FOG */}
      <MistBackground palette={ledger.fog} />
      {/* atmospheric blur spots, subtly tinted by the sector accent */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-[#1A1B22] blur-[120px]" />
        <div
          className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full opacity-40 blur-[140px]"
          style={{ background: accent }}
        />
        <div className="absolute left-[30%] top-[40%] h-[40%] w-[40%] rounded-full bg-[#14151f] blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* TOP NAV */}
        <nav className="grid grid-cols-3 items-center px-8 py-6 md:px-12">
          <CurtainLink
            href="/"
            accent="#7A4FD9"
            label="Returning to hub"
            variant={backVariant}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/65 transition-colors hover:text-paper"
          >
            ← Back to hub
          </CurtainLink>
          <div className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
            lopes capital{" "}
            <span style={{ color: accent }}>{ledger.vol}</span>
          </div>
          <div className="flex items-center justify-end gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
            <CurtainLink
              href="/"
              accent="#7A4FD9"
              label="Returning to hub"
              variant={backVariant}
              className="transition-colors hover:text-paper"
            >
              Preview
            </CurtainLink>
            <span className="text-paper/30">·</span>
            <Link href="#walkthrough" className="transition-colors hover:text-paper">
              Walkthrough
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="px-8 pt-12 pb-16 md:px-12 md:pt-20 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em]">
              <span style={{ color: accent }}>{ledger.vol}</span>
              <span className="text-paper/45">
                {" "}· {ledger.title} · {ledger.meta}
              </span>
            </div>

            <h1 className="mt-7 font-display text-[clamp(56px,8.5vw,128px)] font-normal leading-[0.95] tracking-[-0.025em] text-paper">
              {leadTitle}{" "}
              <em
                className="italic font-medium"
                style={{ color: accent }}
              >
                {accentTitle}
              </em>
              <span className="text-paper">.</span>
            </h1>

            <p className="mt-9 max-w-[64ch] font-sans text-[17px] leading-[1.65] text-paper-dim md:text-[18px]">
              {ledger.thesis ?? ledger.body}
            </p>

            {/* STATS GRID */}
            {stats.length > 0 && (
              <div className="mt-14 grid grid-cols-2 border-y border-paper/10 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`px-6 py-7 ${
                      i < stats.length - 1 ? "sm:border-r border-paper/10" : ""
                    } ${i % 2 === 0 ? "border-r border-paper/10 sm:border-r" : ""} ${
                      i < 2 ? "border-b border-paper/10 sm:border-b-0" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45">
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ background: accent, boxShadow: `0 0 8px ${accent}80` }}
                      />
                      {s.label}
                    </div>
                    <div className="mt-3 font-display text-[34px] font-medium leading-none tracking-tight text-paper">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* POSITIONS — 2x2 cards with descriptions */}
        <section className="px-8 pb-16 md:px-12 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {ledger.positions.map((p) => (
                <div
                  key={p.label}
                  className="group relative overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.025] p-7 backdrop-blur-md transition-colors hover:border-paper/25 hover:bg-paper/[0.05]"
                >
                  {/* subtle accent glow on hover */}
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: accent }}
                  />
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: accent }}
                  >
                    Position
                  </div>
                  <h3 className="mt-3 font-display text-[26px] font-medium leading-tight tracking-tight text-paper">
                    {p.label}
                  </h3>
                  {p.description && (
                    <p className="mt-4 max-w-[58ch] font-sans text-[14.5px] leading-[1.6] text-paper-dim">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STRATEGY (if present) */}
        {ledger.strategy && (
          <section
            id="walkthrough"
            className="border-t border-paper/10 px-8 py-16 md:px-12 md:py-24"
          >
            <div className="mx-auto max-w-[1200px] md:grid md:grid-cols-[200px_1fr] md:gap-12">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
                Strategy
              </div>
              <div className="mt-4 md:mt-0">
                <h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
                  How we deploy.
                </h2>
                <p className="mt-6 max-w-[72ch] font-sans text-[16px] leading-[1.75] text-paper-dim md:text-[17px]">
                  {ledger.strategy}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* OPERATORS */}
        {ops.length > 0 && (
          <section className="border-t border-paper/10 px-8 py-16 md:px-12 md:py-20">
            <div className="mx-auto max-w-[1200px]">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
                Operators on file
              </div>
              <h2 className="mt-5 font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
                Names. Numbers. Eras.
              </h2>
              <div className="mt-10 overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.02] backdrop-blur-md">
                <div className="grid grid-cols-[80px_1fr_140px_120px] border-b border-paper/10 px-6 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-paper/50">
                  <span>ID</span>
                  <span>Operator</span>
                  <span>Era</span>
                  <span className="text-right">Status</span>
                </div>
                {ops.map((op, i) => (
                  <div
                    key={op.num + op.name}
                    className={`grid grid-cols-[80px_1fr_140px_120px] items-center px-6 py-5 transition-colors hover:bg-paper/[0.04] ${
                      i < ops.length - 1 ? "border-b border-paper/5" : ""
                    }`}
                  >
                    <span className="font-mono text-[12px] text-paper/55">
                      {op.num}
                    </span>
                    <span className="font-display text-[20px] font-medium tracking-tight text-paper">
                      {op.name}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper-dim">
                      {op.era}
                    </span>
                    <span
                      className="text-right font-mono text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: accent }}
                    >
                      ◉ Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TIMELINE */}
        {timeline.length > 0 && (
          <section className="border-t border-paper/10 px-8 py-16 md:px-12 md:py-20">
            <div className="mx-auto max-w-[1200px]">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
                Mandate timeline
              </div>
              <h2 className="mt-5 font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
                On the tape.
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-px rounded-2xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
                {timeline.map((t, i) => (
                  <div
                    key={`${t.year}-${i}`}
                    className="bg-ink/80 p-6 backdrop-blur-md first:rounded-tl-2xl last:rounded-br-2xl"
                  >
                    <div
                      className="font-display text-[44px] font-medium leading-none"
                      style={{ color: accent }}
                    >
                      {t.year}
                    </div>
                    <div className="mt-3 font-sans text-[13px] leading-[1.5] text-paper-dim">
                      {t.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ADJACENT */}
        <section className="border-t border-paper/10 px-8 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
              Adjacent volumes
            </div>
            <h2 className="mt-5 font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
              The rest of the ledger.
            </h2>
            <div className="mt-10 divide-y divide-paper/5 overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.02] backdrop-blur-md">
              {others.map((l) => {
                const oAccent = l.accent ?? ACCENT_FALLBACK[l.color];
                return (
                  <CurtainLink
                    key={l.slug}
                    href={l.href}
                    accent={oAccent}
                    label={`Opening ${l.title}`}
                    className="group grid grid-cols-[80px_1fr_auto] items-center gap-6 px-6 py-5 transition-colors hover:bg-paper/[0.04]"
                  >
                    <span
                      className="font-mono text-[11px] tracking-[0.25em] uppercase"
                      style={{ color: oAccent }}
                    >
                      {l.vol}
                    </span>
                    <span>
                      <span className="font-display text-[22px] font-medium tracking-tight text-paper">
                        {l.title}
                      </span>
                      <span className="ml-3 font-display text-[14px] italic text-paper/55">
                        — {l.emphasis}
                      </span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/55 transition-all duration-300 group-hover:translate-x-1 group-hover:text-paper">
                      Open →
                    </span>
                  </CurtainLink>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="border-t border-paper/10 px-8 py-8 md:px-12">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 md:flex-row md:items-center">
            <span>Lopes Capital · Internal Distribution</span>
            <span>
              File hash · 0x
              <span style={{ color: accent }}>
                {ledger.slug.replace(/-/g, "").slice(0, 8).toUpperCase()}
              </span>
              -{volNum}
            </span>
            <CurtainLink href="/" accent="#7A4FD9" label="Returning to hub" variant={backVariant} className="transition-colors hover:text-paper">
              ← Back to hub
            </CurtainLink>
          </div>
        </footer>
      </div>
    </div>
  );
}
