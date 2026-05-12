import Image from "next/image";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-rule mt-20 px-6 md:px-10 pt-20 pb-10 grid grid-cols-1 md:[grid-template-columns:1.4fr_1fr_1fr] gap-10 md:gap-12"
    >
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Image
            src="/brand/antelope-mark.png"
            alt="Lopes Capital"
            width={56}
            height={56}
            className="object-contain"
          />
          <div>
            <div className="font-display font-medium text-[22px]">
              Lopes Capital
            </div>
            <div className="font-sans italic text-[12px] text-paper-mute">
              Discover. Develop. Deliver. Disrupt.
            </div>
          </div>
        </div>
        <p className="text-[14px] leading-[1.7] text-paper-dim mt-6 max-w-[42ch]">
          A Scottsdale multi-family office focused on direct investments and
          operational support across education, healthcare, real estate, and
          adjacent platforms. We were operators first. We still are.
        </p>
      </div>
      <div>
        <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-paper-mute mb-4">
          Contact
        </div>
        <div className="text-[14px] leading-[1.7] text-paper-dim">
          contact@lopescapital.com
        </div>
        <div className="text-[14px] leading-[1.7] text-paper-dim">
          Scottsdale, AZ
        </div>
      </div>
      <div>
        <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-paper-mute mb-4">
          Inquiries
        </div>
        <div className="text-[14px] leading-[1.7] text-paper-dim">
          Operator partnerships
        </div>
        <div className="text-[14px] leading-[1.7] text-paper-dim">
          Co-investment
        </div>
        <div className="text-[14px] leading-[1.7] text-paper-dim">Press</div>
      </div>
      <div className="md:col-span-3 pt-8 border-t border-rule-soft flex flex-col md:flex-row md:justify-between gap-2 font-mono text-[10px] tracking-[0.1em] text-paper-faint uppercase">
        <span>© {new Date().getFullYear()} Lopes Capital LLC</span>
        <span>Scottsdale · Arizona</span>
      </div>
    </footer>
  );
}
