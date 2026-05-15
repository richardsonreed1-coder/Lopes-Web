"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Calendar,
  LineChart,
  Building2,
  GraduationCap,
  Activity,
  Megaphone,
  ScrollText,
  Compass,
  Hammer,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Quote,
  MapPin,
  Clock,
} from "lucide-react";

// ============================================================
// LOPES CAPITAL — TRAFFIC HUB
// Nine doors. One ledger.
// Five operating volumes · Four operating principles
// ============================================================

const INK = "#0E0F12";
const INK_2 = "#1A1B22";
const PAPER = "#F4EFE3";
const PAPER_WARM = "#EDE5D2";
const PAPER_DIM = "rgba(244, 239, 227, 0.7)";
const PAPER_MUTE = "rgba(244, 239, 227, 0.55)";
const PAPER_FAINT = "rgba(244, 239, 227, 0.4)";
const RULE = "rgba(244, 239, 227, 0.16)";

const PURPLE = "#5028A0";
const PURPLE_2 = "#7A4FD9";
const GOLD = "#8C6A2A";
const GOLD_2 = "#B58B45";
const BURGUNDY = "#4A1A24";
const TEAL = "#244B4F";
const OLIVE = "#3B4230";
const RUST = "#6E2E18";

// ============================================================
// FONT STACK + GLOBAL CSS
// ============================================================

const FontStack = () => (
  <style>{`
    html, body { background-color: ${INK}; color: ${PAPER}; }

    .font-display { font-family: var(--font-display); font-feature-settings: 'ss01', 'ss02'; }
    .font-sans { font-family: var(--font-sans); }
    .font-mono { font-family: var(--font-mono); }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.45; transform: scale(0.85); }
    }
    .pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }

    @keyframes ledger-rule {
      0% { transform: scaleX(0); transform-origin: left; }
      100% { transform: scaleX(1); transform-origin: left; }
    }
    .ledger-rule { animation: ledger-rule 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards; }

    .dot-field {
      background-image: radial-gradient(currentColor 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .display-huge {
      font-family: var(--font-display);
      font-weight: 300;
      line-height: 0.86;
      letter-spacing: -0.03em;
      font-size: clamp(3rem, 9vw, 9rem);
    }
  `}</style>
);

// ============================================================
// PORTAL REGISTRY — 9 doors: 5 volumes + 4 principles, 9 total
// ============================================================

const PORTALS = {
  capital: {
    abbr: "VOL.01",
    name: "Capital Markets",
    short: "pricing the distortion",
    tag: "Quant + fundamental + alt-data. Signal extraction where passive flows haven't yet commoditized intelligence.",
    accent: PURPLE,
    icon: LineChart,
    href: "/capital-markets",
    kind: "volume",
    archetype: "flagship",
  },
  realestate: {
    abbr: "VOL.02",
    name: "Real Estate",
    short: "infrastructure for the overflow",
    tag: "Adaptive-reuse self-storage. Functionally obsolete buildings, below replacement cost, held indefinitely.",
    accent: GOLD,
    icon: Building2,
    href: "/real-estate",
    kind: "volume",
    archetype: "commerce",
  },
  education: {
    abbr: "VOL.03",
    name: "Education",
    short: "the new architecture of learning",
    tag: "K-20 platform, microschools, and family advisory. Lineage runs through GCU, 2003–2018.",
    accent: BURGUNDY,
    icon: GraduationCap,
    href: "/education",
    kind: "volume",
    archetype: "community",
  },
  healthcare: {
    abbr: "VOL.04",
    name: "Healthcare",
    short: "the parallel health economy",
    tag: "Specialist-led platforms in neuro and functional health. Protocol IP, practitioner network, DTC funnel.",
    accent: TEAL,
    icon: Activity,
    href: "/healthcare",
    kind: "volume",
    archetype: "clinical-white",
  },
  media: {
    abbr: "VOL.05",
    name: "Media & Consumer",
    short: "the infrastructure of influence",
    tag: "Creator commerce holdco. Owned IP, direct distribution, the physical backend behind the influence.",
    accent: OLIVE,
    icon: Megaphone,
    href: "/media-consumer",
    kind: "volume",
    archetype: "dark-product",
  },
  letters: {
    abbr: "VOL.06",
    name: "Letters",
    short: "annual notes, on the record",
    tag: "One letter per year, signed and dated. Theses, mistakes, and what we did about both. 2018 — 2025.",
    accent: PAPER_WARM,
    icon: ScrollText,
    href: "/#letters",
    kind: "volume",
    archetype: "curated-list",
  },
  discover: {
    abbr: "PR.I",
    name: "Discover",
    short: "where signal becomes thesis",
    tag: "Research as posture. Theses in public. We don't chase deals — we publish until the deals find us.",
    accent: PURPLE_2,
    icon: Compass,
    href: "/discover",
    kind: "pillar",
    archetype: "thesis",
  },
  develop: {
    abbr: "PR.II",
    name: "Develop",
    short: "where capital becomes operation",
    tag: "Pencil-down underwriting. Hands-on operator support. Patient capital, on a schedule.",
    accent: RUST,
    icon: Hammer,
    href: "/develop",
    kind: "pillar",
    archetype: "playbook",
  },
  deliver: {
    abbr: "PR.III",
    name: "Deliver",
    short: "where work becomes outcome",
    tag: "DPI before TVPI. Distributions in plain English. The letter at the end of every realized position.",
    accent: GOLD_2,
    icon: CheckCircle2,
    href: "/deliver",
    kind: "pillar",
    archetype: "ledger",
  },
};

// ============================================================
// GLASS FILTER — refractive distortion on hover
// ============================================================

function GlassFilter() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="lopes-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.012"
            numOctaves="2"
            seed="17"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2.5" result="softMap" />
          <feSpecularLighting
            in="softMap"
            surfaceScale="4"
            specularConstant="1"
            specularExponent="120"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-150" y="-150" z="280" />
          </feSpecularLighting>
          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

// ============================================================
// MIST BACKGROUND — WebGL fragment shader, ported from the
// production Lopes site. fbm noise, deep purple-ink mist,
// mouse-following purple-2 glow. Theme-aware brightness.
// ============================================================

