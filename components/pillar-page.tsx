import { type Pillar, pillars } from "@/lib/content";
import { CurtainLink } from "@/components/curtain-link";

export function PillarPage({ pillar }: { pillar: Pillar }) {
  const others = pillars.filter((p) => p.slug !== pillar.slug);
  const idx = pillars.findIndex((p) => p.slug === pillar.slug) + 1;

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink font-mono text-paper">
      {/* dot grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(244,239,227,0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* watermark */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden items-center justify-end pr-6 md:flex">
        <span className="-rotate-90 font-mono text-[11px] uppercase tracking-[0.6em] text-paper/20">
          Lopes · Operating Principle · {pillar.word}
        </span>
      </div>

      <div className="relative z-10">
        {/* CLASSIFIED STRIP */}
        <header className="border-b border-rule px-6 py-4 md:px-10">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between">
            <CurtainLink
              href="/"
              accent="#7A4FD9"
              label="Returning to hub"
              className="text-[10px] uppercase tracking-[0.25em] text-paper-mute transition-colors hover:text-paper"
            >
              ← Lopes Capital
            </CurtainLink>
            <div className="hidden items-center gap-6 text-[10px] uppercase tracking-[0.25em] text-paper-mute md:flex">
              {pillars.map((p) => (
                <CurtainLink
                  key={p.slug}
                  href={`/${p.slug}`}
                  accent="#5028A0"
                  label={`Opening ${p.word.toLowerCase()}`}
                  className={`transition-colors hover:text-paper ${
                    p.slug === pillar.slug ? "text-paper" : ""
                  }`}
                >
                  {p.word}
                </CurtainLink>
              ))}
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-paper-mute">
              Principle · {String(idx).padStart(2, "0")} / 04
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="border-b border-rule px-6 py-14 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
              [ Operating principle · {pillar.numeral} of IV ]
            </div>

            <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-[auto_1fr] md:items-end">
              <div className="font-display text-[clamp(140px,22vw,280px)] font-medium italic leading-[0.82] tracking-[-0.04em] text-paper">
                {pillar.numeral}
              </div>
              <div>
                <h1 className="font-display text-[clamp(48px,7vw,96px)] font-normal leading-[0.95] tracking-[-0.025em] text-paper">
                  {pillar.word}.
                </h1>
                <div className="mt-3 font-display text-[clamp(20px,2.3vw,28px)] italic text-paper/65">
                  — {pillar.emphasis}
                </div>
                <p className="mt-7 max-w-[60ch] font-sans text-[16px] leading-[1.65] text-paper-dim">
                  {pillar.body}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRINCIPLES — stacked rows */}
        <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
              §02 · How it works
            </div>
            <h2 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-normal leading-[1] tracking-[-0.015em] text-paper">
              Three operating notes.
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
              {pillar.principles.map((p) => (
                <div
                  key={p.label}
                  className="bg-ink-2 p-7 shadow-[inset_0_1px_0_rgba(244,239,227,0.05)]"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute">
                    {p.label} · note
                  </div>
                  <h3 className="mt-5 font-display text-[24px] font-medium leading-[1.15] tracking-tight text-paper">
                    {p.title}
                  </h3>
                  <p className="mt-3 font-sans text-[14px] leading-[1.6] text-paper-dim">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OTHER PRINCIPLES */}
        <section className="border-b border-rule px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
              §03 · The other three D&apos;s
            </div>
            <h2 className="mt-5 font-display text-[clamp(32px,4.5vw,48px)] font-normal leading-[1] tracking-[-0.015em] text-paper">
              Read the rest of the file.
            </h2>
            <div className="mt-10 divide-y divide-rule-soft rounded-sm border border-rule bg-ink-2">
              {others.map((p) => (
                <CurtainLink
                  key={p.slug}
                  href={`/${p.slug}`}
                  accent="#5028A0"
                  label={`Opening ${p.word.toLowerCase()}`}
                  className="group grid grid-cols-[80px_1fr_auto] items-center gap-6 px-5 py-5 transition-colors hover:bg-ink"
                >
                  <span className="font-display text-[20px] italic text-paper/65">
                    {p.numeral}
                  </span>
                  <span>
                    <span className="font-display text-[20px] font-medium tracking-tight text-paper">
                      {p.word.toLowerCase()}
                      <span className="text-paper-mute">.principle</span>
                    </span>
                    <span className="ml-3 font-display italic text-[14px] text-paper/55">
                      — {p.emphasis}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-paper">
                    Open →
                  </span>
                </CurtainLink>
              ))}
            </div>
          </div>
        </section>

        <footer className="px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-paper-mute md:flex-row md:items-center">
            <span>Lopes Capital · Internal Distribution Only</span>
            <span>
              File hash · 0x{pillar.word.toUpperCase().slice(0, 6)}-{pillar.numeral}
            </span>
            <CurtainLink href="/" accent="#7A4FD9" label="Returning to hub" className="transition-colors hover:text-paper">
              ← Lopes Capital
            </CurtainLink>
          </div>
        </footer>
      </div>
    </div>
  );
}
