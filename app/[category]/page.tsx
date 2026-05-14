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

const ACCENT: Record<
  LedgerColor,
  { dot: string; text: string; glow: string }
> = {
  purple: {
    dot: "bg-[#7A4FD9]",
    text: "text-[#A988F5]",
    glow: "shadow-[0_0_8px_rgba(122,79,217,0.7)]",
  },
  gold: {
    dot: "bg-gold",
    text: "text-[#C9A85A]",
    glow: "shadow-[0_0_8px_rgba(140,106,42,0.65)]",
  },
  burgundy: {
    dot: "bg-burgundy",
    text: "text-[#C76E80]",
    glow: "shadow-[0_0_8px_rgba(168,80,96,0.65)]",
  },
  teal: {
    dot: "bg-teal",
    text: "text-[#7BB0B4]",
    glow: "shadow-[0_0_8px_rgba(91,160,166,0.6)]",
  },
  olive: {
    dot: "bg-olive",
    text: "text-[#A4AC80]",
    glow: "shadow-[0_0_8px_rgba(122,129,92,0.55)]",
  },
  paper: {
    dot: "bg-paper-warm",
    text: "text-paper-warm",
    glow: "shadow-[0_0_8px_rgba(237,229,210,0.4)]",
  },
};

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
  const fileIdx = String(CATEGORY_SLUGS.indexOf(category) + 1).padStart(3, "0");
  const fileTotal = String(CATEGORY_SLUGS.length).padStart(3, "0");
  const accent = ACCENT[ledger.color];
  const timeline = ledger.timeline ?? [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink font-mono text-paper">
      {/* dot grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(244,239,227,0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* classified watermark */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden items-center justify-end pr-6 md:flex">
        <span className="-rotate-90 font-mono text-[11px] uppercase tracking-[0.6em] text-paper/20">
          Lopes · Internal · {ledger.title}
        </span>
      </div>

      <div className="relative z-10">
        {/* CLASSIFIED STRIP */}
        <header className="border-b border-rule px-6 py-4 md:px-10">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.25em] text-paper-mute transition-colors hover:text-paper"
            >
              ← Lopes Capital
            </Link>
            <div className="hidden items-center gap-6 text-[10px] uppercase tracking-[0.25em] text-paper-mute md:flex">
              <span>
                File · {fileIdx} / {fileTotal}
              </span>
              <span
                className={`h-1.5 w-1.5 animate-pulse rounded-full ${accent.dot}`}
              />
              <span>Status · Active</span>
              <span>Clearance · Operator</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-paper-mute">
              Vol. {volNum} · MMXXVI
            </div>
          </div>
        </header>

        {/* HEADER BLOCK */}
        <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
              [ {ledger.vol} ] · [ {ledger.meta} ]
            </div>

            <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr] md:items-end">
              <div className="font-display text-[clamp(120px,18vw,240px)] font-medium leading-[0.85] tracking-[-0.04em] text-paper">
                {volNum}
              </div>
              <div>
                <h1 className="font-display text-[clamp(40px,5.5vw,72px)] font-normal leading-[0.95] tracking-[-0.02em] text-paper">
                  {ledger.title}
                </h1>
                <div className="mt-2 font-display text-[clamp(18px,2vw,24px)] italic text-paper/60">
                  — {ledger.emphasis}
                </div>
                <p className="mt-6 max-w-[58ch] font-sans text-[15px] leading-[1.65] text-paper-dim">
                  {ledger.body}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* §02 THESIS */}
        {ledger.thesis && (
          <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
            <div className="mx-auto max-w-[1180px] md:grid md:grid-cols-[200px_1fr] md:gap-12">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                  §02 · Thesis
                </div>
                <div className="mt-3 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-paper/30 md:block">
                  The shape of the distortion
                </div>
              </div>
              <div className="mt-5 md:mt-0">
                <h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
                  What we believe.
                </h2>
                <p className="mt-6 max-w-[72ch] font-sans text-[16px] leading-[1.75] text-paper-dim md:text-[17px]">
                  {ledger.thesis}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* §03 STRATEGY */}
        {ledger.strategy && (
          <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
            <div className="mx-auto max-w-[1180px] md:grid md:grid-cols-[200px_1fr] md:gap-12">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                  §03 · Strategy
                </div>
                <div className="mt-3 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-paper/30 md:block">
                  How we deploy
                </div>
              </div>
              <div className="mt-5 md:mt-0">
                <h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
                  What we do about it.
                </h2>
                <p className="mt-6 max-w-[72ch] font-sans text-[16px] leading-[1.75] text-paper-dim md:text-[17px]">
                  {ledger.strategy}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* §04 INVESTMENTS */}
        <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="md:grid md:grid-cols-[200px_1fr] md:gap-12">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                  §04 · Investments
                </div>
                <div className="mt-3 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-paper/30 md:block">
                  Where the capital sits
                </div>
              </div>
              <div className="mt-5 md:mt-0">
                <h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
                  The book, in categories.
                </h2>
                {ledger.investments && (
                  <p className="mt-6 max-w-[72ch] font-sans text-[16px] leading-[1.75] text-paper-dim md:text-[17px]">
                    {ledger.investments}
                  </p>
                )}
              </div>
            </div>

            {/* slot cards for positions */}
            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
              {ledger.positions.map((p, i) => (
                <div
                  key={p}
                  className="group relative overflow-hidden rounded-sm border border-rule bg-ink-2 p-4 transition-colors hover:border-paper/40 hover:bg-ink"
                >
                  <div className="text-[9px] uppercase tracking-[0.3em] text-paper-mute">
                    POS-{String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 font-display text-[20px] font-medium tracking-tight text-paper">
                    {p}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-paper-mute">
                    <span>Open</span>
                    <span className="font-display italic">/active</span>
                  </div>
                  <span
                    className={`pointer-events-none absolute right-3 top-3 h-1.5 w-1.5 rounded-full ${accent.dot} ${accent.glow}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OPERATORS LEDGER */}
        {ops.length > 0 && (
          <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
            <div className="mx-auto max-w-[1180px]">
              <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                §05 · Operators on file
              </div>
              <h2 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-normal leading-[1] tracking-[-0.015em] text-paper">
                Names. Numbers. Eras.
              </h2>
              <div className="mt-10 overflow-hidden rounded-sm border border-rule bg-ink-2">
                <div className="grid grid-cols-[80px_1fr_140px_120px] border-b border-rule px-5 py-3 text-[9px] uppercase tracking-[0.25em] text-paper-mute">
                  <span>ID</span>
                  <span>Operator</span>
                  <span>Era</span>
                  <span className="text-right">Status</span>
                </div>
                {ops.map((op, i) => (
                  <div
                    key={op.num + op.name}
                    className={`grid grid-cols-[80px_1fr_140px_120px] items-center px-5 py-5 transition-colors hover:bg-ink ${
                      i < ops.length - 1 ? "border-b border-rule-soft" : ""
                    }`}
                  >
                    <span className="text-[12px] text-paper-mute">{op.num}</span>
                    <span className="font-display text-[20px] font-medium tracking-tight text-paper">
                      {op.name}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-paper-dim">
                      {op.era}
                    </span>
                    <span
                      className={`text-right text-[10px] uppercase tracking-[0.2em] ${accent.text}`}
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
          <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
            <div className="mx-auto max-w-[1180px]">
              <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                §06 · Mandate timeline
              </div>
              <h2 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-normal leading-[1] tracking-[-0.015em] text-paper">
                On the tape.
              </h2>
              <div className="mt-12 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
                {timeline.map((t, i) => (
                  <div
                    key={`${t.year}-${i}`}
                    className="bg-ink-2 p-6 shadow-[inset_0_1px_0_rgba(244,239,227,0.05)]"
                  >
                    <div className="font-display text-[44px] font-medium leading-none text-paper">
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

        {/* ADJACENT — filename style */}
        <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
              §07 · Adjacent files
            </div>
            <h2 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-normal leading-[1] tracking-[-0.015em] text-paper">
              Pull another from the cabinet.
            </h2>
            <div className="mt-10 divide-y divide-rule-soft rounded-sm border border-rule bg-ink-2">
              {others.map((l) => (
                <Link
                  key={l.slug}
                  href={l.href}
                  className="group grid grid-cols-[80px_1fr_auto] items-center gap-6 px-5 py-5 transition-colors hover:bg-ink"
                >
                  <span className="font-mono text-[12px] text-paper-mute">
                    /{l.vol.replace("VOL.", "")}
                  </span>
                  <span>
                    <span className="font-display text-[20px] font-medium tracking-tight text-paper">
                      {l.slug}
                      <span className="text-paper-mute">.vol</span>
                    </span>
                    <span className="ml-3 font-display italic text-[14px] text-paper/55">
                      — {l.emphasis}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-paper">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-paper-mute md:flex-row md:items-center">
            <span>Lopes Capital · Internal Distribution Only</span>
            <span>
              File hash · 0x{ledger.slug.replace(/-/g, "").slice(0, 8).toUpperCase()}-
              {volNum}
            </span>
            <Link href="/" className="transition-colors hover:text-paper">
              ← Lopes Capital
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
