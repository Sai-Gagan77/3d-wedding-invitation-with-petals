import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type Tone = [string, string];

const TONES: Tone[] = [
  // Deep Velvet Rose (South Indian bridal garland red)
  ["#BA1B38", "#5E0919"],
  ["#D6284C", "#7A0C22"],
  // Lotus Pink (matching the couple's lotus garlands)
  ["#FF758F", "#A4133C"],
  ["#FFA4B6", "#D6284C"],
  // Soft Rose Blush
  ["#FBB1BD", "#C9184A"],
  // Golden Marigold
  ["#FFB703", "#C75100"],
  // Fragrant Jasmine / Sambangi white
  ["#FFFDF5", "#E8D5B7"],
];

type Petal = {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  rot: number;
  rotSpeed: number;
  flipPhase: number;
  flipSpeed: number;
  tone: Tone;
  alpha: number;
  rollAngle: number;
  rollSpeed: number;
};

type Props = {
  /** number of petals on screen */
  count?: number;
  minSize?: number;
  maxSize?: number;
  /** fall speed multiplier */
  speed?: number;
  className?: string;
  style?: CSSProperties;
};

function createPetal(
  w: number,
  h: number,
  min: number,
  max: number,
  speed: number,
  seeded: boolean,
): Petal {
  const size = min + Math.random() * (max - min);
  const depth = max > min ? (size - min) / (max - min) : 0.5;
  return {
    x: Math.random() * (w + 100) - 50,
    y: seeded ? Math.random() * h : -size - Math.random() * h * 0.4,
    size,
    vy: (28 + depth * 55) * speed,
    vx: (Math.random() - 0.5) * 12,
    sway: 18 + Math.random() * 42,
    swaySpeed: 0.35 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.9,
    flipPhase: Math.random() * Math.PI * 2,
    flipSpeed: 0.6 + Math.random() * 1.3,
    rollAngle: Math.random() * Math.PI * 2,
    rollSpeed: (Math.random() - 0.5) * 0.8,
    tone: TONES[Math.floor(Math.random() * TONES.length)],
    alpha: 0.7 + depth * 0.3,
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal, t: number) {
  const s = p.size;
  ctx.save();
  const swayOffset = Math.sin(t * p.swaySpeed + p.phase) * p.sway;
  ctx.translate(p.x + swayOffset, p.y);
  ctx.rotate(p.rot);

  // 3D tumbling: foreshortens as it spins along horizontal and diagonal planes
  const flip = Math.cos(t * p.flipSpeed + p.flipPhase);
  const verticalScale = 0.22 + 0.78 * Math.abs(flip);
  const roll = Math.sin(t * p.rollSpeed + p.rollAngle) * 0.2;

  ctx.transform(1, roll, 0, verticalScale, 0, 0);
  ctx.globalAlpha = p.alpha;

  // Dynamic lighting: petal brightens as face catches light
  const lightFactor = Math.abs(flip);
  const g = ctx.createLinearGradient(0, -0.6 * s, 0, 0.6 * s);
  g.addColorStop(0, p.tone[0]);
  g.addColorStop(1, p.tone[1]);

  // Petal teardrop silhouette
  ctx.beginPath();
  ctx.moveTo(0, -0.58 * s);
  ctx.bezierCurveTo(0.5 * s, -0.28 * s, 0.44 * s, 0.32 * s, 0, 0.55 * s);
  ctx.bezierCurveTo(-0.44 * s, 0.32 * s, -0.5 * s, -0.28 * s, 0, -0.58 * s);
  ctx.closePath();

  ctx.fillStyle = g;
  ctx.shadowColor = "rgba(45, 12, 18, 0.4)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Delicate center vein
  ctx.beginPath();
  ctx.moveTo(0, -0.45 * s);
  ctx.quadraticCurveTo(0.12 * s * flip, 0.02 * s, 0, 0.45 * s);
  ctx.strokeStyle = `rgba(255, 245, 230, ${0.28 * lightFactor})`;
  ctx.lineWidth = Math.max(0.65, s * 0.038);
  ctx.stroke();

  // Subtle highlight gleam
  if (lightFactor > 0.6) {
    ctx.beginPath();
    ctx.ellipse(0.08 * s, -0.15 * s, 0.2 * s, 0.35 * s, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${(lightFactor - 0.6) * 0.25})`;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * A drifting layer of 3D rose petals.
 * Placed between the backdrop mandap and the foreground couple cut-out so the
 * petals visibly fall THROUGH the spatial gap.
 */
export default function PetalCanvas({
  count = 32,
  minSize = 13,
  maxSize = 34,
  speed = 1,
  className = "",
  style,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let petals: Petal[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    let last = performance.now();
    let elapsed = 0;

    const seed = (initial: boolean) => {
      petals = Array.from({ length: count }, () =>
        createPetal(w, h, minSize, maxSize, speed, initial),
      );
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width || window.innerWidth);
      h = Math.max(1, rect.height || window.innerHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(true);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      ctx.clearRect(0, 0, w, h);

      for (const p of petals) {
        p.y += p.vy * dt;
        p.x += p.vx * dt;
        p.rot += p.rotSpeed * dt;

        if (p.y - p.size > h + 25) {
          const fresh = createPetal(w, h, minSize, maxSize, speed, false);
          p.x = fresh.x;
          p.y = -p.size;
          p.size = fresh.size;
          p.vy = fresh.vy;
          p.vx = fresh.vx;
          p.sway = fresh.sway;
          p.swaySpeed = fresh.swaySpeed;
          p.phase = fresh.phase;
          p.rot = fresh.rot;
          p.rotSpeed = fresh.rotSpeed;
          p.flipPhase = fresh.flipPhase;
          p.flipSpeed = fresh.flipSpeed;
          p.rollAngle = fresh.rollAngle;
          p.rollSpeed = fresh.rollSpeed;
          p.tone = fresh.tone;
          p.alpha = fresh.alpha;
        }
        drawPetal(ctx, p, elapsed);
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      ctx.clearRect(0, 0, w, h);
      petals.forEach((p) => drawPetal(ctx, p, p.phase));
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, minSize, maxSize, speed]);

  return <canvas ref={ref} aria-hidden="true" className={className} style={style} />;
}

