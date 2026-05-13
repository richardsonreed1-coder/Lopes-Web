import { SignatureShell } from "@/components/signature-shell";
import { SignatureBody } from "@/components/signature-body";
import { HeroMeta } from "@/components/hero-meta";
import { PixelRevealTetris } from "@/components/pixel-reveal-tetris";

export default function TetrisPage() {
  return (
    <SignatureShell withConfetti={false}>
      <section className="relative z-[1] min-h-screen flex items-center justify-center px-6 pt-32 pb-40">
        <div className="relative" style={{ width: "min(900px, 92vw)", aspectRatio: "5 / 2.2" }}>
          
          <PixelRevealTetris />
          <HeroMeta />
        </div>
      </section>
      <SignatureBody />
    </SignatureShell>
  );
}
