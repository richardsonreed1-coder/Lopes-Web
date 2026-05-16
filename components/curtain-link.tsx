"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type CurtainVariant =
  | "default"
  | "rolling-door"
  | "accounting-ledger"
  | "chalkboard"
  | "xray-lightbox"
  | "privacy-screen"
  | "theater-curtains";

type Props = {
  href: string;
  accent?: string;
  label?: string;
  /** Choose the curtain visual that plays during this navigation. */
  variant?: CurtainVariant;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
};

/**
 * Drop-in replacement for <Link> that fires the global PageCurtain
 * transition (from app/layout.tsx) before the route change happens.
 */
export function CurtainLink({
  href,
  accent = "#7A4FD9",
  label,
  variant = "default",
  className,
  ariaLabel,
  children,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (href && !href.startsWith("#") && !href.startsWith("/#")) {
      router.prefetch(href);
    }
  }, [router, href]);

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("lopes:navigate", {
            detail: { href, accent, label, variant },
          })
        );
      }}
    >
      {children}
    </Link>
  );
}
