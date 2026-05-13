import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_SLUGS, isCategorySlug, ledgerBySlug, ledgers, operatorsForCategory } from "@/lib/content";
import type { LedgerColor } from "@/lib/content";

const HERO_BG: Record<LedgerColor, string> = {
  purple: "bg-purple",
  gold: "bg-gold",
  burgundy: "bg-burgundy",
  teal: "bg-teal",
  olive: "bg-olive",
  paper: "bg-paper",
};

const HERO_TEXT: Record<LedgerColor, { primary: string; muted: string; faint: string; chip: string }> = {
  purple: { primary: "text-paper", muted: "text-paper/80", faint: "text-paper/60", chip: "border-paper/30 text-paper/80" },
  gold: { primary: "text-paper", muted: "text-paper/85", faint: "text-paper/65", chip: "border-paper/35 text-paper/85" },
  burgundy: { primary: "text-paper", muted: "text-paper/80", faint: "text-paper/60", chip: "border-paper/30 text-paper/80" },
  teal: { primary: "text-paper", muted: "text-paper/80", faint: "text-paper/60", chip: "border-paper/30 text-paper/80" },
  olive: { primary: "text-paper", muted: "text-paper/80", faint: "text-paper/60", chip: "border-paper/30 text-paper/80" },
  paper: { primary: "text-ink", muted: "text-ink/75", faint: "text-ink/55", chip: "border-ink/30 text-ink/75" },
};

const CROSS_BG: Record<LedgerColor, string> = HERO_BG;
const CROSS_TEXT: Record<LedgerColor, string> = {
  purple: "text-paper",
  gold: "text-paper",
  burgundy: "text-paper",
  teal: "text-paper",
  olive: "text-paper",
  paper: "text-ink",
};

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const ledger = ledgerBySlug(category);
  if (!ledger) return {};
  return {
    title: `${ledger.title} — Lopes Capital`,
    description: ledger.body,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isCategorySlug(category)) notFound();
  const ledger = ledgerBySlug(category);
  if (!ledger) notFound();

  const ops = operatorsForCategory(category);
  const others = ledgers.filter((l) => l.slug !== category);
  const heroText = HERO_TEXT[ledger.color];

  return (
    <main className="relative">
      {/* HERO — colored volume cover */}
      <section className={`${HERO_BG[ledger.color]} pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10`}>
        <div className="max-w-[1100px] mx-auto">
          <Link
            href="/#categories"
            className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] ${heroText.faint} hover:${heroText.primary} transition-colors`}
          >
            ← All volumes
          </Link>
          <div className={`mt-12 font-mono text-[11px] tracking-[0.18em] uppercase ${heroText.muted}`}>
            {ledger.vol} · {ledger.meta}
          </div>
          <h1 className={`mt-5 font-display font-normal text-[clamp(48px,8vw,104px)] leading-[0.95] tracking-[-0.025em] ${heroText.primary} max-w-[18ch]`}>
            {ledger.title}
            <span className={`block italic font-medium ${heroText.primary} opacity-90`}>
              <span className="opacity-60">— </span>
              {ledger.emphasis}
            </span>
          </h1>
          <p className={`mt-10 font-sans text-[19px] md:text-[21px] leading-[1.55] max-w-[60ch] ${heroText.muted}`}>
            {ledger.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {ledger.positions.map((p) => (
              <span
                key={p}
                className={`font-mono text-[11px] uppercase tracking-[0.1em] px-3 py-[5px] border ${heroText.chip}`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* OPERATORS IN THIS VOLUME */}
      {ops.length > 0 && (
        <section className="px-6 md:px-10 py-24 md:py-32 max-w-[1100px] mx-auto">
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-purple-2 mb-8">
            01 / Properties
          </div>
          <h2 className="font-display font-normal text-[clamp(32px,5vw,52px)] leading-[1.05] tracking-[-0.02em] mb-8">
            {ops.length === 1 ? "The position." : `${ops.length} positions in this volume.`}
          </h2>
          <p className="font-sans text-[18px] leading-[1.6] max-w-[58ch] text-paper-dim">
            Active and historic positions within {ledger.title}. Numbered as they
            came into the portfolio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule mt-12">
            {ops.map((op) => (
              <div
                key={op.num + op.name}
                className="bg-ink p-7 flex flex-col gap-3 transition-colors duration-200 hover:bg-ink-2 min-h-[180px]"
              >
                <div className="font-mono text-[10px] tracking-[0.15em] text-paper-faint">
                  {op.num}
                </div>
                <div className="font-display font-medium text-[22px] leading-[1.1] tracking-tight">
                  {op.name}
                </div>
                <div className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-paper-mute">
                  {op.era}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OTHER VOLUMES */}
      <section className="px-6 md:px-10 py-24 md:py-32 max-w-[1100px] mx-auto">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-purple-2 mb-8">
          02 / Adjacent volumes
        </div>
        <h2 className="font-display font-normal text-[clamp(32px,5vw,52px)] leading-[1.05] tracking-[-0.02em] mb-12">
          The rest of the ledger.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {others.map((l) => (
            <Link
              key={l.slug}
              href={l.href}
              className={`group block p-6 ${CROSS_BG[l.color]} ${CROSS_TEXT[l.color]} relative overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
            >
              <div className="font-mono text-[10px] tracking-[0.15em] opacity-60">
                {l.vol}
              </div>
              <div className="mt-4 font-display font-medium text-[24px] leading-[1.1]">
                {l.title}
              </div>
              <div className="mt-1 font-display italic text-[16px] opacity-80">
                {l.emphasis}
              </div>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.15em] opacity-70 inline-flex items-center gap-2">
                Open volume →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
