"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  href: string;
  accent?: string;
  label?: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
};

/**
 * Drop-in replacement for <Link> that fires the global PageCurtain
 * transition (from app/layout.tsx) before the route change happens.
 * Use this for any navigation that should feel like a portal — hub
 * tiles, "← Back to hub" links, sector cross-links.
 *
 * Falls back to a normal Link if the curtain isn't mounted (e.g.
 * old browsers without CustomEvent — extremely unlikely now).
 */
export function CurtainLink({
  href,
  accent = "#7A4FD9",
  label,
  className,
  ariaLabel,
  children,
}: Props) {
  const router = useRouter();

  // Prefetch on mount so the navigation under the curtain is instant.
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
        // Allow modifier-click / middle-click to keep default behavior
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("lopes:navigate", {
            detail: { href, accent, label },
          })
        );
      }}
    >
      {children}
    </Link>
  );
}
