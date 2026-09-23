import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import mandap from "../assets/mandap.jpg";
import coupleCutout from "../assets/couple.png";
import PetalCanvas from "./PetalCanvas";
import { Monogram } from "./ui";

export default function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);

  // Direct DOM references for 60/120fps GPU transforms (zero React re-renders, zero glitching)
  const bgInnerRef = useRef<HTMLDivElement | null>(null);
  const figureInnerRef = useRef<HTMLDivElement | null>(null);
  const shadowInnerRef = useRef<HTMLDivElement | null>(null);
  const frontPetalsRef = useRef<HTMLDivElement | null>(null);

  // Whether iOS requires explicit tap to grant motion permission
  const [needsIosPermission, setNeedsIosPermission] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);

  // Tilt targets and smoothed interpolation values
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  // Touch tracking for drag fallback
  const touchStart = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);

  // Silky smooth 60/120fps GPU compositor loop
  useEffect(() => {
    let raf = 0;
    const lerp = reduced ? 1 : 0.12;

    const tick = () => {
      currentX.current += (targetX.current - currentX.current) * lerp;
      currentY.current += (targetY.current - currentY.current) * lerp;

      const cx = Number.isFinite(currentX.current) ? currentX.current : 0;
      const cy = Number.isFinite(currentY.current) ? currentY.current : 0;

      // 1. Couple tilts in true 3D perspective from their stage footing
      if (figureInnerRef.current) {
        const coupleTranslateX = cx * 32;
        const coupleTranslateY = cy * 16;
        const rotateY = cx * 12.0; // prominent degrees roll
        const rotateX = -cy * 8.5; // prominent degrees pitch
        figureInnerRef.current.style.transform = `perspective(750px) translate3d(${coupleTranslateX.toFixed(2)}px, ${coupleTranslateY.toFixed(2)}px, 0) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`;
      }

      // 2. Mandap background moves in counter-parallax (deep 3D stage depth)
      if (bgInnerRef.current) {
        const bgTranslateX = -cx * 22;
        const bgTranslateY = -cy * 14;
        bgInnerRef.current.style.transform = `translate3d(${bgTranslateX.toFixed(2)}px, ${bgTranslateY.toFixed(2)}px, 0) scale(1.15)`;
      }

      // 3. Stage contact shadow beneath feet shifts dynamically
      if (shadowInnerRef.current) {
        const shadowX = -cx * 14;
        const scaleX = Math.max(0.65, 1 - Math.abs(cx) * 0.12);
        shadowInnerRef.current.style.transform = `translate3d(${shadowX.toFixed(2)}px, 0, 0) scaleX(${scaleX.toFixed(2)})`;
      }

      // 4. Foreground petals float with camera parallax
      if (frontPetalsRef.current) {
        const frontX = cx * 40;
        const frontY = cy * 22;
        frontPetalsRef.current.style.transform = `translate3d(${frontX.toFixed(2)}px, ${frontY.toFixed(2)}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Mobile Device Orientation (Gyroscope tilt)
  useEffect(() => {
    if (reduced) return;

    let baseGamma: number | null = null;
    let baseBeta: number | null = null;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      if (!Number.isFinite(e.gamma) || !Number.isFinite(e.beta)) return;

      setGyroActive(true);
      setNeedsIosPermission(false);

      // Calibrate base holding angle on first measurement
      if (baseGamma === null) baseGamma = e.gamma;
      if (baseBeta === null) baseBeta = e.beta;

      // Slow drift centering so neutral angle comfortably adapts to user posture
      baseGamma += (e.gamma - baseGamma) * 0.003;
      baseBeta += (e.beta - baseBeta) * 0.003;

      // Relative delta from natural holding position
      const deltaGamma = e.gamma - baseGamma;
      const deltaBeta = e.beta - baseBeta;

      // 15 degrees tilt maps to full 3D range (-1 to 1)
      targetX.current = Math.max(-1, Math.min(1, deltaGamma / 15));
      targetY.current = Math.max(-1, Math.min(1, deltaBeta / 15));
    };

    // Check if iOS 13+ permission API exists
    const hasIosPermissionApi =
      typeof window !== "undefined" &&
      typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: () => void })
        ?.requestPermission === "function";

    if (hasIosPermissionApi) {
      setNeedsIosPermission(true);
    } else {
      // Android and standard browsers: listen immediately by default
      window.addEventListener("deviceorientation", onOrientation, true);
    }

    // Function to activate on user tap (required by Apple iOS)
    const requestIosPermission = async () => {
      const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DeviceOrientation?.requestPermission === "function") {
        try {
          const res = await DeviceOrientation.requestPermission();
          if (res === "granted") {
            setNeedsIosPermission(false);
            setGyroActive(true);
            window.addEventListener("deviceorientation", onOrientation, true);
          }
        } catch {
          // User dismissed or error
        }
      }
    };

    // Attach to document click/touchend so ANY tap on the screen requests iOS permission seamlessly
    const handleDocumentClick = () => {
      if (hasIosPermissionApi) {
        requestIosPermission();
      }
    };

    window.addEventListener("click", handleDocumentClick, { passive: true });
    window.addEventListener("touchend", handleDocumentClick, { passive: true });

    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
      window.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("touchend", handleDocumentClick);
    };
  }, [reduced]);

  // Touch drag / Pointer fallback (works on desktop or before gyro is activated)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isTouching.current = true;
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    // Normalized by half screen width
    targetX.current = Math.max(-1, Math.min(1, dx / (window.innerWidth * 0.35)));
    targetY.current = Math.max(-1, Math.min(1, dy / (window.innerHeight * 0.35)));
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
    if (!gyroActive) {
      targetX.current = 0;
      targetY.current = 0;
    }
  };

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
    if (!gyroActive) {
      targetX.current = 0;
      targetY.current = 0;
    }
  }, [gyroActive]);

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative z-0 h-[100svh] min-h-[640px] w-full overflow-hidden bg-stage select-none cursor-pointer"
    >
      {/* ─────────────────────────────────────────────────────────────
          iOS SAFARI 3D ACTIVATION HINT (Appears only on iOS until tapped)
          ───────────────────────────────────────────────────────────── */}
      {needsIosPermission && (
        <div className="absolute top-5 right-5 z-40 animate-pulse pointer-events-none">
          <div className="rounded-full border border-gold/50 bg-kumkum-dark/95 px-3.5 py-1.5 text-[0.72rem] font-medium tracking-wide text-gold-light shadow-[0_4px_20px_rgba(20,8,3,0.6)] backdrop-blur-md">
            ✨ Tap screen to enable 3D Tilt
          </div>
        </div>
      )}

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
          style={{ transform: "scale(1.15)" }}
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
          Tilts in 3D perspective from their feet when the phone is tilted!
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
            transformOrigin: "center 85%", // Tilts naturally around stage footing
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
