"use client";

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_base;
  uniform vec3 u_mist;
  uniform vec3 u_accent;
  uniform vec3 u_glow;
  uniform float u_speed;
  uniform float u_turbulence;
  uniform float u_brightness;
  // entry direction: (0,1)=bottom-up, (1,0)=left-drift, (0,0)=disabled
  uniform vec2 u_entry_dir;
  // 0 -> 1.4 across the entry duration; clamped at 1.4 = fully revealed
  uniform float u_entry_progress;
  // density profile: 0 uniform, 1 heavier at bottom, 2 heavier at edges
  uniform int u_density_mode;
  // overall mist intensity multiplier
  uniform float u_intensity;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uvn = gl_FragCoord.xy / u_resolution.xy;
    vec2 uv = uvn;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 mPos = u_mouse / u_resolution.xy;
    mPos.x *= u_resolution.x / u_resolution.y;
    float dist = distance(uv, mPos);

    float t = u_time * u_speed;

    vec2 q = vec2(0.0);
    q.x = fbm(uv + 0.07 * t);
    q.y = fbm(uv + vec2(1.0, 1.0));

    vec2 r = vec2(0.0);
    r.x = fbm(uv + u_turbulence * q + vec2(1.7, 9.2) + 0.15 * t);
    r.y = fbm(uv + u_turbulence * q + vec2(8.3, 2.8) + 0.126 * t);

    float f = fbm(uv + r);

    // density weight on the mist contribution
    float dw = 1.0;
    if (u_density_mode == 1) {
      dw = mix(0.45, 1.4, 1.0 - uvn.y);
    } else if (u_density_mode == 2) {
      float d2 = clamp(length(uvn - vec2(0.5)) * 1.55, 0.0, 1.0);
      dw = mix(0.45, 1.45, d2);
    }
    dw *= u_intensity;

    // entry mask: reveal advances from u_entry_dir along the normalized axis
    float threshold = dot(uvn, u_entry_dir);
    float mask = smoothstep(threshold, threshold + 0.4, u_entry_progress);

    float fAdj = clamp(f * dw, 0.0, 1.4) * mask;
    vec3 color = mix(u_base, u_mist, fAdj);
    color = mix(color, u_accent, dot(q, r) * 0.55 * mask);

    float mouseGlow = smoothstep(0.4, 0.0, dist);
    color += mouseGlow * 0.06 * u_glow * mask;

    color = pow(color, vec3(0.92)) * u_brightness;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export type FogPalette = {
  base: [number, number, number];
  mist: [number, number, number];
  accent: [number, number, number];
  glow: [number, number, number];
  /** time multiplier; 1.0 = current speed */
  speed?: number;
  /** how much q distorts r — higher = more swirl */
  turbulence?: number;
  /** final multiplier on color */
  brightness?: number;
};

const DEFAULT_PALETTE: Required<FogPalette> = {
  base: [0.055, 0.058, 0.071],
  mist: [0.165, 0.14, 0.255],
  accent: [0.31, 0.23, 0.485],
  glow: [0.62, 0.5, 0.95],
  speed: 1.0,
  turbulence: 1.0,
  brightness: 1.35,
};

export type FogEntryDir = "bottom" | "left" | null;
export type FogDensity = "uniform" | "bottom" | "edges";

type Props = {
  palette?: FogPalette;
  entry?: { dir: FogEntryDir; duration?: number };
  density?: FogDensity;
  /** mist multiplier; 1.0 = default. Bump for a denser look. */
  intensity?: number;
};

export function MistBackground({
  palette,
  entry,
  density = "uniform",
  intensity = 1.0,
}: Props = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Refs so the rAF loop can read live values without re-initializing WebGL.
  const paletteRef = useRef<Required<FogPalette>>({
    ...DEFAULT_PALETTE,
    ...palette,
  });
  const settingsRef = useRef({
    entryDir: entry?.dir ?? null,
    entryDuration: entry?.duration ?? 1.5,
    density,
    intensity,
  });

  useEffect(() => {
    paletteRef.current = { ...DEFAULT_PALETTE, ...palette };
  }, [palette]);

  useEffect(() => {
    settingsRef.current = {
      entryDir: entry?.dir ?? null,
      entryDuration: entry?.duration ?? 1.5,
      density,
      intensity,
    };
  }, [entry?.dir, entry?.duration, density, intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("shader compile:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("program link:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const baseLoc = gl.getUniformLocation(program, "u_base");
    const mistLoc = gl.getUniformLocation(program, "u_mist");
    const accentLoc = gl.getUniformLocation(program, "u_accent");
    const glowLoc = gl.getUniformLocation(program, "u_glow");
    const speedLoc = gl.getUniformLocation(program, "u_speed");
    const turbulenceLoc = gl.getUniformLocation(program, "u_turbulence");
    const brightnessLoc = gl.getUniformLocation(program, "u_brightness");
    const entryDirLoc = gl.getUniformLocation(program, "u_entry_dir");
    const entryProgressLoc = gl.getUniformLocation(program, "u_entry_progress");
    const densityModeLoc = gl.getUniformLocation(program, "u_density_mode");
    const intensityLoc = gl.getUniformLocation(program, "u_intensity");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    let entryStart: number | null = null;
    const render = (t: number) => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      if (entryStart === null) entryStart = t;

      const p = paletteRef.current;
      const s = settingsRef.current;

      let dirX = 0;
      let dirY = 0;
      let progress = 5.0; // disabled => fully revealed
      if (s.entryDir === "bottom") {
        dirX = 0;
        dirY = 1;
        const e = (t - entryStart) / 1000;
        progress = Math.min((e / s.entryDuration) * 1.4, 1.4);
      } else if (s.entryDir === "left") {
        dirX = 1;
        dirY = 0;
        const e = (t - entryStart) / 1000;
        progress = Math.min((e / s.entryDuration) * 1.4, 1.4);
      }

      let densityMode = 0;
      if (s.density === "bottom") densityMode = 1;
      else if (s.density === "edges") densityMode = 2;

      gl.clearColor(p.base[0], p.base[1], p.base[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.uniform3f(baseLoc, p.base[0], p.base[1], p.base[2]);
      gl.uniform3f(mistLoc, p.mist[0], p.mist[1], p.mist[2]);
      gl.uniform3f(accentLoc, p.accent[0], p.accent[1], p.accent[2]);
      gl.uniform3f(glowLoc, p.glow[0], p.glow[1], p.glow[2]);
      gl.uniform1f(speedLoc, p.speed);
      gl.uniform1f(turbulenceLoc, p.turbulence);
      gl.uniform1f(brightnessLoc, p.brightness);
      gl.uniform2f(entryDirLoc, dirX, dirY);
      gl.uniform1f(entryProgressLoc, progress);
      gl.uniform1i(densityModeLoc, densityMode);
      gl.uniform1f(intensityLoc, s.intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
