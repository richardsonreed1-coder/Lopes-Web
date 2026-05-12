"use client";

import { useState } from "react";
import { PixelIntro } from "@/components/pixel-intro";
import { TopNav } from "@/components/top-nav";
import { SideRail } from "@/components/side-rail";
import { LedgerStack } from "@/components/ledger-stack";
import { SiteFooter } from "@/components/site-footer";
import { epochs, letters } from "@/lib/content";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <PixelIntro onComplete={() => setIntroDone(true)} />}

      <TopNav />
      <SideRail />

      <div className="hidden md:block fixed bottom-6 left-6 z-40 font-mono text-[11px] text-paper-faint">
        SCOTTSDALE · AZ
      </div>

      <main className="relative">
        {/* HERO — LEDGER STACK */}
        <section
          id="categories"
          className="min-h-screen flex items-center justify-center px-6 md:px-10 pt-32 pb-24 relative"
        >
          <LedgerStack />
          <div className="absolute left-6 md:left-10 right-6 md:right-10 bottom-10 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4 font-mono text-[11px] text-paper-mute uppercase tracking-[0.1em]">
            <span className="font-sans italic normal-case tracking-normal text-[13px] text-paper-dim max-w-[34ch] leading-[1.5]">
              A Scottsdale multi-family office. Operator-built. Capital-deployed.
              Six volumes, one ledger.
            </span>
            <span>EST. 2017 · SCOTTSDALE</span>
          </div>
        </section>

        {/* THESIS — GCU PROMOTED */}
        <section
          id="thesis"
          className="px-6 md:px-10 py-32 md:py-40 max-w-[920px] mx-auto"
        >
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-purple-2 mb-8">
            01 / Thesis
          </div>
          <h2 className="font-display font-normal text-[clamp(36px,5.5vw,64px)] leading-[1.05] tracking-[-0.02em] mb-10">
            We were <em className="italic text-purple-2 font-medium">operators</em>{" "}
            before we were investors.{" "}
            <em className="italic text-purple-2 font-medium">We still are.</em>
          </h2>
          <p className="font-sans text-[19px] leading-[1.6] max-w-[62ch] text-paper-dim">
            In 2003 our principals bought Grand Canyon University. Nine hundred
            students. Weeks from foreclosure. We rebuilt it into the largest
            private Christian university in the country.
          </p>
          <p className="font-sans text-[19px] leading-[1.6] max-w-[62ch] text-paper-dim mt-6">
            Lopes Capital is what happened after. We deploy capital the way we
            ran the school — pencil-down, owner-mind, no PowerPoint between us
            and the asset. The LPs we work with care less about the deck than
            the call after the deal closes. We agree.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule mt-12">
            {epochs.map((e) => (
              <div key={e.year + e.label} className="bg-ink p-7">
                <div className="font-display font-normal text-[32px] text-purple-2 leading-none mb-2">
                  {e.year}
                </div>
                <div className="font-sans text-[13px] leading-[1.4] text-paper-dim">
                  {e.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LETTERS */}
        <section
          id="letters"
          className="px-6 md:px-10 py-24 md:py-32 max-w-[920px] mx-auto"
        >
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-purple-2 mb-8">
            02 / Letters
          </div>
          <h2 className="font-display font-normal text-[clamp(36px,5.5vw,64px)] leading-[1.05] tracking-[-0.02em] mb-10">
            Annual notes,{" "}
            <em className="italic text-purple-2 font-medium">on the record</em>.
          </h2>
          <p className="font-sans text-[19px] leading-[1.6] max-w-[62ch] text-paper-dim">
            One letter a year. Signed. What we believed, what we did, what we
            got wrong.
          </p>

          <div className="mt-12 border-t border-rule">
            {letters.map((l) => (
              <div
                key={l.year + l.title}
                className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[80px_1fr_auto] gap-6 md:gap-8 py-5 border-b border-rule items-baseline cursor-pointer transition-[padding] duration-200 hover:pl-3"
              >
                <div className="font-mono text-[12px] text-paper-mute">
                  {l.year}
                </div>
                <div className="font-display font-medium text-[17px] md:text-[20px] leading-[1.25]">
                  {l.title}
                  {l.emphasis && (
                    <>
                      {" "}
                      <em className="italic text-purple-2 font-normal">
                        {l.emphasis}
                      </em>
                    </>
                  )}
                </div>
                <div className="font-mono text-[11px] text-paper-faint uppercase tracking-[0.1em] whitespace-nowrap">
                  {l.length}
                </div>
              </div>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
