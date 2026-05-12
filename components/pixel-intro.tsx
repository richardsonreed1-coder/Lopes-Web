"use client";

import { useEffect, useRef, useState } from "react";

const FONT: Record<string, string[]> = {
  L: ["1000", "1000", "1000", "1000", "1111"],
  O: ["0110", "1001", "1001", "1001", "0110"],
  P: ["1110", "1001", "1110", "1000", "1000"],
  E: ["1111", "1000", "1110", "1000", "1111"],
  S: ["0111", "1000", "0110", "0001", "1110"],
};

const FONT_SMALL: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["110", "001", "010", "100", "111"],
  "7": ["111", "001", "010", "010", "100"],
};

const PAPER = "#F4EFE3";
const PURPLE = "#7A4FD9";
const ACCENT_COLORS = ["#7A4FD9", "#5028A0", "#B98832", "#2E5E62", "#5F1F2C", "#4A5238"];

type Tile = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  c: string;
  phase: number;
  isConfetti?: boolean;
  drift?: { vx: number; vy: number };
};

export function PixelIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const cnv = canvasRef.current;
    if (!cnv) return;
    const context = cnv.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = cnv;
    const ctx: CanvasRenderingContext2D = context;

    let tiles: Tile[] = [];
    let raf = 0;
    const start = performance.now();

    function buildTiles(W: number, H: number) {
      tiles = [];
      const word = "LOPES";
      const rows = 5;
      const colsPer = 4;
      const gap = 1;
      const letterCols = colsPer * word.length + (word.length - 1) * gap;
      const tileSize = Math.min((W * 0.7) / letterCols, (H * 0.45) / rows);
      const totalW = letterCols * tileSize;
      const offsetX = (W - totalW) / 2;
      const offsetY = (H - rows * tileSize) / 2 - tileSize * 0.6;

      for (let li = 0; li < word.length; li++) {
        const ch = FONT[word[li]];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < colsPer; c++) {
            if (ch[r][c] === "1") {
              tiles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                tx: offsetX + (li * (colsPer + gap) + c) * tileSize,
                ty: offsetY + r * tileSize,
                size: tileSize * 0.94,
                c: PAPER,
                phase: Math.random() * 0.4,
              });
            }
          }
        }
      }

      // drifting confetti
      for (let i = 0; i < 90; i++) {
        const sz = (3 + Math.random() * 5) * (tileSize * 0.18);
        tiles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          tx: Math.random() * W,
          ty: Math.random() * H,
          size: sz,
          c: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
          phase: 1,
          isConfetti: true,
          drift: { vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 },
        });
      }

      // 2017 year row
      const year = "2017";
      const yearTileSize = tileSize * 0.32;
      const yearCols = year.length * 3 + (year.length - 1);
      const yearTotalW = yearCols * yearTileSize;
      const yearOffsetX = (W - yearTotalW) / 2;
      const yearOffsetY = offsetY + rows * tileSize + tileSize * 0.6;
      for (let li = 0; li < year.length; li++) {
        const ch = FONT_SMALL[year[li]];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < 3; c++) {
            if (ch[r][c] === "1") {
              tiles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                tx: yearOffsetX + li * 4 * yearTileSize + c * yearTileSize,
                ty: yearOffsetY + r * yearTileSize,
                size: yearTileSize * 0.94,
                c: PURPLE,
                phase: Math.random() * 0.4 + 0.25,
              });
            }
          }
        }
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTiles(W, H);
    }

    function frame(now: number) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const elapsed = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const tile of tiles) {
        if (tile.isConfetti && tile.drift) {
          tile.x += tile.drift.vx;
          tile.y += tile.drift.vy;
          if (tile.x < -10) tile.x = W + 10;
          if (tile.x > W + 10) tile.x = -10;
          if (tile.y < -10) tile.y = H + 10;
          if (tile.y > H + 10) tile.y = -10;
        } else if (elapsed > tile.phase) {
          tile.x += (tile.tx - tile.x) * 0.06;
          tile.y += (tile.ty - tile.y) * 0.06;
        }
        ctx.fillStyle = tile.c;
        ctx.fillRect(tile.x, tile.y, tile.size, tile.size);
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    const fadeTimer = window.setTimeout(() => setFadingOut(true), 2200);
    const doneTimer = window.setTimeout(onComplete, 3000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      onClick={() => {
        setFadingOut(true);
        window.setTimeout(onComplete, 600);
      }}
      className={`fixed inset-0 z-[100] bg-ink transition-opacity duration-700 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-8 left-0 right-0 text-center font-mono text-[10px] tracking-[0.25em] text-paper-faint uppercase">
        Click anywhere to skip
      </div>
    </div>
  );
}
