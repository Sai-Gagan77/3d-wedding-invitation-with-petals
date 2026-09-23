import { useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import mandap from "../assets/mandap.jpg";
import coupleCutout from "../assets/couple.png";
import PetalCanvas from "./PetalCanvas";
import { Monogram } from "./ui";

export default function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);

  // Direct DOM references for 60fps GPU transforms (zero React re-renders, zero glitching)
  const bgInnerRef = useRef<HTMLDivElement | null>(null);
  const figureInnerRef = useRef<HTMLDivElement | null>(null);
  const shadowInnerRef = useRef<HTMLDivElement | null>(null);
  const frontPetalsRef = useRef<HTMLDivElement | null>(null);

  // Tilt targets and smoothed values
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const windTiltRef = useRef(0);

  // Silky smooth 60/120fps GPU compositor loop
  useEffect(() => {
    let raf = 0;
    const lerp = reduced ? 1 : 0.1;

    const tick = () => {
      // Smooth lerp
      currentX.current += (targetX.current - currentX.current) * lerp;
      currentY.current += (targetY.current - currentY.current) * lerp;

      const cx = Number.isFinite(currentX.current) ? currentX.current : 0;
      const cy = Number.isFinite(currentY.current) ? currentY.current : 0;

      windTiltRef.current = cx;

      // Apply hardware-accelerated 3D transforms directly to DOM nodes
      if (figureInnerRef.current) {
        // Couple tilts in 3D perspective
        const coupleTranslateX = cx * 24;
        const coupleTranslateY = cy * 12;
        const rotateY = cx * 8.5; // degrees roll
        const rotateX = -cy * 6.5; // degrees pitch
        figureInnerRef.current.style.transform = `translate3d(${coupleTranslateX.toFixed(2)}px, ${coupleTranslateY.toFixed(2)}px, 0) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`;
      }

      if (bgInnerRef.current) {
        // Mandap background moves in counter-parallax
        const bgTranslateX = -cx * 18;
        const bgTranslateY = -cy * 12;
        bgInnerRef.current.style.transform = `translate3d(${bgTranslateX.toFixed(2)}px, ${bgTranslateY.toFixed(2)}px, 0) scale(1.12)`;
      }

      if (shadowInnerRef.current) {
        // Contact stage shadow shifts optically
        const shadowX = -cx * 10;
        const scaleX = Math.max(0.7, 1 - Math.abs(cx) * 0.1);
        shadowInnerRef.current.style.transform = `translate3d(${shadowX.toFixed(2)}px, 0, 0) scaleX(${scaleX.toFixed(2)})`;
      }

      if (frontPetalsRef.current) {
        const frontX = cx * 32;
        const frontY = cy * 18;
        frontPetalsRef.current.style.transform = `translate3d(${frontX.toFixed(2)}px, ${frontY.toFixed(2)}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Mobile Device Orientation (Gyroscope tilt by default)
  useEffect(() => {
    if (reduced) return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      if (!Number.isFinite(e.gamma) || !Number.isFinite(e.beta)) return;

      // Gamma = left-to-right phone roll (-90 to +90). Clamped to +/- 30 deg
      const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
      targetX.current = clampedGamma / 30;

      // Beta = front-to-back phone pitch. Natural portrait holding angle is ~45 deg
      const naturalPitch = 45;
      const clampedBeta = Math.max(naturalPitch - 30, Math.min(naturalPitch + 30, e.beta));
      targetY.current = (clampedBeta - naturalPitch) / 30;
    };

    // 1. Android & modern browsers support deviceorientation automatically
    if (
      typeof window !== "undefined" &&
      window.DeviceOrientationEvent &&
      typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: () => void })
        .requestPermission !== "function"
    ) {
      window.addEventListener("deviceorientation", onOrientation, true);
    }

    // 2. iOS 13+ Safari requires silent user interaction permission
    const requestiOSPermission = async () => {
      const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DeviceOrientation?.requestPermission === "function") {
        try {
          const res = await DeviceOrientation.requestPermission();
          if (res === "granted") {
            window.addEventListener("deviceorientation", onOrientation, true);
          }
        } catch {
          // ignore error if dismissed
        }
      }
    };

    window.addEventListener("touchstart", requestiOSPermission, { once: true, passive: true });
    window.addEventListener("pointerdown", requestiOSPermission, { once: true, passive: true });

    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("touchstart", requestiOSPermission);
      window.removeEventListener("pointerdown", requestiOSPermission);
    };
  }, [reduced]);

  // Touch drag / Pointer fallback (works on desktop or when device is flat)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX.current = Math.max(-1, Math.min(1, x));
      targetY.current = Math.max(-1, Math.min(1, y));
    },
    [reduced],
  );

  const handlePointerLeave = useCallback(() => {
    // Only reset if on desktop mouse
    targetX.current = 0;
    targetY.current = 0;
  }, []);

  // Scroll Parallax (Smoothly isolated on outer wrappers so it never conflicts with tilt)
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 120]);
  const figureScrollY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : -55]);
  const typeScrollY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 35]);
  const typeFade = useTransform(scrollY, [0, 520], [1, 0]);

  return (
    <header
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative z-0 h-[100svh] min-h-[640px] w-full overflow-hidden bg-stage select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          PLATE 1: MANDAP BACKGROUND (Farthest 3D Layer, z-0)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: bgScrollY }}
        className="absolute inset-0 overflow-hidden will-change-transform"
      >
        <div
          ref={bgInnerRef}
          className="h-full w-full will-change-transform"
          style={{ transform: "scale(1.12)" }}
        >
          <img
            src={mandap}
            alt="The wedding mandap dressed with jasmine and rose garlands, brass oil lamps lit"
            className="h-full w-full object-cover object-top filter brightness-[0.96] contrast-[1.04]"
            loading="eager"
            decoding="async"
          />
        </div>
      </motion.div>

      {/* Atmospheric warm lighting & depth vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_35%,rgba(36,18,7,0.15)_0%,rgba(36,18,7,0.08)_45%,rgba(36,18,7,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(25,12,5,0.65)_0%,rgba(25,12,5,0.18)_30%,rgba(25,12,5,0)_60%,rgba(25,12,5,0.85)_100%)]" />

      {/* ─────────────────────────────────────────────────────────────
          TYPOGRAPHY PLANE (Behind Couple, z-10)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: typeScrollY, opacity: typeFade }}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-full"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(9rem,42vw,14rem)] leading-none text-gold/20 italic select-none"
        >
          &amp;
        </span>

        <div className="relative px-5 pt-[3.5svh] text-center">
          <p className="font-tamil text-[0.95rem] leading-relaxed tracking-wide text-gold-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            பெருமையுடன் அழைக்கிறோம்
          </p>
          <p className="label mt-2 text-paper/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Together with their families
          </p>

          <h1 className="mt-4 font-display text-paper">
            <span className="block text-[clamp(2.8rem,14vw,4.8rem)] leading-[0.88] font-light tracking-tight [text-shadow:0_3px_25px_rgba(15,7,2,0.95)]">
              Aadhira
            </span>
            <span className="my-1.5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold-light/60 sm:w-14" />
              <span className="font-display text-[1.5rem] text-gold-light italic drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-[1.9rem]">
                weds
              </span>
              <span className="h-px w-8 bg-gold-light/60 sm:w-14" />
            </span>
            <span className="block text-[clamp(2.8rem,14vw,4.8rem)] leading-[0.88] font-light tracking-tight [text-shadow:0_3px_25px_rgba(15,7,2,0.95)]">
              Karthikeya
            </span>
          </h1>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          PRIMARY LIGHT PINK ROSE PETAL SHOWER (z-20)
          Falls continuously from top, passing BETWEEN background and couple!
          ───────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <PetalCanvas
          className="h-full w-full"
          count={50}
          minSize={13}
          maxSize={35}
          speed={1.05}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PLATE 2: THE COUPLE CUTOUT (z-30)
          Tilts in 3D perspective by default when the phone is tilted!
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: figureScrollY }}
        className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center will-change-transform"
      >
        <div
          ref={figureInnerRef}
          className="relative flex h-full w-full items-end justify-center will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Ground contact shadow dynamically shifting with the 3D tilt */}
          <div
            ref={shadowInnerRef}
            className="absolute bottom-[3%] h-9 w-[320px] max-w-[80vw] rounded-[100%] bg-black/60 blur-xl will-change-transform sm:bottom-[4%] sm:w-[420px]"
          />

          <img
            src={coupleCutout}
            alt="Aadhira and Karthikeya in traditional golden wedding silk and fresh lotus garlands"
            className="h-[65%] max-h-[82%] min-h-[340px] w-auto max-w-none object-contain object-bottom drop-shadow-[0_14px_38px_rgba(20,8,3,0.55)] select-none will-change-transform"
            loading="eager"
            decoding="async"
          />
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          FOREGROUND FLOATING LIGHT PINK PETALS (z-40)
          Soft out-of-focus camera petals passing in front
          ───────────────────────────────────────────────────────────── */}
      <div
        ref={frontPetalsRef}
        className="pointer-events-none absolute inset-0 z-40 opacity-80 blur-[2.2px] will-change-transform"
      >
        <PetalCanvas
          className="h-full w-full"
          count={9}
          minSize={40}
          maxSize={75}
          speed={1.65}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM BANNER & EVENT DETAILS (z-50)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-50 bg-[linear-gradient(to_top,rgba(26,11,4,0.96)_0%,rgba(26,11,4,0.78)_48%,rgba(26,11,4,0)_100%)] px-5 pb-14 pt-24 pointer-events-auto">
        <div className="mx-auto flex max-w-lg items-end justify-between gap-4 border-t border-gold/35 pt-4">
          <div>
            <p className="label text-gold-light/90">Muhurtham</p>
            <p className="tnum mt-1 font-display text-2xl font-medium text-paper">10:48 AM</p>
          </div>
          <Monogram className="h-10 w-10 shrink-0 opacity-90" stroke="#E4C076" />
          <div className="text-right">
            <p className="label text-gold-light/90">Saturday · Chennai</p>
            <p className="tnum mt-1 font-display text-2xl font-medium text-paper">21 · 11 · 2026</p>
          </div>
        </div>
      </div>
    </header>
  );
}