const VERT_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG_SHADER = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_dark;

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

    vec2 q = vec2(0.0);
    q.x = fbm(uv + 0.07 * u_time);
    q.y = fbm(uv + vec2(1.0, 1.0));

    vec2 r = vec2(0.0);
    r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

    float f = fbm(uv + r);

    // Lopes ink palette — deep purple-ink mist
    vec3 baseDark = vec3(0.055, 0.058, 0.071);   // ink #0E0F12
    vec3 mistDark = vec3(0.165, 0.140, 0.255);   // muted purple
    vec3 accentDark = vec3(0.310, 0.230, 0.485); // purple-2 wash

    // Light theme paper palette
    vec3 baseLight = vec3(0.957, 0.937, 0.890);  // paper #F4EFE3
    vec3 mistLight = vec3(0.825, 0.792, 0.870);  // light purple wash
    vec3 accentLight = vec3(0.620, 0.530, 0.785);

    vec3 baseColor = mix(baseLight, baseDark, u_dark);
    vec3 mistColor = mix(mistLight, mistDark, u_dark);
    vec3 accentColor = mix(accentLight, accentDark, u_dark);

    vec3 color = mix(baseColor, mistColor, f);
    color = mix(color, accentColor, dot(q, r) * 0.55);

    float mouseGlow = smoothstep(0.4, 0.0, dist);
    vec3 glowColor = mix(vec3(0.45, 0.36, 0.78), vec3(0.62, 0.50, 0.95), u_dark);
    color += mouseGlow * 0.06 * glowColor;

    color = pow(color, vec3(0.92)) * mix(1.0, 1.35, u_dark);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function MistBackground({ theme }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type, source) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("shader:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
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
    const darkLoc = gl.getUniformLocation(program, "u_dark");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const render = (t) => {
      const w = window.innerWidth || document.documentElement.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight;
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      if (canvas.width === 0 || canvas.height === 0) {
        raf = requestAnimationFrame(render);
        return;
      }
      gl.useProgram(program);
      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);
      gl.uniform1f(darkLoc, themeRef.current === "dark" ? 1.0 : 0.0);
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
      className="fixed inset-0 w-screen h-screen block pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ============================================================
// ATMOSPHERE — layered blur spots + vignette + grain over mist
// ============================================================

function Atmosphere({ theme, children }) {
  const isDark = theme === "dark";
  return (
    <div
      className="relative min-h-screen overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : "#F1ECDF" }}
    >
      <MistBackground theme={theme} />

      {/* Atmospheric blur spots layered over the mist */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div
          className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full"
          style={{ background: isDark ? INK_2 : "#D8CCB0", filter: "blur(120px)" }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] h-[70%] w-[70%] rounded-full"
          style={{ background: isDark ? "#3a2d55" : "#B89FDB", filter: "blur(140px)" }}
        />
        <div
          className="absolute left-[30%] top-[40%] h-[40%] w-[40%] rounded-full"
          style={{ background: isDark ? "#14151f" : "#E0D6BD", filter: "blur(100px)" }}
        />
      </div>

      {/* Decorative radial dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035] dot-field"
        style={{ color: isDark ? "#fff" : "#000" }}
      />

      {/* Bottom vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: isDark
            ? `linear-gradient(to bottom, transparent 0%, transparent 60%, ${INK}b3 100%)`
            : `linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(240,236,222,0.7) 100%)`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============================================================
// LIQUID GLASS TILE — the 9 portals
// ============================================================

function LiquidGlassTile({ portal, onClick, delay, theme = "dark" }) {
  const Icon = portal.icon;
  const isDark = theme === "dark";
  const tileRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({ x: -(ny - 0.5) * 10, y: (nx - 0.5) * 12 });
    setMouse({ x: nx * 100, y: ny * 100 });
  };
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };
  const handleMouseEnter = () => setIsHovered(true);

  const g = isDark
    ? {
        frostBg: "rgba(14, 15, 18, 0.32)",
        frostBlur: 24,
        frostSat: 1.8,
        border: "rgba(244, 239, 227, 0.12)",
        dropShadow: "0 30px 60px -20px rgba(0,0,0,0.65), 0 8px 20px -4px rgba(0,0,0,0.4)",
        contentInk: PAPER,
        contentMuted: PAPER_DIM,
        contentSoft: PAPER_MUTE,
        specular: 0.35,
      }
    : {
        frostBg: "rgba(255, 252, 245, 0.55)",
        frostBlur: 22,
        frostSat: 1.5,
        border: "rgba(14, 15, 18, 0.09)",
        dropShadow: "0 28px 50px -18px rgba(14,15,18,0.22), 0 8px 18px -4px rgba(14,15,18,0.12)",
        contentInk: INK,
        contentMuted: "rgba(14, 15, 18, 0.62)",
        contentSoft: "rgba(14, 15, 18, 0.45)",
        specular: 0.45,
      };

  return (
    <motion.button
      ref={tileRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative text-left cursor-pointer min-h-[230px]"
      style={{ perspective: 1400 }}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="relative h-full w-full rounded-[28px] overflow-hidden transition-all duration-500"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: `${g.dropShadow}, inset 0 0 0 1px ${g.border}`,
        }}
      >
        {/* (1) Frosted glass base */}
        <div
          className="absolute inset-0 rounded-[28px] transition-all duration-500"
          style={{
            backdropFilter: `blur(${g.frostBlur}px) saturate(${g.frostSat})`,
            WebkitBackdropFilter: `blur(${g.frostBlur}px) saturate(${g.frostSat})`,
            backgroundColor: g.frostBg,
          }}
        />

        {/* (2) Refractive distortion on hover */}
        <div
          className="absolute inset-0 rounded-[28px] transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            filter: "url(#lopes-glass)",
            isolation: "isolate",
          }}
        />

        {/* (3) Accent corner glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none transition-opacity duration-700"
          style={{
            backgroundColor: portal.accent,
            opacity: isHovered ? 0.55 : 0.32,
            filter: "blur(55px)",
          }}
        />

        {/* (4) Cursor-tracked specular highlight */}
        <div
          className="absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 240px at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,${g.specular}), transparent 65%)`,
          }}
        />

        {/* (5) Content */}
        <div
          className="relative h-full p-5 flex flex-col"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex items-start justify-between mb-6">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl border"
              style={{
                backgroundColor: `${portal.accent}30`,
                borderColor: `${portal.accent}60`,
              }}
            >
              <Icon
                className="w-[18px] h-[18px]"
                style={{
                  color:
                    portal.accent === PAPER_WARM ? (isDark ? "#1F1D1A" : "#1F1D1A") : portal.accent,
                }}
              />
            </div>
            <div
              className="font-mono text-[9px] uppercase tracking-[0.25em]"
              style={{
                color:
                  portal.accent === PAPER_WARM
                    ? isDark ? PAPER_DIM : "rgba(14,15,18,0.62)"
                    : portal.accent,
              }}
            >
              {portal.abbr}
            </div>
          </div>

          <div
            className="font-display text-lg md:text-xl leading-[1.05] tracking-tight mb-1"
            style={{ color: g.contentInk, fontWeight: 400 }}
          >
            {portal.name}
          </div>
          <div
            className="font-display italic text-[13px] mb-3"
            style={{
              color:
                portal.accent === PAPER_WARM
                  ? isDark ? PAPER_DIM : "rgba(14,15,18,0.62)"
                  : portal.accent,
            }}
          >
            — {portal.short}
          </div>
          <div
            className="font-sans text-xs leading-snug max-w-md mb-4"
            style={{ color: g.contentMuted }}
          >
            {portal.tag}
          </div>

          <div
            className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] mt-auto"
            style={{ color: g.contentSoft }}
          >
            Open {portal.kind === "volume" ? "volume" : "principle"}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

// ============================================================
// CALENDAR / VOLUME INDEX CARD — 10th slot
// ============================================================

