import { ledgers, operators } from "@/lib/content";

const OP_ICONS: Record<string, { src: string; invert: boolean }> = {
  "Grand Canyon University": { src: "/icons/sunglasses.svg", invert: true },
  "Storage Portfolio": { src: "/icons/real-estate.png", invert: false },
  "Martone Datacenter": { src: "/icons/dock.svg", invert: true },
  "Neuro Brand Hub": { src: "/icons/coffee-mug.svg", invert: true },
  "K–12 Platform": { src: "/icons/mustache.svg", invert: true },
  "Family Advisory": { src: "/icons/chairs.svg", invert: true },
};

const SWATCH: Record<string, string> = {
  "capital-markets": "#7A4FD9",
  "real-estate": "#D9A441",
  education: "#2F8F8F",
  healthcare: "#C44060",
  "media-consumer": "#ECE7DC",
};

const CATEGORY_SWATCH: Record<string, string> = {
  "Capital Markets": "#7A4FD9",
  "Real Estate": "#D9A441",
  Education: "#2F8F8F",
  Healthcare: "#C44060",
  "Media & Consumer": "#ECE7DC",
};

const categories = ledgers.filter((l) => l.slug !== "letters");

const stats = [
  { num: "900", label: "Students at acquisition · 2003" },
  { num: "#1", label: "Private Christian University · at exit" },
  { num: "2017", label: "Lopes Capital founded" },
  { num: "5", label: "Operating categories · today" },
];

export function SignatureBody() {
  return (
    <>
      <section id="origin" className="relative z-[1] px-6 md:px-10 py-32">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#7A4FD9] mb-8">
          01 / Origin
        </div>
        <h2 className="font-medium text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.02em] max-w-[22ch] mb-10">
          We were <em className="not-italic text-[#7A4FD9]">operators</em> before we were investors. We still are.
        </h2>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start pt-24 mt-20 border-t border-white/[0.08]">
          <div>
            <p className="text-[18px] leading-[1.55] max-w-[60ch] text-white/75">
              In 2003 our principals bought Grand Canyon University &mdash; 900 students, weeks from foreclosure. We rebuilt it into the largest private Christian university in the United States. Lopes Capital is what happened after.
            </p>
            <p className="text-[18px] leading-[1.55] max-w-[60ch] text-white/75 mt-6">
              Today we deploy capital across five operating categories. Every check is informed by what we learned running the business ourselves.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:mt-12">
            {stats.map((s) => (
              <div key={s.num}>
                <div className="text-[56px] font-normal leading-none tracking-[-0.03em] text-[#7A4FD9]">{s.num}</div>
                <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/55 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="relative z-[1] px-6 md:px-10 pt-10 pb-32">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#7A4FD9] mb-8">
          02 / Operating Categories
        </div>
        <h2 className="font-medium text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.02em] max-w-[22ch] mb-10">
          Five lanes. <em className="not-italic text-[#7A4FD9]">One operator&rsquo;s POV in each.</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08] mt-12">
          {categories.map((cat, i) => (
            <div
              key={cat.slug}
              className="bg-[#0E0E14] p-8 pt-9 relative transition-colors duration-200 hover:bg-[#14141C] min-h-[280px] flex flex-col"
            >
              <div className="absolute top-5 right-6 font-mono text-[10px] tracking-[0.15em] text-white/40">
                {String(i + 1).padStart(2, "0")}
              </div>
              <span
                className="block w-3.5 h-3.5 mb-6"
                style={{ background: SWATCH[cat.slug] }}
              />
              <div className="text-[22px] font-medium tracking-[-0.01em] mb-3">{cat.title}</div>
              <div className="text-[13px] leading-[1.5] text-white/55 flex-1">{cat.body}</div>
              <div className="flex flex-wrap gap-1.5 mt-5">
                {cat.positions.slice(0, 3).map((p) => (
                  <span key={p} className="font-mono text-[10px] px-2 py-[3px] border border-white/[0.12] text-white/55">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="operators" className="relative z-[1] px-6 md:px-10 py-32">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#7A4FD9] mb-8">
          03 / Operators
        </div>
        <h2 className="font-medium text-[clamp(28px,4vw,48px)] leading-[1.05] tracking-[-0.02em] max-w-[22ch] mb-10">
          A few we&rsquo;ve <em className="not-italic text-[#7A4FD9]">built</em>, <em className="not-italic text-[#7A4FD9]">bought</em>, or <em className="not-italic text-[#7A4FD9]">backed</em>.
        </h2>
        <p className="text-[18px] leading-[1.55] max-w-[60ch] text-white/75">
          Numbered as they came into the portfolio. Active and historic positions both shown. Names redacted where appropriate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08] mt-12">
          {operators.map((op) => {
            const icon = OP_ICONS[op.name];
            return (
              <div
                key={op.num + op.name}
                className="bg-[#0E0E14] p-7 flex flex-col gap-4 transition-colors duration-200 hover:bg-[#14141C]"
              >
                {icon ? (
                  <div className="w-10 h-10 flex items-center justify-center opacity-85">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={icon.src}
                      alt=""
                      className="w-full h-full object-contain"
                      style={icon.invert ? { filter: "invert(1) opacity(0.85)" } : undefined}
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10"
                    style={{
                      background: CATEGORY_SWATCH[op.category] ?? "#7A4FD9",
                      opacity: 0.5,
                    }}
                  />
                )}
                <div className="font-mono text-[10px] tracking-[0.15em] text-white/40">{op.num}</div>
                <div className="text-[17px] font-medium tracking-[-0.01em]">{op.name}</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/50">
                  {op.category.toUpperCase()} · {op.era}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer
        id="contact"
        className="relative z-[1] px-6 md:px-10 pt-20 pb-20 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        <div>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/antelope-mark.png" alt="Lopes Capital" className="w-14 h-auto" />
            <div>
              <b className="block text-[18px] tracking-[0.04em] font-medium">LOPES CAPITAL</b>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/50">
                Discover · Develop · Deliver · Disrupt
              </span>
            </div>
          </div>
          <p className="text-[14px] leading-[1.7] text-white/75 mt-6">
            A multi-family office focused on direct investments and operational support across education, healthcare, real estate, and adjacent platforms.
          </p>
        </div>
        <div>
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/50 mb-4">Contact</div>
          <div className="text-[14px] leading-[1.7] text-white/75">contact@lopescapital.com</div>
          <div className="text-[14px] leading-[1.7] text-white/75">Scottsdale, AZ</div>
        </div>
        <div>
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/50 mb-4">Inquiries</div>
          <div className="text-[14px] leading-[1.7] text-white/75">Operator partnerships</div>
          <div className="text-[14px] leading-[1.7] text-white/75">Co-investment</div>
          <div className="text-[14px] leading-[1.7] text-white/75">Press</div>
        </div>
        <div className="md:col-span-3 pt-8 mt-4 border-t border-white/[0.04] flex justify-between font-mono text-[10px] tracking-[0.1em] uppercase text-white/40">
          <span>&copy; 2026 Lopes Capital LLC</span>
          <span>Signature direction · Y-N10</span>
        </div>
      </footer>
    </>
  );
}
