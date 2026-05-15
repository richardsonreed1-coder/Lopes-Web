"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

type CurtainDetail = { href: string; accent?: string; label?: string };

// Total = COVER + HOLD + UNCOVER. Tuned for a tight, fluid feel.
const COVER_MS = 500;   // slide-in
const NAV_AT_MS = 420;  // dispatch router.push slightly before fully covered
const HOLD_MS = 280;    // dwell after navigation for the new page to settle
const UNCOVER_MS = 500; // slide-out

/**
 * Persistent curtain that lives in the root layout. Pages dispatch a
 * "lopes:navigate" custom event with { href, accent, label } and this
 * component runs the slide-up cover, performs the route push under the
 * cover, then slides the curtain off-screen — surviving the navigation
 * because it isn't part of the page being unmounted.
 */
export function PageCurtain() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "covering" | "uncovering">("idle");
  const [accent, setAccent] = useState("#7A4FD9");
  const [label, setLabel] = useState("Opening volume");

  const handleNavigate = useCallback(
    (e: Event) => {
      const ev = e as CustomEvent<CurtainDetail>;
      const { href, accent: a = "#7A4FD9", label: l } = ev.detail ?? { href: "/" };
      if (!href) return;

      setAccent(a);
      setLabel(l ?? "Opening volume");
      setPhase("covering");

      // navigate while the curtain is almost fully covering
      const navTimer = window.setTimeout(() => {
        router.push(href);
      }, NAV_AT_MS);

      // hold under the curtain so the new page can hydrate, then uncover
      const uncoverTimer = window.setTimeout(() => {
        setPhase("uncovering");
      }, COVER_MS + HOLD_MS);

      // reset to idle after the uncover animation finishes
      const idleTimer = window.setTimeout(() => {
        setPhase("idle");
      }, COVER_MS + HOLD_MS + UNCOVER_MS);

      return () => {
        clearTimeout(navTimer);
        clearTimeout(uncoverTimer);
        clearTimeout(idleTimer);
      };
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener("lopes:navigate", handleNavigate as EventListener);
    return () => {
      window.removeEventListener("lopes:navigate", handleNavigate as EventListener);
    };
  }, [handleNavigate]);

  const visible = phase !== "idle";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-curtain"
          initial={{ y: "100%" }}
          animate={{ y: phase === "covering" ? "0%" : "-100%" }}
          transition={{
            duration: phase === "covering" ? COVER_MS / 1000 : UNCOVER_MS / 1000,
            ease: [0.65, 0, 0.35, 1],
          }}
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ backgroundColor: accent }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase === "covering" ? 1 : 0, y: 0 }}
              transition={{ delay: phase === "covering" ? 0.15 : 0, duration: 0.3 }}
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/85"
            >
              {label}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
