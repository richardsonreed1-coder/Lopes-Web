import { type Pillar, pillars } from "@/lib/content";
import { CurtainLink } from "@/components/curtain-link";

/** Per-pillar accents. Like the sectors, each pillar carries a stable dark
 *  curtain accent (navigation transitions) and a brighter display accent
 *  (on-page numerals, dots, glows) — intentionally different; don't collapse. */
const PILLAR_ACCENTS: Record<string, { curtain: string; display: string }> = {
  discover: { curtain: "#5028A0", display: "#A988F5" },
  develop:  { curtain: "#6E2E18", display: "#D97757" },
  deliver:  { curtain: "#8C6A2A", display: "#E5A52B" },
  disrupt:  { curtain: "#5028A0", display: "#E64A58" },
};

/** Capitalize first letter; split off the last word as the italic accent.
 *  e.g. "Where signal becomes thesis." → ["Where signal becomes", "thesis."] */
function splitHeadline(emphasis: string): [string, string] {
  const words = emphasis.trim().split(/\s+/);
  const last = words.pop() ?? "";
  const lead = words.join(" ");
  const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  return [cap(lead), last];
}

export function PillarPage({ pillar }: { pillar: Pillar }) {
  const others = pillars.filter((p) => p.slug !== pillar.slug);
  const { display: accent } =
    PILLAR_ACCENTS[pillar.slug] ?? PILLAR_ACCENTS.discover;
  const [leadTitle, accentTitle] = splitHeadline(pillar.emphasis);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink font-sans text-paper selection:bg-paper/10">
      {/* atmospheric blur spots, subtly tinted by the pillar accent */}
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
        <nav className="grid grid-cols-2 items-center px-8 py-6 md:grid-cols-3 md:px-12">
          <CurtainLink
            href="/"
            accent="#7A4FD9"
            label="Returning to hub"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/65 transition-colors hover:text-paper"
          >
            ← Back to hub
          </CurtainLink>
          <div className="text-right font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55 md:text-center">
            lopes capital <span style={{ color: accent }}>PR.{pillar.numeral}</span>
          </div>
          <div className="hidden items-center justify-end gap-5 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55 md:flex">
            {pillars.map((p) => (
              <CurtainLink
                key={p.slug}
                href={`/${p.slug}`}
                accent={PILLAR_ACCENTS[p.slug]?.curtain ?? "#5028A0"}
                label={`Opening ${p.word.toLowerCase()}`}
                className={`transition-colors hover:text-paper ${
                  p.slug === pillar.slug ? "text-paper" : ""
                }`}
              >
                {p.word}
              </CurtainLink>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section className="relative px-8 pt-12 pb-16 md:px-12 md:pt-20 md:pb-24">
          {/* ghosted numeral behind the headline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 select-none font-display italic leading-none md:block"
            style={{ color: accent, opacity: 0.07, fontSize: "clamp(220px,26vw,360px)" }}
          >
            {pillar.numeral}
          </div>
          <div className="mx-auto max-w-[1200px]">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em]">
              <span style={{ color: accent }}>Principle · {pillar.numeral} of IV</span>
              <span className="text-paper/45"> · {pillar.word}</span>
            </div>

            <h1 className="mt-7 max-w-[16ch] font-display text-[clamp(48px,7.5vw,110px)] font-normal leading-[0.95] tracking-[-0.025em] text-paper">
              {leadTitle}{" "}
              <em className="italic font-medium" style={{ color: accent }}>
                {accentTitle}
              </em>
            </h1>

            <p className="mt-9 max-w-[62ch] font-sans text-[17px] leading-[1.65] text-paper-dim md:text-[18px]">
              {pillar.body}
            </p>
          </div>
        </section>

        {/* NOTES — three glassy cards */}
        <section className="border-t border-paper/10 px-8 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
              How it works
            </div>
            <h2 className="mt-5 font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
              Three operating notes.
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {pillar.principles.map((p) => (
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
                    {p.label} · Note
                  </div>
                  <h3 className="mt-3 font-display text-[24px] font-medium leading-[1.15] tracking-tight text-paper">
                    {p.title}
                  </h3>
                  <p className="mt-4 font-sans text-[14.5px] leading-[1.6] text-paper-dim">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OTHER PRINCIPLES */}
        <section className="border-t border-paper/10 px-8 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">
              The other three D&apos;s
            </div>
            <h2 className="mt-5 font-display text-[clamp(28px,3.5vw,40px)] font-normal italic leading-[1.1] tracking-[-0.015em] text-paper">
              Read the rest of the file.
            </h2>
            <div className="mt-10 divide-y divide-paper/5 overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.02] backdrop-blur-md">
              {others.map((p) => {
                const oAccent = PILLAR_ACCENTS[p.slug]?.display ?? "#A988F5";
                return (
                  <CurtainLink
                    key={p.slug}
                    href={`/${p.slug}`}
                    accent={PILLAR_ACCENTS[p.slug]?.curtain ?? "#5028A0"}
                    label={`Opening ${p.word.toLowerCase()}`}
                    className="group grid grid-cols-[80px_1fr_auto] items-center gap-6 px-6 py-5 transition-colors hover:bg-paper/[0.04]"
                  >
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.25em]"
                      style={{ color: oAccent }}
                    >
                      PR.{p.numeral}
                    </span>
                    <span>
                      <span className="font-display text-[22px] font-medium tracking-tight text-paper">
                        {p.word}
                      </span>
                      <span className="ml-3 font-display text-[14px] italic text-paper/55">
                        — {p.emphasis}
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
            <span>Lopes Capital</span>
            <CurtainLink
              href="/"
              accent="#7A4FD9"
              label="Returning to hub"
              className="transition-colors hover:text-paper"
            >
              ← Back to hub
            </CurtainLink>
          </div>
        </footer>
      </div>
    </div>
  );
}