function VolumeIndexCard({ theme = "dark", delay = 0.84 }) {
  const isDark = theme === "dark";
  const today = new Date();
  const dayNum = today.getDate();
  const monthName = today.toLocaleDateString("en-US", { month: "long" });

  const g = isDark
    ? {
        frostBg: "rgba(14, 15, 18, 0.32)",
        frostBlur: 24,
        frostSat: 1.8,
        border: "rgba(244, 239, 227, 0.12)",
        dropShadow: "0 30px 60px -20px rgba(0,0,0,0.65), 0 8px 20px -4px rgba(0,0,0,0.4)",
        ink: PAPER,
        muted: PAPER_DIM,
        soft: PAPER_MUTE,
      }
    : {
        frostBg: "rgba(255, 252, 245, 0.55)",
        frostBlur: 22,
        frostSat: 1.5,
        border: "rgba(14, 15, 18, 0.09)",
        dropShadow: "0 28px 50px -18px rgba(14,15,18,0.22), 0 8px 18px -4px rgba(14,15,18,0.12)",
        ink: INK,
        muted: "rgba(14, 15, 18, 0.62)",
        soft: "rgba(14, 15, 18, 0.45)",
      };

  const accent = PURPLE_2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative min-h-[230px]"
    >
      <div
        className="relative h-full w-full rounded-[28px] overflow-hidden"
        style={{ boxShadow: `${g.dropShadow}, inset 0 0 0 1px ${g.border}` }}
      >
        <div
          className="absolute inset-0 rounded-[28px]"
          style={{
            backdropFilter: `blur(${g.frostBlur}px) saturate(${g.frostSat})`,
            WebkitBackdropFilter: `blur(${g.frostBlur}px) saturate(${g.frostSat})`,
            backgroundColor: g.frostBg,
          }}
        />
        <div
          className="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none"
          style={{ backgroundColor: accent, opacity: 0.22, filter: "blur(55px)" }}
        />

        <div className="relative h-full p-5 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl border"
              style={{
                backgroundColor: `${accent}30`,
                borderColor: `${accent}60`,
              }}
            >
              <Calendar className="w-[18px] h-[18px]" style={{ color: accent }} />
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: accent }}>
              MMXXVI
            </div>
          </div>

          <div className="font-mono text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: g.soft }}>
            {monthName} · {dayNum}
          </div>
          <div
            className="font-display italic leading-none tracking-tight"
            style={{ color: g.ink, fontSize: "clamp(2.25rem, 4.5vw, 3rem)", fontWeight: 400 }}
          >
            IX
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] mt-2" style={{ color: g.muted }}>
            Volume Stack
          </div>

          <div className="mt-auto pt-3 border-t" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
            <div className="font-display italic text-[14px] leading-snug" style={{ color: g.muted }}>
              Five volumes. Four principles. One ledger.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// HUB VIEW
// ============================================================

function HubView({ onNavigate, theme, toggleTheme }) {
  const keys = Object.keys(PORTALS);
  const isDark = theme === "dark";

  const bodyText = isDark ? PAPER : INK;
  const mutedText = isDark ? PAPER_DIM : "rgba(14,15,18,0.7)";
  const softText = isDark ? PAPER_MUTE : "rgba(14,15,18,0.5)";
  const borderTint = isDark ? RULE : "rgba(14,15,18,0.1)";
  const sideBg = isDark ? "rgba(244,239,227,0.08)" : "rgba(14,15,18,0.06)";
  const sideBorder = isDark ? "rgba(244,239,227,0.18)" : "rgba(14,15,18,0.15)";

  return (
    <Atmosphere theme={theme}>
      <GlassFilter />

      {/* Fixed vertical side label */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <div
          className="py-5 px-2.5 font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{
            backgroundColor: sideBg,
            backdropFilter: "blur(14px) saturate(1.4)",
            WebkitBackdropFilter: "blur(14px) saturate(1.4)",
            color: bodyText,
            writingMode: "vertical-rl",
            border: `1px solid ${sideBorder}`,
            borderRight: "none",
          }}
        >
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>
            Hub · v.MMXXVI
          </span>
        </div>
      </div>

      {/* Top bar — matches the original homepage nav style */}
      <nav className="relative z-10 px-8 md:px-12 lg:px-16 pt-8 pb-5 mb-12 md:mb-20 flex items-center justify-between">
        <a
          href="/"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.4em] md:text-xs"
          style={{ color: bodyText }}
        >
          Lopes / Capital
        </a>
        <div
          className="hidden gap-10 font-mono text-[10px] uppercase tracking-[0.3em] md:flex"
          style={{ color: bodyText, opacity: 0.6 }}
        >
          <button
            type="button"
            onClick={() => onNavigate("discover")}
            className="font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity hover:opacity-100"
          >
            Discover
          </button>
          <button
            type="button"
            onClick={() => onNavigate("develop")}
            className="font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity hover:opacity-100"
          >
            Develop
          </button>
          <button
            type="button"
            onClick={() => onNavigate("deliver")}
            className="font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity hover:opacity-100"
          >
            Deliver
          </button>
          <button
            type="button"
            onClick={() => onNavigate("develop")}
            className="font-mono text-[10px] uppercase tracking-[0.3em] transition-opacity hover:opacity-100"
            title="Folded into Develop"
          >
            Disrupt
          </button>
        </div>
      </nav>

      {/* Tile grid — sits directly under the nav */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {keys.map((key, idx) => {
            const p = PORTALS[key];
            return (
              <LiquidGlassTile
                key={key}
                portal={p}
                onClick={() => onNavigate(key)}
                delay={0.3 + idx * 0.06}
                theme={theme}
              />
            );
          })}
          <VolumeIndexCard theme={theme} delay={0.3 + keys.length * 0.06} />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-12 border-t"
        style={{ borderColor: borderTint }}
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-start">
          <FooterCol label="Mandate" value="Multi-Family Office" softText={softText} bodyText={bodyText} />
          <FooterCol label="Vintage" value="Est. 2017" softText={softText} bodyText={bodyText} />
          <FooterCol label="Domicile" value="Scottsdale, AZ" softText={softText} bodyText={bodyText} />
          <FooterCol label="Lineage" value="GCU · 2003 — 2018" softText={softText} bodyText={bodyText} />
          <div className="md:text-right">
            <div className="font-display italic text-[28px] md:text-[34px] leading-none" style={{ color: bodyText, fontWeight: 400 }}>
              IX
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: softText }}>
              Volume Stack · MMXXVI
            </div>
          </div>
        </div>
      </footer>
    </Atmosphere>
  );
}

function FooterCol({ label, value, softText, bodyText }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: softText }}>
        {label}
      </span>
      <span className="font-mono text-xs" style={{ color: bodyText, opacity: 0.7 }}>
        {value}
      </span>
    </div>
  );
}

// ============================================================
// PORTAL PRIMITIVES — Nav, ArrivalBanner, Kicker, Headline
// ============================================================

function ArrivalBanner({ accent }) {
  return (
    <motion.div
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
      className="absolute top-0 left-0 right-0 h-[3px] z-50"
      style={{ backgroundColor: accent }}
    />
  );
}

