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
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
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

    vec3 color = mix(u_base, u_mist, f);
    color = mix(color, u_accent, dot(q, r) * 0.55);

    float mouseGlow = smoothstep(0.4, 0.0, dist);
    color += mouseGlow * 0.06 * u_glow;

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

export function MistBackground({ palette }: { palette?: FogPalette } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // hold the latest palette in a ref so the rAF loop can read it without
  // tearing down WebGL on prop change
  const paletteRef = useRef<Required<FogPalette>>({
    ...DEFAULT_PALETTE,
    ...palette,
  });

  useEffect(() => {
    paletteRef.current = { ...DEFAULT_PALETTE, ...palette };
  }, [palette]);

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

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const render = (t: number) => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      const p = paletteRef.current;
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
