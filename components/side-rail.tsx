"use client";

import { useEffect, useState } from "react";

const TICKS = 10;

export function SideRail() {
  const [lit, setLit] = useState(0);

  useEffect(() => {
    function tick() {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setLit(0);
        return;
      }
      const pct = Math.min(1, Math.max(0, window.scrollY / max));
      setLit(Math.round(pct * (TICKS - 1)));
    }
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  return (
    <aside
      className="hidden md:flex fixed left-[22px] top-0 bottom-0 flex-col justify-center gap-[10px] z-40"
      aria-hidden="true"
    >
      {Array.from({ length: TICKS }).map((_, i) => (
        <span
          key={i}
          className={`h-px transition-all duration-200 ${
            i <= lit ? "w-[22px] bg-purple-2" : "w-[14px] bg-paper-faint"
          }`}
        />
      ))}
    </aside>
  );
}