function PortalNav({ onBack, accent, abbr, theme = "dark" }) {
  const isDark = theme === "dark";
  const barBg = isDark ? "rgba(14,15,18,0.78)" : "rgba(244,239,227,0.85)";
  const textInk = isDark ? PAPER : INK;
  const textMuted = isDark ? PAPER_MUTE : "rgba(14,15,18,0.55)";
  const textSoft = isDark ? PAPER_FAINT : "rgba(14,15,18,0.4)";
  const borderColor = isDark ? RULE : "rgba(14,15,18,0.12)";

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ backgroundColor: barBg, borderColor }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors hover:opacity-100"
          style={{ color: textMuted }}
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Hub
        </button>
        <div className="font-display text-sm tracking-wide" style={{ color: textInk }}>
          lopes<span style={{ color: accent }}>.</span>capital
          <span className="font-mono text-[10px] ml-2 uppercase tracking-[0.25em]" style={{ color: accent }}>
            {abbr}
          </span>
        </div>
        <div className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: textSoft }}>
          Preview · Walkthrough
        </div>
      </div>
    </div>
  );
}

function Kicker({ children, accent }) {
  return (
    <div
      className="font-mono text-[10px] uppercase tracking-[0.3em] mb-5"
      style={{ color: accent }}
    >
      {children}
    </div>
  );
}

function BigHeadline({ children, theme = "dark" }) {
  const isDark = theme === "dark";
  return (
    <h1
      className="font-display tracking-tight mb-6"
      style={{
        color: isDark ? PAPER : INK,
        fontSize: "clamp(2.5rem, 6vw, 5rem)",
        lineHeight: 1,
        fontWeight: 400,
      }}
    >
      {children}
    </h1>
  );
}

function LeadPara({ children, theme = "dark", className = "" }) {
  const isDark = theme === "dark";
  return (
    <p
      className={`font-sans text-base md:text-[17px] leading-relaxed max-w-[60ch] ${className}`}
      style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.72)" }}
    >
      {children}
    </p>
  );
}

function PortalCTA({ href, accent, label = "Visit on lopescapital.com" }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors"
      style={{
        borderColor: `${accent}80`,
        color: accent,
        backgroundColor: `${accent}14`,
      }}
    >
      {label}
      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </a>
  );
}

// ============================================================
// PORTAL: CAPITAL MARKETS (VOL.01) — Flagship
// ============================================================

function CapitalMarketsPortal({ onBack, theme }) {
  const p = PORTALS.capital;
  const accent = p.accent;
  const isDark = theme === "dark";

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : PAPER, color: isDark ? PAPER : INK }}
    >
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme={theme} />

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <Kicker accent={accent}>{p.abbr} · {p.name.toUpperCase()} · QUANT · FUNDAMENTAL · ALT-DATA</Kicker>
        <BigHeadline theme={theme}>
          Pricing the <em className="italic" style={{ color: accent }}>distortion.</em>
        </BigHeadline>
        <LeadPara theme={theme}>
          The proliferation of passive capital and algorithmic trading has distorted asset pricing.
          True alpha now exists only at the edges — where proprietary data networks and asymmetric
          intelligence have not yet been commoditized.
        </LeadPara>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <Stat label="Sleeves" value="04" accent={accent} theme={theme} />
          <Stat label="Year live" value="2017" accent={accent} theme={theme} />
          <Stat label="Public sleeve" value="2019" accent={accent} theme={theme} />
          <Stat label="Signals engine" value="2025" accent={accent} theme={theme} />
        </div>

        {/* Tier-style positions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <PositionCard
            tier="Algo desks"
            body="Discretionary mandate + event-driven desk. Pencil-down on every position; nothing handed off."
            accent={accent}
            theme={theme}
          />
          <PositionCard
            tier="Alt-data"
            body="Proprietary pipelines — credit-card panels, satellite, hiring, footfall — feeding the signal extraction layer."
            accent={accent}
            theme={theme}
            featured
          />
          <PositionCard
            tier="Liquidity"
            body="Specialized liquidity providers in markets where size moves price. Patient sizing, not blasting."
            accent={accent}
            theme={theme}
          />
          <PositionCard
            tier="Signal extraction"
            body="The signals engine, live 2025. Where the alt-data, the macro read, and the desk meet."
            accent={accent}
            theme={theme}
          />
        </div>

        {/* Timeline */}
        <div className="mt-20">
          <Kicker accent={accent}>§03 · Cadence</Kicker>
          <BigHeadline theme={theme}>
            Eight years, <em className="italic" style={{ color: accent }}>four moves.</em>
          </BigHeadline>
          <div className="mt-8 border-t" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
            <TimelineRow year="2017" note="Discretionary mandate opened" accent={accent} theme={theme} />
            <TimelineRow year="2019" note="Public sleeve activated" accent={accent} theme={theme} />
            <TimelineRow year="2022" note="Event-driven desk staffed" accent={accent} theme={theme} />
            <TimelineRow year="2025" note="Signals engine live" accent={accent} theme={theme} />
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 border-t pt-8" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <div className="font-display italic text-lg max-w-md" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
            "Alpha now lives at the edges where passive flows haven't yet commoditized intelligence."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, accent, theme }) {
  const isDark = theme === "dark";
  return (
    <div className="p-5 border-l" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: isDark ? PAPER_MUTE : "rgba(14,15,18,0.5)" }}>
        {label}
      </div>
      <div className="font-display text-3xl" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
        {value}
      </div>
    </div>
  );
}

function PositionCard({ tier, body, accent, theme, featured }) {
  const isDark = theme === "dark";
  return (
    <div
      className="rounded-2xl p-6 border relative overflow-hidden"
      style={{
        borderColor: featured ? `${accent}60` : isDark ? RULE : "rgba(14,15,18,0.1)",
        backgroundColor: featured ? `${accent}10` : isDark ? "rgba(244,239,227,0.03)" : "rgba(255,252,245,0.5)",
      }}
    >
      {featured && (
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none" style={{ backgroundColor: accent, opacity: 0.18, filter: "blur(50px)" }} />
      )}
      <div className="relative">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>
          Position
        </div>
        <div className="font-display text-xl md:text-2xl mb-3" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
          {tier}
        </div>
        <div className="font-sans text-[14px] leading-relaxed" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
          {body}
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ year, note, accent, theme }) {
  const isDark = theme === "dark";
  return (
    <div className="grid grid-cols-[80px_1fr_auto] items-center gap-6 py-5 border-b" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
      <div className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
        {year}
      </div>
      <div className="font-sans text-[15px]" style={{ color: isDark ? PAPER : INK }}>
        {note}
      </div>
      <ChevronRight className="w-4 h-4" style={{ color: isDark ? PAPER_FAINT : "rgba(14,15,18,0.3)" }} />
    </div>
  );
}

// ============================================================
// PORTAL: REAL ESTATE (VOL.02) — Commerce/portfolio archetype
// ============================================================

