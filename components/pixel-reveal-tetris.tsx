"use client";

import { useEffect, useRef } from "react";

type Tile = {
  x: number;
  ty: number;
  y: number;
  vy: number;
  size: number;
  c: string;
  startTime: number;
  bounces: number;
  settled: boolean;
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

const GRAVITY = 0.55;
const BOUNCE_DAMP = 0.42;
const SETTLE_THRESHOLD = 1.2;

export function PixelRevealTetris() {
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
        const columnIndex = li * (colsPer + gap);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < colsPer; c++) {
            if (ch[r][c] === "1") {
              const startCol = columnIndex + c;
              tiles.push({
                x: offsetX + startCol * tileSize,
                ty: offsetY + r * tileSize,
                y: -tileSize - Math.random() * tileSize * 3,
                vy: 0,
                size: tileSize * 0.94,
                c: "#ECE7DC",
                startTime: startCol * 0.05 + r * 0.02,
                bounces: 0,
                settled: false,
              });
            }
          }
        }
      }

      const year = "2017";
      const yearTileSize = tileSize * 0.35;
      const yearCols = year.length * 3 + (year.length - 1) * 1;
      const yearTotalW = yearCols * yearTileSize;
      const yearOffsetX = (W - yearTotalW) / 2;
      const yearOffsetY = offsetY + rows * tileSize + tileSize * 0.5;
      const yearStart = 1.6;
      for (let li = 0; li < year.length; li++) {
        const ch = FONT[year[li]];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < 3; c++) {
            if (ch[r][c] === "1") {
              const colIndex = li * 4 + c;
              tiles.push({
                x: yearOffsetX + colIndex * yearTileSize,
                ty: yearOffsetY + r * yearTileSize,
                y: -yearTileSize - Math.random() * yearTileSize * 6,
                vy: 0,
                size: yearTileSize * 0.94,
                c: "#7A4FD9",
                startTime: yearStart + colIndex * 0.04 + r * 0.02,
                bounces: 0,
                settled: false,
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
        if (elapsed < tile.startTime) continue;
        if (!tile.settled) {
          tile.vy += GRAVITY;
          tile.y += tile.vy;
          if (tile.y >= tile.ty) {
            tile.y = tile.ty;
            if (Math.abs(tile.vy) > SETTLE_THRESHOLD && tile.bounces < 2) {
              tile.vy = -tile.vy * BOUNCE_DAMP;
              tile.bounces += 1;
            } else {
              tile.vy = 0;
              tile.settled = true;
            }
          }
        }
        ctx.fillStyle = tile.c;
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
