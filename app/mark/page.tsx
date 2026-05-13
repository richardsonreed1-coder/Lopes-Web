import { SignatureShell } from "@/components/signature-shell";
import { SignatureBody } from "@/components/signature-body";
import { HeroMeta } from "@/components/hero-meta";
import { PixelRevealMark } from "@/components/pixel-reveal-mark";

export default function MarkPage() {
  return (
    <SignatureShell withConfetti={false}>
      <section className="relative z-[1] min-h-screen flex items-center justify-center px-6 pt-32 pb-40">
        <div className="relative" style={{ width: "min(720px, 92vw)", aspectRatio: "4 / 5" }}>
          
          <PixelRevealMark />
          <HeroMeta />
        </div>
      </section>
      <SignatureBody />
    </SignatureShell>
  );
}