function RealEstatePortal({ onBack, theme }) {
  const p = PORTALS.realestate;
  const accent = p.accent;
  const isDark = theme === "dark";

  const properties = [
    { code: "TX-AUS-014", type: "Adaptive-reuse self-storage", status: "Stabilized" },
    { code: "AZ-PHX-007", type: "Obsolete commercial conversion", status: "Stabilized" },
    { code: "FL-TPA-019", type: "Adaptive-reuse self-storage", status: "Lease-up" },
    { code: "TN-NSH-022", type: "Land bank · Sunbelt", status: "Held" },
    { code: "GA-ATL-031", type: "Adaptive-reuse self-storage", status: "Acquisition" },
    { code: "TX-DAL-027", type: "Datacenter partnership", status: "Operating" },
  ];

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : PAPER, color: isDark ? PAPER : INK }}
    >
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme={theme} />

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <Kicker accent={accent}>{p.abbr} · {p.name.toUpperCase()} · ADAPTIVE-REUSE · STORAGE</Kicker>
        <BigHeadline theme={theme}>
          Infrastructure for the <em className="italic" style={{ color: accent }}>overflow.</em>
        </BigHeadline>
        <LeadPara theme={theme}>
          Housing shrinks, the addiction to accumulation doesn't. We buy functionally obsolete commercial
          buildings well below replacement cost, convert them into climate-controlled self-storage,
          and hold indefinitely — refinancing into permanent debt as the playbook compounds.
        </LeadPara>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <Stat label="Operator" value="CubeSmart" accent={accent} theme={theme} />
          <Stat label="First storage" value="2019" accent={accent} theme={theme} />
          <Stat label="Datacenter JV" value="2021" accent={accent} theme={theme} />
          <Stat label="Region" value="Sunbelt" accent={accent} theme={theme} />
        </div>

        {/* Portfolio grid */}
        <div className="mt-16">
          <Kicker accent={accent}>§02 · Portfolio</Kicker>
          <BigHeadline theme={theme}>
            Six assets, <em className="italic" style={{ color: accent }}>one playbook.</em>
          </BigHeadline>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
            {properties.map((prop) => (
              <div
                key={prop.code}
                className="p-6"
                style={{ backgroundColor: isDark ? INK : PAPER }}
              >
                <div className="flex items-start justify-between mb-3">
                  <MapPin className="w-4 h-4" style={{ color: accent }} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 rounded-full" style={{
                    color: accent,
                    backgroundColor: `${accent}18`,
                    border: `1px solid ${accent}40`,
                  }}>
                    {prop.status}
                  </span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: isDark ? PAPER_MUTE : "rgba(14,15,18,0.5)" }}>
                  {prop.code}
                </div>
                <div className="font-display text-lg leading-snug" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
                  {prop.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 border-t pt-8" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <div className="font-display italic text-lg max-w-md" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
            "Unrecreatable cost basis. Faster stabilization. Regulatory moat."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

// ============================================================
// PORTAL: EDUCATION (VOL.03) — Community archetype
// ============================================================

function EducationPortal({ onBack, theme }) {
  const p = PORTALS.education;
  const accent = p.accent;
  const isDark = theme === "dark";

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : PAPER_WARM, color: isDark ? PAPER : INK }}
    >
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme={theme} />

      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="text-center mb-16">
          <Kicker accent={accent}>{p.abbr} · {p.name.toUpperCase()} · K-20 · DECENTRALIZED</Kicker>
          <h1
            className="font-display tracking-tight mb-6 mx-auto max-w-3xl"
            style={{ color: isDark ? PAPER : INK, fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1, fontWeight: 400 }}
          >
            The new architecture of <em className="italic" style={{ color: accent }}>learning.</em>
          </h1>
          <p className="font-sans text-base md:text-[17px] leading-relaxed max-w-[58ch] mx-auto" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.72)" }}>
            By operators, for families. The next chapter of education is decentralized —
            microschools, private K-20, homeschool — unified by personalized learning that
            adapts as the student matures.
          </p>
        </div>

        {/* Toolkit bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <ToolCard
            label="The platform"
            title="K-20 adaptive learning infrastructure"
            body="The technology layer that ties microschools, private operators, and homeschool together. Built, not licensed."
            accent={accent}
            theme={theme}
            tall
          />
          <ToolCard
            label="The networks"
            title="Microschool & operator partnerships"
            body="Localized networks. Specialized private operators. We're investors, not franchisors."
            accent={accent}
            theme={theme}
          />
          <ToolCard
            label="The families"
            title="Family advisory practice"
            body="Direct work with families on the decisions that matter — choice, sequencing, succession."
            accent={accent}
            theme={theme}
          />
        </div>

        {/* Lineage row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          <LineageBlock year="2003" note="Grand Canyon University acquired" accent={accent} theme={theme} />
          <LineageBlock year="2018" note="Exit as #1 private Christian university" accent={accent} theme={theme} />
          <LineageBlock year="2023" note="K–12 platform launched" accent={accent} theme={theme} />
          <LineageBlock year="2024" note="Family advisory practice opened" accent={accent} theme={theme} />
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 border-t pt-8" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <div className="font-display italic text-lg max-w-md" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
            "Timing dictates generational success in education."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

function ToolCard({ label, title, body, accent, theme, tall }) {
  const isDark = theme === "dark";
  return (
    <div
      className={`rounded-3xl p-6 md:p-7 border ${tall ? "md:row-span-2" : ""}`}
      style={{
        borderColor: isDark ? RULE : "rgba(14,15,18,0.12)",
        backgroundColor: isDark ? "rgba(244,239,227,0.03)" : "rgba(255,252,245,0.55)",
      }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>
        {label}
      </div>
      <div className="font-display text-2xl leading-tight mb-3" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
        {title}
      </div>
      <div className="font-sans text-[14px] leading-relaxed" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.72)" }}>
        {body}
      </div>
    </div>
  );
}

function LineageBlock({ year, note, accent, theme }) {
  const isDark = theme === "dark";
  return (
    <div className="border-t pt-4" style={{ borderColor: accent }}>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: accent }}>
        {year}
      </div>
      <div className="font-sans text-[14px] leading-snug" style={{ color: isDark ? PAPER : INK }}>
        {note}
      </div>
    </div>
  );
}

// ============================================================
// PORTAL: HEALTHCARE (VOL.04) — Clinical-white theme breakout
// ============================================================

function HealthcarePortal({ onBack }) {
  const p = PORTALS.healthcare;
  const accent = p.accent;
  // This portal breaks out to a clean white theme regardless of hub theme
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#FAF8F2", color: INK }}>
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme="light" />

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <Kicker accent={accent}>{p.abbr} · {p.name.toUpperCase()} · NEURO · FUNCTIONAL · DTC</Kicker>
        <BigHeadline theme="light">
          The parallel <em className="italic" style={{ color: accent }}>health economy.</em>
        </BigHeadline>
        <LeadPara theme="light">
          The most durable specialty healthcare businesses of the next decade won't sit inside the
          pharma-insurance complex — they'll route around it. We back specialist-led platforms that
          own the protocol, the practitioner network, and the patient relationship simultaneously.
        </LeadPara>

        {/* Therapy cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: "rgba(14,15,18,0.1)" }}>
          <TherapyCard
            code="HUB.01"
            title="Specialist-anchored clinical platforms"
            body="The clinical authority is the moat. Protocol IP held at the hub; care delivered at the spokes."
            accent={accent}
          />
          <TherapyCard
            code="HUB.02"
            title="DTC funnel into clinical infrastructure"
            body="Direct-to-patient brands acquire the families. Clinical infrastructure delivers the work."
            accent={accent}
          />
          <TherapyCard
            code="HUB.03"
            title="Protocol-delivery software"
            body="Practitioner certification and the software layer that lets the protocol scale without diluting."
            accent={accent}
          />
          <TherapyCard
            code="HUB.04"
            title="Adjacent verticals"
            body="The same hub-and-spoke architecture extends into adjacent specialty categories — same playbook, different protocol."
            accent={accent}
          />
        </div>

        {/* Eligibility checklist */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <Kicker accent={accent}>§03 · What we underwrite</Kicker>
            <BigHeadline theme="light">
              We look for <em className="italic" style={{ color: accent }}>four things.</em>
            </BigHeadline>
            <p className="font-sans text-[15px] leading-relaxed mt-4" style={{ color: "rgba(14,15,18,0.7)" }}>
              Capital is patient and operationally engaged. We back systems built to last decades,
              not exits to engineer.
            </p>
          </div>
          <div>
            <ChecklistItem label="Clinical authority" body="A real specialist, not a marketer in a lab coat." accent={accent} />
            <ChecklistItem label="A protocol the hub owns" body="Defensible IP, not commodity care." accent={accent} />
            <ChecklistItem label="A practitioner network" body="Certifiable, trainable, scale-able." accent={accent} />
            <ChecklistItem label="A category under-served" body="Where conventional medicine has under-delivered for a generation." accent={accent} />
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 border-t pt-8" style={{ borderColor: "rgba(14,15,18,0.1)" }}>
          <div className="font-display italic text-lg max-w-md" style={{ color: "rgba(14,15,18,0.7)" }}>
            "Hub holds the IP. Spokes deliver the care."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

function TherapyCard({ code, title, body, accent }) {
  return (
    <div className="p-7 bg-[#FAF8F2]">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: accent }}>
        {code}
      </div>
      <div className="font-display text-xl md:text-2xl leading-snug mb-3" style={{ color: INK, fontWeight: 400 }}>
        {title}
      </div>
      <div className="font-sans text-[14px] leading-relaxed" style={{ color: "rgba(14,15,18,0.7)" }}>
        {body}
      </div>
    </div>
  );
}

