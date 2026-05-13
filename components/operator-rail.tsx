import { operators } from "@/lib/content";
import { TiltCard } from "@/components/tilt-card";

export function OperatorRail() {
  return (
    <section
      id="operators"
      className="bg-ink border-t border-rule-soft shadow-[inset_0_1px_0_rgba(244,239,227,0.04)]"
    >
      <div className="px-6 md:px-10 py-24 md:py-32 max-w-[1100px] mx-auto">
      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-purple-2 mb-8">
        02 / Operators
      </div>
      <h2 className="font-display font-normal text-[clamp(36px,5.5vw,64px)] leading-[1.05] tracking-[-0.02em] mb-10">
        A few we&rsquo;ve{" "}
        <em className="italic text-purple-2 font-medium">built</em>,{" "}
        <em className="italic text-purple-2 font-medium">bought</em>, or{" "}
        <em className="italic text-purple-2 font-medium">backed</em>.
      </h2>
      <p className="font-sans text-[19px] leading-[1.6] max-w-[62ch] text-paper-dim">
        Numbered as they came into the portfolio. Active and historic positions
        both shown. Names redacted where appropriate.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule mt-12">
        {operators.map((op) => (
          <TiltCard
            key={op.num + op.name}
            tiltLimit={10}
            scale={1.03}
            perspective={1400}
            effect="evade"
            spotlight
            className="bg-ink p-6 md:p-7 flex flex-col gap-3 shadow-[inset_0_1px_0_rgba(244,239,227,0.06),inset_0_-16px_24px_-16px_rgba(0,0,0,0.55)]"
          >
            <div className="font-mono text-[10px] tracking-[0.15em] text-paper-faint">
              {op.num}
            </div>
            <div className="font-display font-medium text-[19px] leading-[1.15] tracking-tight">
              {op.name}
            </div>
            <div className="mt-auto pt-4 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-paper-mute">
              <span>{op.category}</span>
              <span className="text-paper-faint">{op.era}</span>
            </div>
          </TiltCard>
        ))}
      </div>
      </div>
    </section>
  );
}
