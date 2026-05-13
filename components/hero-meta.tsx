export function HeroMeta() {
  return (
    <div className="absolute left-0 right-0 -bottom-32 grid grid-cols-1 md:grid-cols-3 items-end gap-6 font-mono text-[11px] tracking-[0.1em] uppercase text-white/55">
      <div
        className="text-[14px] leading-[1.4] max-w-[28ch] normal-case tracking-normal text-white/70"
        style={{ fontFamily: "var(--font-grotesk), sans-serif" }}
      >
        A Scottsdale multi-family office. Operator-built. Capital-deployed. Since 2017.
      </div>
      <a
        href="#origin"
        className="inline-flex items-center gap-4 px-6 py-3.5 border border-[#7A4FD9] text-[12px] tracking-[0.15em] uppercase text-[#ECE7DC] hover:bg-[#5028A0] hover:text-white transition-colors justify-self-center md:justify-self-auto"
      >
        <span>Enter</span>
        <span>→</span>
      </a>
      <div className="leading-[1.5] md:text-right">
        <b className="block text-[#ECE7DC] font-medium">EST. 2017</b>
        <span>SCOTTSDALE · ARIZONA</span>
      </div>
    </div>
  );
}
