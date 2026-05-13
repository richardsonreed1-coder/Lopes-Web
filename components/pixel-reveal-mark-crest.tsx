"use client";

import { useEffect, useRef } from "react";

type Tile = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  c: string;
};

const HORNS = [
  "10000000000000000001",
  "10000000000000000001",
  "01000000000000000010",
  "01000000000000000010",
  "00100000000000000100",
  "00100000000000000100",
  "00010000000000001000",
  "00010000000000001000",
  "00001100000000110000",
  "00000110000001100000",
  "00000011000011000000",
  "00000001100110000000",
  "00000000111100000000",
  "00000000011000000000",
  "00000000011000000000",
  "00000000111100000000",
];

const FONT: Record<string, string[]> = {
  L: ["1000", "1000", "1000", "1000", "1111"],
  O: ["0110", "1001", "1001", "1001", "0110"],
  P: ["1110", "1001", "1110", "1000", "1000"],
  E: ["1111", "1000", "1110", "1000", "1111"],
  S: ["0111", "1000", "0110", "0001", "1110"],
};

export function PixelRevealMarkCrest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let tiles: Tile[] = [];
    let raf = 0;

    function build(W: number, H: number) {
      tiles = [];
      const word = "LOPES";
      const wordRows = 5;
      const wordColsPer = 4;
      const wordGap = 1;
      const wordCols =
        wordColsPer * word.length + (word.length - 1) * wordGap;
      const wordTileSize = Math.min(
        (W * 0.85) / wordCols,
        (H * 0.32) / wordRows
      );
      const wordTotalW = wordCols * wordTileSize;
      const wordOffsetX = (W - wordTotalW) / 2;

      const hornsCols = HORNS[0].length;
      const hornsRows = HORNS.length;
      const hornsTileSize = wordTileSize * 0.4;
      const hornsTotalW = hornsCols * hornsTileSize;
      const hornsTotalH = hornsRows * hornsTileSize;
      const hornsOffsetX = (W - hornsTotalW) / 2;
      const hornsOffsetY = (H - hornsTotalH - wordTileSize * wordRows) / 2 - wordTileSize * 1.2;
      const wordOffsetY = hornsOffsetY + hornsTotalH + wordTileSize * 1.6;

      for (let r = 0; r < hornsRows; r++) {
        for (let c = 0; c < hornsCols; c++) {
          if (HORNS[r][c] === "1") {
            tiles.push({
              x: Math.random() * W,
              y: Math.random() * H,
              tx: hornsOffsetX + c * hornsTileSize,
              ty: hornsOffsetY + r * hornsTileSize,
              size: hornsTileSize * 0.92,
              c: "#7A4FD9",
            });
          }
        }
      }

      for (let li = 0; li < word.length; li++) {
        const ch = FONT[word[li]];
        for (let r = 0; r < wordRows; r++) {
          for (let c = 0; c < wordColsPer; c++) {
            if (ch[r][c] === "1") {
              tiles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                tx:
                  wordOffsetX +
                  (li * (wordColsPer + wordGap) + c) * wordTileSize,
                ty: wordOffsetY + r * wordTileSize,
                size: wordTileSize * 0.94,
                c: "#ECE7DC",
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

    function loop() {
      if (!cvs || !ctx) return;
      const W = parseFloat(cvs.style.width) || cvs.clientWidth || 800;
      const H = parseFloat(cvs.style.height) || cvs.clientHeight || 360;
      ctx.clearRect(0, 0, W, H);

      for (const tile of tiles) {
        tile.x = tile.x + (tile.tx - tile.x) * 0.05;
        tile.y = tile.y + (tile.ty - tile.y) * 0.05;
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
