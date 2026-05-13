"use client";

import { useEffect, useRef } from "react";

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
  flash?: number;
};

const FONT: Record<string, string[]> = {
  L: ["1000", "1000", "1000", "1000", "1111"],
  O: ["0110", "1001", "1001", "1001", "0110"],
  P: ["1110", "1001", "1110", "1000", "1000"],
  E: ["1111", "1000", "1110", "1000", "1111"],
  S: ["0111", "1000", "0110", "0001", "1110"],
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["110", "001", "010", "100", "111"],
  "7": ["111", "001", "010", "010", "100"],
};

const COLORS = [
  "#7A4FD9",
  "#5028A0",
  "#D9A441",
  "#2F8F8F",
  "#C44060",
  "#ECE7DC",
];

export function PixelReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let tiles: Tile[] = [];
    let raf = 0;
    const t0 = performance.now();

    function build(W: number, H: number) {
      tiles = [];
      const word = "LOPES";
      const rows = 5;
      const colsPer = 4;
      const gap = 1;
      const letterCols = colsPer * word.length + (word.length - 1) * gap;
      const tileSize = Math.min(
        (W * 0.95) / letterCols,
        (H * 0.65) / rows
      );
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
                c: "#ECE7DC",
                phase: Math.random() * 0.5,
              });
            }
          }
        }
      }

      for (let i = 0; i < 60; i++) {
        const sz = (3 + Math.random() * 5) * (tileSize * 0.18);
        tiles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          tx: Math.random() * W,
          ty: Math.random() * H,
          size: sz,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: 1,
          drift: {
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
          },
          isConfetti: true,
        });
      }

      const year = "2017";
      const yearTileSize = tileSize * 0.35;
      const yearCols = year.length * 3 + (year.length - 1) * 1;
      const yearTotalW = yearCols * yearTileSize;
      const yearOffsetX = (W - yearTotalW) / 2;
      const yearOffsetY = offsetY + rows * tileSize + tileSize * 0.5;
      for (let li = 0; li < year.length; li++) {
        const ch = FONT[year[li]];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < 3; c++) {
            if (ch[r][c] === "1") {
              tiles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                tx: yearOffsetX + li * 4 * yearTileSize + c * yearTileSize,
                ty: yearOffsetY + r * yearTileSize,
                size: yearTileSize * 0.94,
                c: "#7A4FD9",
                phase: Math.random() * 0.5 + 0.3,
              });
            }
          }
        }
      }
    }

    function resize() {
      if (!cvs || !ctx) return;
      const parent = cvs.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      const w = r.width || 800;
      const h = r.height || w * 0.44;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.max(1, Math.floor(w * dpr));
      cvs.height = Math.max(1, Math.floor(h * dpr));
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(w, h);
    }

    function loop(now: number) {
      if (!cvs || !ctx) return;
      const W = parseFloat(cvs.style.width) || cvs.clientWidth || 800;
      const H = parseFloat(cvs.style.height) || cvs.clientHeight || 360;
      const elapsed = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      for (const tile of tiles) {
        if (tile.isConfetti && tile.drift) {
          tile.x += tile.drift.vx;
          tile.y += tile.drift.vy;
          if (tile.x < -10) tile.x = W + 10;
          if (tile.x > W + 10) tile.x = -10;
          if (tile.y < -10) tile.y = H + 10;
          if (tile.y > H + 10) tile.y = -10;
        } else {
          const k = Math.min(1, Math.max(0, (elapsed - tile.phase) * 0.9));
          tile.x = tile.x + (tile.tx - tile.x) * 0.045;
          tile.y = tile.y + (tile.ty - tile.y) * 0.045;
          if (k > 0.95 && Math.random() < 0.0025) tile.flash = 6;
        }
        ctx.fillStyle = tile.c;
        if (tile.flash && tile.flash > 0) {
          ctx.fillStyle = "#7A4FD9";
          tile.flash--;
        }
        ctx.fillRect(tile.x, tile.y, tile.size, tile.size);
      }
      raf = requestAnimationFrame(loop);
    }

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full" />;
}
