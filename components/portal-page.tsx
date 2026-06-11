import { CurtainLink } from "@/components/curtain-link";
import { PortalForm, type PortalField } from "@/components/portal-form";

/**
 * PortalPage — shared chrome for the two intake portals (/apply, /submit).
 * Mirrors the interior "classified file" language: strip header, dot grid,
 * rotated watermark, mono eyebrows, Fraunces headline.
 */
export function PortalPage({
  eyebrow,
  title,
  emphasis,
  body,
  watermark,
  endpoint,
  fields,
  submitLabel,
  receivedNote,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  emphasis: string;
  body: string;
  watermark: string;
  endpoint: string;
  fields: PortalField[];
  submitLabel: string;
  receivedNote: string;
  aside: { label: string; value: string }[];
}) {
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
          {watermark}
        </span>
      </div>

      <div className="relative z-10">
        {/* STRIP */}
        <header className="border-b border-rule px-6 py-4 md:px-10">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between">
            <CurtainLink
              href="/"
              accent="#7A4FD9"
              label="Returning to hub"
              className="text-[10px] uppercase tracking-[0.25em] text-paper-mute transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-2 focus-visible:ring-offset-4 focus-visible:ring-offset-ink rounded-sm"
            >
              ← Lopes Capital
            </CurtainLink>
            <div className="text-[10px] uppercase tracking-[0.25em] text-paper-mute">
              {eyebrow}
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="border-b border-rule px-6 py-12 md:px-10 md:py-18">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
              [ {eyebrow} ]
            </div>
            <h1 className="mt-6 font-display text-[clamp(40px,6vw,80px)] font-normal leading-[0.95] tracking-[-0.025em] text-paper">
              {title}
            </h1>
            <div className="mt-3 font-display text-[clamp(18px,2.2vw,26px)] italic text-paper/65">
              — {emphasis}
            </div>
            <p className="mt-6 max-w-[58ch] font-sans text-[15px] leading-[1.65] text-paper-dim md:text-[16px]">
              {body}
            </p>
          </div>
        </section>

        {/* FORM + ASIDE */}
        <section className="px-6 py-12 md:px-10 md:py-16">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
            <PortalForm
              endpoint={endpoint}
              fields={fields}
              submitLabel={submitLabel}
              receivedNote={receivedNote}
            />
            <aside className="order-first lg:order-none">
              <div className="rounded-sm border border-rule bg-ink-2 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                  §00 · The fine print
                </div>
                <dl className="mt-5 space-y-5">
                  {aside.map((a) => (
                    <div key={a.label}>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-paper/40">
                        {a.label}
                      </dt>
                      <dd className="mt-1 font-sans text-[13px] leading-[1.55] text-paper-dim">
                        {a.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </section>

        <footer className="border-t border-rule px-6 py-8 md:px-10">
          <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-paper-mute md:flex-row md:items-center">
            <span>Lopes Capital · Scottsdale · Arizona</span>
            <CurtainLink
              href="/"
              accent="#7A4FD9"
              label="Returning to hub"
              className="transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-2 focus-visible:ring-offset-4 focus-visible:ring-offset-ink rounded-sm"
            >
              ← Back to the hub
            </CurtainLink>
          </div>
        </footer>
      </div>
    </div>
  );
}
