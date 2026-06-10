"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";

/**
 * BootOverlay — the home page's LOAD transition.
 *
 * On first paint it covers the screen with an obsidian "boot" panel
 * (wordmark + a hairline that fills like a loading bar), holds briefly,
 * then wipes up (scaleY from the top) to reveal the hub underneath.
 *
 * Design notes:
 *  - Matches the PageCurtain visual language so navigation + load feel
 *    like one system. Sits at z-[200], above PageCurtain's z-[100].
 *  - Fires once per tab session (sessionStorage) so repeat loads are instant.
 *  - prefers-reduced-motion -> quick fade, no wipe.
 *  - Click anywhere to skip straight to the reveal.
 *  - Always calls onComplete(), so the page reveal is never stranded.
 */
export function BootOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"boot" | "lift">("boot");
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect --
     Intentional: reduced-motion + sessionStorage "already booted" are browser-only
     reads that must run post-mount to stay hydration-safe. The mount-time state
     sync (and one-shot boot gating) is deliberate, not a cascading-render bug. */
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem("lopes:booted") === "1";
    } catch {
      alreadyBooted = false;
    }

    if (alreadyBooted) {
      setActive(false);
      onComplete();
      return;
    }

    try {
      sessionStorage.setItem("lopes:booted", "1");
    } catch {
      /* storage disabled — boot anyway */
    }

    const holdMs = prefersReduced ? 200 : 1150;
    const liftTimer = window.setTimeout(() => setPhase("lift"), holdMs);
    return () => window.clearTimeout(liftTimer);
  }, [onComplete]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const skip = () => setPhase("lift");

  // Finalize only after the LIFT animation finishes.
  const handleAnimationComplete = useCallback(() => {
    if (phase === "lift") {
      setActive(false);
      onComplete();
    }
  }, [phase, onComplete]);

  if (!active) return null;

  const lifting = phase === "lift";

  return (
    <motion.div
      onClick={skip}
      initial={{ y: "0%", opacity: 1 }}
      animate={{
        y: lifting && !reduced ? "-100%" : "0%",
        opacity: lifting && reduced ? 0 : 1,
      }}
      transition={{ duration: reduced ? 0.25 : 0.7, ease: [0.7, 0, 0.2, 1] }}
      onAnimationComplete={handleAnimationComplete}
      style={{ transformOrigin: "top" }}
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center bg-ink"
    >
      {/* faint perimeter — reads as a framed terminal, not a blank screen */}
      <div className="pointer-events-none absolute inset-4 border border-paper/8 md:inset-6" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.5em] text-paper md:text-xs">
          Lopes / Capital
        </div>

        {/* hairline "loader" */}
        <div className="relative mt-6 h-px w-44 overflow-hidden bg-paper/12 md:w-56">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: lifting ? 1 : 0.94 }}
            transition={{
              duration: reduced ? 0.2 : 1.0,
              ease: lifting ? "easeOut" : [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: "left", background: "var(--color-purple-2)" }}
            className="absolute inset-0"
          />
        </div>

        <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.4em] text-paper/45">
          Obsidian · Vol. IX
        </div>
      </motion.div>
    </motion.div>
  );
}