function ChecklistItem({ label, body, accent }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0" style={{ borderColor: "rgba(14,15,18,0.08)" }}>
      <div
        className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full shrink-0"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: accent }}>
          {label}
        </div>
        <div className="font-sans text-[14px] leading-relaxed" style={{ color: "rgba(14,15,18,0.78)" }}>
          {body}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PORTAL: MEDIA & CONSUMER (VOL.05) — Dark-product theme breakout
// ============================================================

function MediaConsumerPortal({ onBack }) {
  const p = PORTALS.media;
  const accent = p.accent;
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#0A0B07", color: PAPER }}>
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme="dark" />

      <main className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 md:py-28">
        {/* Stacked editorial type */}
        <Kicker accent={accent}>{p.abbr} · {p.name.toUpperCase()} · CREATOR · COMMERCE · OWNED</Kicker>
        <h1
          className="font-display tracking-tight mb-2"
          style={{
            color: PAPER,
            fontSize: "clamp(3.5rem, 11vw, 11rem)",
            lineHeight: 0.86,
            letterSpacing: "-0.04em",
            fontWeight: 300,
          }}
        >
          The infrastructure
        </h1>
        <h1
          className="font-display tracking-tight mb-8 italic"
          style={{
            color: accent,
            fontSize: "clamp(3.5rem, 11vw, 11rem)",
            lineHeight: 0.86,
            letterSpacing: "-0.04em",
            fontWeight: 400,
          }}
        >
          of influence.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start mt-12">
          <p className="font-sans text-[15px] leading-relaxed" style={{ color: PAPER_DIM }}>
            Attention is the decade's most valuable commodity. Modern creators stay vulnerable
            to rented distribution. We convert raw influence into owned infrastructure — the IP,
            the direct distribution, and the physical backend behind it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(244,239,227,0.1)" }}>
            <ProductBox label="The holdco" value="2024" body="Creator DTC holdco formed" accent={accent} />
            <ProductBox label="The stack" value="2024" body="Shared e-commerce stack built" accent={accent} />
            <ProductBox label="The properties" value="2025" body="First three properties operating" accent={accent} />
          </div>
        </div>

        {/* Marquee strip */}
        <div className="mt-20 overflow-hidden border-y py-8" style={{ borderColor: "rgba(244,239,227,0.1)" }}>
          <div className="flex gap-8 whitespace-nowrap" style={{ animation: "marquee 80s linear infinite" }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8 items-center">
                {["Creator commerce", "Owned IP", "Direct distribution", "Supply chain", "Media syndicates", "Fulfillment", "Sovereign ops"].map((t) => (
                  <span key={t} className="font-display italic text-3xl md:text-5xl" style={{ color: PAPER_FAINT, fontWeight: 400 }}>
                    {t} <span style={{ color: accent }}>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between flex-wrap gap-4">
          <div className="font-display italic text-lg max-w-md" style={{ color: PAPER_DIM }}>
            "From rented distribution to sovereign operations."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function ProductBox({ label, value, body, accent }) {
  return (
    <div className="p-6" style={{ backgroundColor: "#0A0B07" }}>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: PAPER_MUTE }}>
        {label}
      </div>
      <div className="font-display text-3xl mb-1 italic" style={{ color: accent, fontWeight: 400 }}>
        {value}
      </div>
      <div className="font-sans text-[13px] leading-snug" style={{ color: PAPER_DIM }}>
        {body}
      </div>
    </div>
  );
}

// ============================================================
// PORTAL: LETTERS (VOL.06) — Curated-list archetype
// ============================================================

function LettersPortal({ onBack, theme }) {
  const p = PORTALS.letters;
  const accent = "#9A8A6B"; // a readable variant of paper-warm for accents
  const isDark = theme === "dark";

  const letters = [
    { year: "2025", title: "Storage at scale", em: "what the consolidators got right, and where they're still vulnerable", len: "14 MIN" },
    { year: "2024", title: "Operator economics", em: "why we're underwriting management teams, not assets", len: "11 MIN" },
    { year: "2023", title: "The neuro thesis", em: "a DTC funnel, a clinical spine, and the patience to wait", len: "19 MIN" },
    { year: "2022", title: "A datacenter is a real-estate trade", em: "with a power-grid covenant", len: "9 MIN" },
    { year: "2021", title: "Three things we got wrong in 2020", em: "and the call that paid for all of them", len: "12 MIN" },
    { year: "2020", title: "Recession-resistant cash flow", em: "self-storage as a defensive growth asset", len: "16 MIN" },
    { year: "2019", title: "Year one", em: "what a family office actually does when nobody's watching", len: "8 MIN" },
    { year: "2018", title: "After the exit", em: "", len: "6 MIN" },
  ];

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : PAPER, color: isDark ? PAPER : INK }}
    >
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme={theme} />

      <main className="max-w-[1000px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <Kicker accent={accent}>{p.abbr} · {p.name.toUpperCase()} · ANNUAL · SIGNED · 2018 — 2025</Kicker>
        <BigHeadline theme={theme}>
          Annual notes, <em className="italic" style={{ color: accent }}>on the record.</em>
        </BigHeadline>
        <LeadPara theme={theme}>
          One letter per year, signed and dated. The thesis we held, the mistakes we made,
          and what we did about both. Eight letters live; the next one in winter.
        </LeadPara>

        <div className="mt-16 border-t" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          {letters.map((l, i) => (
            <a
              key={l.year}
              href={`#letter-${l.year}`}
              className="group grid grid-cols-[80px_1fr_60px] md:grid-cols-[100px_1fr_80px] items-baseline gap-4 md:gap-8 py-6 md:py-8 border-b transition-colors hover:opacity-100"
              style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)", opacity: 0.92 }}
            >
              <div className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
                {l.year}
              </div>
              <div>
                <div className="font-display text-xl md:text-2xl leading-snug" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
                  {l.title}{l.em && <span style={{ color: isDark ? PAPER_MUTE : "rgba(14,15,18,0.5)" }}>:</span>}
                </div>
                {l.em && (
                  <div className="font-display italic text-base md:text-lg mt-1" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.6)" }}>
                    {l.em}
                  </div>
                )}
              </div>
              <div className="text-right font-mono text-[10px] uppercase tracking-[0.25em] flex items-center justify-end gap-2" style={{ color: isDark ? PAPER_MUTE : "rgba(14,15,18,0.5)" }}>
                <Clock className="w-3 h-3" />
                {l.len}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4">
          <div className="font-display italic text-lg max-w-md" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
            "Every realized position gets a write-up. The archive grows."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

// ============================================================
// PORTAL: DISCOVER (PR.I) — Thesis archetype
// ============================================================

function DiscoverPortal({ onBack, theme }) {
  const p = PORTALS.discover;
  const accent = p.accent;
  const isDark = theme === "dark";

  const principles = [
    { num: "01", title: "Research as posture", body: "Every letter, every position, every conversation is a read on the world we're trying to act in. We don't outsource the thinking that drives our capital." },
    { num: "02", title: "Theses in public", body: "We publish what we believe, what we've changed our mind on, and why. The 2018–2025 letter archive is the audit trail — and the filter." },
    { num: "03", title: "Inbound, not outbound", body: "The best deals find us. We've built the brand to be a magnet for operators who want to work with us — not a pitch deck looking for capital." },
  ];

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : PAPER, color: isDark ? PAPER : INK }}
    >
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme={theme} />

      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-10 mb-16">
          <div className="font-display italic" style={{ color: accent, fontSize: "clamp(72px,9vw,140px)", lineHeight: 0.85, fontWeight: 400 }}>
            I
          </div>
          <div>
            <Kicker accent={accent}>{p.abbr} · PRINCIPLE · 01 OF 04 · DISCOVER</Kicker>
            <BigHeadline theme={theme}>
              Where signal becomes <em className="italic" style={{ color: accent }}>thesis.</em>
            </BigHeadline>
            <LeadPara theme={theme}>
              We don't chase deals. We develop convictions in public — letters, theses, signals — and let the deals find us.
              Research isn't a department here; it's the posture we operate from.
            </LeadPara>
          </div>
        </div>

        <div className="space-y-px" style={{ backgroundColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          {principles.map((pr) => (
            <div key={pr.num} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 p-6 md:p-8" style={{ backgroundColor: isDark ? INK : PAPER }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                §{pr.num}
              </div>
              <div>
                <div className="font-display italic text-xl md:text-2xl mb-3" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
                  {pr.title}.
                </div>
                <div className="font-sans text-[15px] leading-relaxed max-w-[58ch]" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.72)" }}>
                  {pr.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live thesis ticker */}
        <div className="mt-16">
          <Kicker accent={accent}>§04 · Currently in market</Kicker>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ThesisChip title="Sunbelt storage" status="Active" accent={accent} theme={theme} />
            <ThesisChip title="K-20 platform infra" status="Active" accent={accent} theme={theme} />
            <ThesisChip title="Neuro DTC funnel" status="Active" accent={accent} theme={theme} />
            <ThesisChip title="Creator commerce stack" status="Live" accent={accent} theme={theme} />
            <ThesisChip title="Alt-data signals" status="Live" accent={accent} theme={theme} />
            <ThesisChip title="Datacenter land bank" status="Held" accent={accent} theme={theme} />
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 border-t pt-8" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <div className="font-display italic text-lg max-w-md" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
            "When the consensus is wrong, the spread is in being early and loud."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

function ThesisChip({ title, status, accent, theme }) {
  const isDark = theme === "dark";
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: isDark ? RULE : "rgba(14,15,18,0.12)",
        backgroundColor: isDark ? "rgba(244,239,227,0.03)" : "rgba(255,252,245,0.55)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: accent }} />
        <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {status}
        </div>
      </div>
      <div className="font-display text-lg" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
        {title}
      </div>
    </div>
  );
}

// ============================================================
// PORTAL: DEVELOP (PR.II) — Playbook / community archetype
// ============================================================

function DevelopPortal({ onBack, theme }) {
  const p = PORTALS.develop;
  const accent = p.accent;
  const isDark = theme === "dark";

  const moves = [
    { phase: "01", title: "Pencil-down underwriting", body: "The model is run by the people who have to live with the call. No hand-offs between investment and asset management." },
    { phase: "02", title: "Hands-on, when invited", body: "We bring more than a check. Operating playbooks, talent networks, and the kind of cap-table presence that helps, not hassles." },
    { phase: "03", title: "Patient, on a schedule", body: "Long-duration capital with explicit decision gates. Patience without drift — we know what we're waiting for and when to stop waiting." },
  ];

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : PAPER, color: isDark ? PAPER : INK }}
    >
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme={theme} />

      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-10 mb-12">
          <div className="font-display italic" style={{ color: accent, fontSize: "clamp(72px,9vw,140px)", lineHeight: 0.85, fontWeight: 400 }}>
            II
          </div>
          <div>
            <Kicker accent={accent}>{p.abbr} · PRINCIPLE · 02 OF 04 · DEVELOP</Kicker>
            <BigHeadline theme={theme}>
              Where capital becomes <em className="italic" style={{ color: accent }}>operation.</em>
            </BigHeadline>
            <LeadPara theme={theme}>
              The wire clears, the work begins. Pencil-down underwriting, hands-on operator support,
              and the kind of capital that walks the floor before it asks for a board seat.
            </LeadPara>
          </div>
        </div>

        {/* The three moves, as numbered cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {moves.map((m) => (
            <div
              key={m.phase}
              className="rounded-3xl p-7 border h-full flex flex-col"
              style={{
                borderColor: isDark ? RULE : "rgba(14,15,18,0.12)",
                backgroundColor: isDark ? "rgba(244,239,227,0.03)" : "rgba(255,252,245,0.55)",
              }}
            >
              <div
                className="font-display italic mb-6"
                style={{ color: accent, fontSize: "48px", lineHeight: 1, fontWeight: 400 }}
              >
                /{m.phase}
              </div>
              <div className="font-display italic text-xl mb-3" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
                {m.title}.
              </div>
              <div className="font-sans text-[14px] leading-relaxed" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.72)" }}>
                {m.body}
              </div>
            </div>
          ))}
        </div>

        {/* Operator roster */}
        <div className="mt-16">
          <Kicker accent={accent}>§04 · The operators</Kicker>
          <BigHeadline theme={theme}>
            We back <em className="italic" style={{ color: accent }}>builders.</em>
          </BigHeadline>
          <div className="mt-8 border-t" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
            <OperatorRow num="#001" name="Grand Canyon University" cat="Education" era="2003 — 2018" accent={accent} theme={theme} />
            <OperatorRow num="#017" name="Self-Storage Portfolio" cat="Real Estate" era="2019 —" accent={accent} theme={theme} />
            <OperatorRow num="#023" name="Neuro Brand Hub" cat="Healthcare" era="2022 —" accent={accent} theme={theme} />
            <OperatorRow num="#028" name="K-20 Platform" cat="Education" era="2023 —" accent={accent} theme={theme} />
            <OperatorRow num="#031" name="Family Advisory" cat="Education" era="2024 —" accent={accent} theme={theme} />
            <OperatorRow num="#034" name="Creator DTC Holdco" cat="Media & Consumer" era="2024 —" accent={accent} theme={theme} />
            <OperatorRow num="#037" name="Signals Engine" cat="Capital Markets" era="2025 —" accent={accent} theme={theme} />
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 border-t pt-8" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <div className="font-display italic text-lg max-w-md" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
            "The kind of capital that walks the floor before it asks for a board seat."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

function OperatorRow({ num, name, cat, era, accent, theme }) {
  const isDark = theme === "dark";
  return (
    <div className="grid grid-cols-[60px_1fr_auto] md:grid-cols-[80px_1fr_180px_120px] items-center gap-4 py-5 border-b" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
      <div className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: accent }}>
        {num}
      </div>
      <div className="font-display text-base md:text-lg" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
        {name}
      </div>
      <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: isDark ? PAPER_MUTE : "rgba(14,15,18,0.5)" }}>
        {cat}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-right" style={{ color: isDark ? PAPER_MUTE : "rgba(14,15,18,0.5)" }}>
        {era}
      </div>
    </div>
  );
}

// ============================================================
// PORTAL: DELIVER (PR.III) — Ledger archetype
// ============================================================

function DeliverPortal({ onBack, theme }) {
  const p = PORTALS.deliver;
  const accent = p.accent;
  const isDark = theme === "dark";

  return (
    <div
      className="relative min-h-screen transition-colors duration-500"
      style={{ backgroundColor: isDark ? INK : PAPER, color: isDark ? PAPER : INK }}
    >
      <ArrivalBanner accent={accent} />
      <PortalNav onBack={onBack} accent={accent} abbr={p.abbr} theme={theme} />

      <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-10 mb-12">
          <div className="font-display italic" style={{ color: accent, fontSize: "clamp(72px,9vw,140px)", lineHeight: 0.85, fontWeight: 400 }}>
            III
          </div>
          <div>
            <Kicker accent={accent}>{p.abbr} · PRINCIPLE · 03 OF 04 · DELIVER</Kicker>
            <BigHeadline theme={theme}>
              Where work becomes <em className="italic" style={{ color: accent }}>outcome.</em>
            </BigHeadline>
            <LeadPara theme={theme}>
              The chart is the proof. Distributions, exits, realized returns — and the boring
              distribution waterfalls that get them there. We mark the book to results, not narrative.
            </LeadPara>
          </div>
        </div>

        {/* Stat board */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <Stat label="DPI > TVPI" value="Always" accent={accent} theme={theme} />
          <Stat label="Realized writeups" value="100%" accent={accent} theme={theme} />
          <Stat label="Reporting cadence" value="Annual" accent={accent} theme={theme} />
          <Stat label="Plain English" value="Always" accent={accent} theme={theme} />
        </div>

        {/* Three moves */}
        <div className="mt-16 space-y-px" style={{ backgroundColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <DeliverRow
            num="/01"
            title="Mark to results"
            body="DPI before TVPI. Returned capital is the only number that compounds, and the only number we lead with."
            accent={accent}
            theme={theme}
          />
          <DeliverRow
            num="/02"
            title="Waterfalls in plain English"
            body="Distributions and reporting written for a human, not a footnote. If the structure can't be explained on a phone call, the structure is wrong."
            accent={accent}
            theme={theme}
          />
          <DeliverRow
            num="/03"
            title="The letter at the end"
            body="Every realized position gets a write-up: what worked, what didn't, what we'd do differently. The archive grows. So does the discipline."
            accent={accent}
            theme={theme}
          />
        </div>

        {/* Pulled quote */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-[40px_1fr] gap-6 items-start">
          <Quote className="w-8 h-8" style={{ color: accent }} />
          <div>
            <div
              className="font-display italic leading-tight"
              style={{ color: isDark ? PAPER : INK, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400 }}
            >
              "If the structure can't be explained on a phone call, the structure is wrong."
            </div>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
              — From the 2023 Annual Letter
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between flex-wrap gap-4 border-t pt-8" style={{ borderColor: isDark ? RULE : "rgba(14,15,18,0.1)" }}>
          <div className="font-display italic text-lg max-w-md" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.7)" }}>
            "Returned capital is the only number that compounds."
          </div>
          <PortalCTA href={p.href} accent={accent} />
        </div>
      </main>
    </div>
  );
}

function DeliverRow({ num, title, body, accent, theme }) {
  const isDark = theme === "dark";
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-10 p-6 md:p-8" style={{ backgroundColor: isDark ? INK : PAPER }}>
      <div className="font-display italic" style={{ color: accent, fontSize: "clamp(40px,5vw,68px)", lineHeight: 1, fontWeight: 400 }}>
        {num}
      </div>
      <div>
        <div className="font-display italic text-xl md:text-2xl mb-3" style={{ color: isDark ? PAPER : INK, fontWeight: 400 }}>
          {title}.
        </div>
        <div className="font-sans text-[15px] leading-relaxed max-w-[60ch]" style={{ color: isDark ? PAPER_DIM : "rgba(14,15,18,0.72)" }}>
          {body}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TRAVEL CURTAIN — accent-colored sheet sweeps up on portal click
// ============================================================

function TravelCurtain({ active, accent, onComplete }) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {active && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ backgroundColor: accent }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/80"
            >
              Opening volume
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// ROOT — LopesCapitalHub
// ============================================================

const PORTAL_COMPONENTS = {
  capital: CapitalMarketsPortal,
  realestate: RealEstatePortal,
  education: EducationPortal,
  healthcare: HealthcarePortal,
  media: MediaConsumerPortal,
  letters: LettersPortal,
  discover: DiscoverPortal,
  develop: DevelopPortal,
  deliver: DeliverPortal,
};

export default function LopesCapitalHub() {
  const [activeKey, setActiveKey] = useState(null);
  const [pendingKey, setPendingKey] = useState(null);
  const [curtain, setCurtain] = useState(false);
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleNavigate = (key) => {
    setPendingKey(key);
    setCurtain(true);
    // Switch the active portal mid-curtain so the curtain's exit reveals the new view
    setTimeout(() => {
      setActiveKey(key);
      setCurtain(false);
    }, 600);
  };

  const handleBack = () => {
    setCurtain(true);
    setTimeout(() => {
      setActiveKey(null);
      setPendingKey(null);
      setCurtain(false);
    }, 600);
  };

  const ActivePortal = activeKey ? PORTAL_COMPONENTS[activeKey] : null;
  const curtainAccent = pendingKey ? PORTALS[pendingKey].accent : PURPLE_2;

  return (
    <>
      <FontStack />
      {ActivePortal ? (
        <ActivePortal onBack={handleBack} theme={theme} />
      ) : (
        <HubView onNavigate={handleNavigate} theme={theme} toggleTheme={toggleTheme} />
      )}
      <TravelCurtain active={curtain} accent={curtainAccent} />
    </>
  );
}
