import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import mandap from "../assets/mandap.jpg";
import coupleCutout from "../assets/couple.png";
import PetalCanvas from "./PetalCanvas";
import { Monogram } from "./ui";
import { spatialAudio } from "../utils/spatialAudio";

export default function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);

  // Normalized 3D tilt coordinates (-1 to +1)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hasGyro, setHasGyro] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showTiltHint, setShowTiltHint] = useState(true);

  // Spring-lerp targets for buttery smooth 60fps tracking
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  // Smooth interpolation frame loop
  useEffect(() => {
    let raf = 0;
    const lerp = 0.12;

    const tick = () => {
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * lerp;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * lerp;

      const nextX = Number(currentTilt.current.x.toFixed(4));
      const nextY = Number(currentTilt.current.y.toFixed(4));

      setTilt({ x: nextX, y: nextY });

      // Live spatial audio panning according to phone tilt
      if (spatialAudio.getStatus()) {
        spatialAudio.updateSpatialPan(nextX, nextY);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Standard DeviceOrientation listener (Android & desktop emulators)
  useEffect(() => {
    if (reduced) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      setHasGyro(true);

      // Gamma = left-to-right phone roll (-90 to 90). Clamped to comfortable +/- 30 deg
      const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
      const normX = clampedGamma / 30;

      // Beta = front-to-back phone pitch. Natural portrait holding angle is ~45 deg
      const naturalPitch = 45;
      const clampedBeta = Math.max(naturalPitch - 30, Math.min(naturalPitch + 30, e.beta));
      const normY = (clampedBeta - naturalPitch) / 30;

      targetTilt.current = { x: normX, y: normY };
    };

    // Auto-listen if permission API is not required (e.g., Android Chrome)
    if (
      typeof window !== "undefined" &&
      window.DeviceOrientationEvent &&
      typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: () => void })
        .requestPermission !== "function"
    ) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [reduced]);

  // Request iOS Gyroscope permission + toggle Spatial Audio
  const toggleSpatialExperience = async () => {
    setShowTiltHint(false);

    // 1. Request iOS 13+ DeviceOrientation permission on user tap
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DeviceOrientation?.requestPermission === "function") {
      try {
        const res = await DeviceOrientation.requestPermission();
        if (res === "granted") {
          setHasGyro(true);
          const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma === null || e.beta === null) return;
            const clampedGamma = Math.max(-30, Math.min(30, e.gamma));
            const normX = clampedGamma / 30;
            const naturalPitch = 45;
            const clampedBeta = Math.max(15, Math.min(75, e.beta));
            const normY = (clampedBeta - naturalPitch) / 30;
            targetTilt.current = { x: normX, y: normY };
          };
          window.addEventListener("deviceorientation", handleOrientation, true);
        }
      } catch (err) {
        console.warn("DeviceOrientation permission error:", err);
      }
    }

    // 2. Toggle Spatial Audio Engine
    if (isAudioPlaying) {
      spatialAudio.stop();
      setIsAudioPlaying(false);
    } else {
      const started = await spatialAudio.start();
      if (started) {
        setIsAudioPlaying(true);
        spatialAudio.playSpatialChime(targetTilt.current.x);
      }
    }
  };

  // Pointer / Touch fallback when dragging or hovering on desktop / mobile
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetTilt.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    },
    [reduced],
  );

  const handlePointerLeave = useCallback(() => {
    if (!hasGyro) {
      targetTilt.current = { x: 0, y: 0 };
    }
  }, [hasGyro]);

  // Click on stage plays a spatial temple chime at the tapped X position
  const handleStageClick = (e: React.MouseEvent) => {
    if (!isAudioPlaying) {
      toggleSpatialExperience();
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      spatialAudio.playSpatialChime(clickX);
    }
  };

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 130]);
  const bgScale = useTransform(scrollY, [0, 900], [1.12, reduced ? 1.12 : 1.2]);
  const figureY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : -60]);
  const typeY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 35]);
  const typeFade = useTransform(scrollY, [0, 520], [1, 0]);

  // 3D Parallax Offsets driven by Phone Tilt / Pointer
  const bgParallaxX = reduced ? 0 : -tilt.x * 20;
  const bgParallaxY = reduced ? 0 : -tilt.y * 14;

  const figureParallaxX = reduced ? 0 : tilt.x * 24;
  const figureParallaxY = reduced ? 0 : tilt.y * 14;
  const figureRotateY = reduced ? 0 : tilt.x * 7.5; // degrees tilt left/right
  const figureRotateX = reduced ? 0 : -tilt.y * 6.0; // degrees pitch forward/back

  const frontParallaxX = reduced ? 0 : tilt.x * 38;
  const frontParallaxY = reduced ? 0 : tilt.y * 22;

  return (
    <header
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleStageClick}
      className="relative z-0 h-[100svh] min-h-[640px] w-full overflow-hidden bg-stage select-none cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      {/* ─────────────────────────────────────────────────────────────
          FLOATING SPATIAL AUDIO & GYRO TILT CONTROL PILL
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-5 right-5 z-40 flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSpatialExperience();
          }}
          aria-label="Toggle 3D spatial audio and device tilt"
          className="group flex items-center gap-2.5 rounded-full border border-gold/40 bg-kumkum-dark/90 px-4 py-2 text-xs tracking-wider text-gold-light backdrop-blur-md shadow-[0_4px_20px_rgba(20,8,3,0.5)] transition-all active:scale-95 hover:border-gold hover:bg-kumkum-dark hover:shadow-[0_4px_25px_rgba(228,192,118,0.3)]"
        >
          {isAudioPlaying ? (
            <span className="flex items-center gap-1">
              <span className="h-3 w-0.5 animate-pulse bg-gold-light" />
              <span className="h-4 w-0.5 animate-bounce bg-gold" />
              <span className="h-2 w-0.5 animate-pulse bg-gold-light" />
            </span>
          ) : (
            <span className="text-sm">🎵</span>
          )}
          <span className="font-medium">
            {isAudioPlaying ? "3D Audio & Tilt On" : "Enable 3D Audio & Tilt"}
          </span>
        </button>

        {showTiltHint && (
          <span className="pointer-events-none animate-pulse rounded-full bg-gold/15 px-3 py-1 text-[0.68rem] tracking-wide text-gold-light/95 backdrop-blur-sm sm:hidden">
            📱 Tilt your phone for 3D depth
          </span>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PLATE 1: MANDAP BACKGROUND (Farthest 3D Layer, z-0)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        animate={{
          x: bgParallaxX,
          y: bgParallaxY,
        }}
        transition={{ type: "spring", damping: 32, stiffness: 90 }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={mandap}
          alt="The wedding mandap dressed with jasmine and rose garlands, brass oil lamps lit"
          className="h-full w-full object-cover object-top filter brightness-[0.96] contrast-[1.04]"
        />
      </motion.div>

      {/* Atmospheric lighting & depth vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_35%,rgba(36,18,7,0.18)_0%,rgba(36,18,7,0.10)_45%,rgba(36,18,7,0.80)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(25,12,5,0.70)_0%,rgba(25,12,5,0.22)_30%,rgba(25,12,5,0)_60%,rgba(25,12,5,0.85)_100%)]" />

      {/* ─────────────────────────────────────────────────────────────
          TYPOGRAPHY PLANE (Behind Couple, z-10)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: typeY, opacity: typeFade }}
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
          Responds dynamically to mobile phone tilt (windTilt).
          ───────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <PetalCanvas
          className="h-full w-full"
          count={48}
          minSize={14}
          maxSize={35}
          speed={1.05}
          windTilt={tilt.x}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PLATE 2: THE COUPLE CUTOUT (z-30)
          Tilts in true 3D spatial perspective (rotateY & rotateX)
          when the mobile phone is tilted!
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          y: figureY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          x: figureParallaxX,
          y: figureParallaxY,
          rotateY: figureRotateY,
          rotateX: figureRotateX,
        }}
        transition={{ type: "spring", damping: 24, stiffness: 85 }}
        className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center will-change-transform"
      >
        {/* Ground contact shadow dynamically shifting with the 3D tilt */}
        <motion.div
          animate={{
            x: -tilt.x * 12,
            scaleX: 1 - Math.abs(tilt.x) * 0.1,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 85 }}
          className="absolute bottom-[3%] h-9 w-[320px] max-w-[80vw] rounded-[100%] bg-black/60 blur-xl sm:bottom-[4%] sm:w-[420px]"
        />

        <motion.img
          initial={reduced ? false : { opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0 : 1.3, ease: [0.16, 1, 0.3, 1] }}
          src={coupleCutout}
          alt="Aadhira and Karthikeya in traditional golden wedding silk and fresh lotus garlands"
          className="h-[65%] max-h-[82%] min-h-[340px] w-auto max-w-none object-contain object-bottom drop-shadow-[0_14px_38px_rgba(20,8,3,0.55)] select-none"
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          FOREGROUND FLOATING LIGHT PINK PETALS (z-40)
          Soft out-of-focus camera petals passing in front
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        animate={{ x: frontParallaxX, y: frontParallaxY }}
        transition={{ type: "spring", damping: 20, stiffness: 50 }}
        className="pointer-events-none absolute inset-0 z-40 opacity-80 blur-[2.2px]"
      >
        <PetalCanvas
          className="h-full w-full"
          count={9}
          minSize={40}
          maxSize={75}
          speed={1.65}
          windTilt={tilt.x * 1.3}
        />
      </motion.div>

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


