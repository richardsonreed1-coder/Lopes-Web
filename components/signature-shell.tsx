"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConfettiBg } from "@/components/confetti-bg";

type Variant = { slug: string; label: string; family: "main" | "mark" | "hollow" };

const VARIANTS: Variant[] = [
  { slug: "/", label: "A · Baseline", family: "main" },
  { slug: "/restrained", label: "B · Restrained", family: "main" },
  { slug: "/tetris", label: "C · Tetris", family: "main" },
  { slug: "/mark", label: "D · Mark", family: "main" },
  { slug: "/mark/curved", label: "D1 · Curved", family: "mark" },
  { slug: "/mark/crest", label: "D2 · Crest", family: "mark" },
  { slug: "/mark/hollow", label: "D3 · Hollow", family: "mark" },
  { slug: "/mark/hollow/thin", label: "D3a · Thin", family: "hollow" },
  { slug: "/mark/hollow/dot", label: "D3b · Dot", family: "hollow" },
  { slug: "/mark/hollow/flicker", label: "D3c · Flicker", family: "hollow" },
];

export function SignatureShell({
  children,
  withConfetti = true,
}: {
  children: React.ReactNode;
  withConfetti?: boolean;
}) {
  const pathname = usePathname();
  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-[#ECE7DC]"
      style={{
        background: "#050507",
        fontFamily: "var(--font-grotesk), system-ui, sans-serif",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {withConfetti && <ConfettiBg />}

      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-6 font-mono text-[12px] tracking-[0.08em]"
        style={{ mixBlendMode: "difference", color: "#fff" }}
      >
        <div>
          <b style={{ color: "#7A4FD9" }}>LOPES</b> CAPITAL · SINCE 2017
        </div>
        <div className="hidden md:flex gap-6">
          <a href="#operators" className="opacity-70 hover:opacity-100 transition-opacity">Operators</a>
          <a href="#origin" className="opacity-70 hover:opacity-100 transition-opacity">Origin</a>
          <a href="#categories" className="opacity-70 hover:opacity-100 transition-opacity">Categories</a>
          <a href="#contact" className="opacity-70 hover:opacity-100 transition-opacity">Contact</a>
        </div>
      </nav>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex items-stretch gap-1 px-1.5 py-1 border border-white/[0.14] bg-black/70 backdrop-blur-sm font-mono text-[10px] tracking-[0.1em] uppercase max-w-[calc(100vw-2rem)] overflow-x-auto">
        {VARIANTS.map((v, i) => {
          const active = v.slug === pathname;
          const prev = VARIANTS[i - 1];
          const showSeparator = prev && prev.family !== v.family;
          return (
            <div key={v.slug} className="flex items-stretch gap-1">
              {showSeparator && (
                <div className="self-stretch w-px bg-white/[0.18] mx-1" />
              )}
              <Link
                href={v.slug}
                className={`px-2.5 py-1.5 transition-colors whitespace-nowrap ${
                  active
                    ? "bg-[#7A4FD9] text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {v.label}
              </Link>
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}
