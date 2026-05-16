"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { RollingDoorCurtain } from "@/components/rolling-door-curtain";
import { AccountingLedgerCurtain } from "@/components/transitions/capital-markets";
import { ChalkboardCurtain } from "@/components/transitions/education";
import {
  XRayLightboxCurtain,
  PrivacyScreenCurtain,
} from "@/components/transitions/healthcare";
import { TheaterCurtainsCurtain } from "@/components/transitions/media";
import type { CurtainVariant } from "@/components/curtain-link";

type CurtainDetail = {
  href: string;
  accent?: string;
  label?: string;
  variant?: CurtainVariant;
};

type Timing = { cover: number; navAt: number; hold: number; uncover: number };

const TIMING: Record<CurtainVariant, Timing> = {
  default:             { cover: 500, navAt: 420, hold: 280, uncover: 500 },
  "rolling-door":      { cover: 650, navAt: 540, hold: 420, uncover: 950 },
  "accounting-ledger": { cover: 700, navAt: 580, hold: 450, uncover: 900 },
  "chalkboard":        { cover: 550, navAt: 460, hold: 800, uncover: 550 },
  "xray-lightbox":     { cover: 600, navAt: 500, hold: 700, uncover: 650 },
  "privacy-screen":    { cover: 650, navAt: 540, hold: 500, uncover: 650 },
  "theater-curtains":  { cover: 750, navAt: 620, hold: 450, uncover: 800 },
};

export function PageCurtain() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "covering" | "uncovering">("idle");
  const [accent, setAccent] = useState("#7A4FD9");
  const [label, setLabel] = useState("Opening volume");
  const [variant, setVariant] = useState<CurtainVariant>("default");

  const handleNavigate = useCallback(
    (e: Event) => {
      const ev = e as CustomEvent<CurtainDetail>;
      const { href, accent: a = "#7A4FD9", label: l, variant: v = "default" } = ev.detail ?? { href: "/" };
      if (!href) return;

      const t = TIMING[v];
      setAccent(a);
      setLabel(l ?? "Opening volume");
      setVariant(v);
      setPhase("covering");

      const navTimer = window.setTimeout(() => {
        router.push(href);
      }, t.navAt);

      const uncoverTimer = window.setTimeout(() => {
        setPhase("uncovering");
      }, t.cover + t.hold);

      const idleTimer = window.setTimeout(() => {
        setPhase("idle");
      }, t.cover + t.hold + t.uncover);

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
  const t = TIMING[variant];
  const activePhase = phase as "covering" | "uncovering";

  return (
    <AnimatePresence>
      {visible && variant === "rolling-door" && (
        <RollingDoorCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "accounting-ledger" && (
        <AccountingLedgerCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "chalkboard" && (
        <ChalkboardCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "xray-lightbox" && (
        <XRayLightboxCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "privacy-screen" && (
        <PrivacyScreenCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "theater-curtains" && (
        <TheaterCurtainsCurtain phase={activePhase} coverMs={t.cover} uncoverMs={t.uncover} />
      )}
      {visible && variant === "default" && (
        <motion.div
          key="page-curtain"
          initial={{ y: "100%" }}
          animate={{ y: activePhase === "covering" ? "0%" : "-100%" }}
          transition={{
            duration: activePhase === "covering" ? t.cover / 1000 : t.uncover / 1000,
            ease: [0.65, 0, 0.35, 1],
          }}
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ backgroundColor: accent }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: activePhase === "covering" ? 1 : 0, y: 0 }}
              transition={{ delay: activePhase === "covering" ? 0.15 : 0, duration: 0.3 }}
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
