import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import mandap from "../assets/mandap.jpg";
import coupleCutout from "../assets/couple.png";
import PetalCanvas from "./PetalCanvas";
import { Monogram } from "./ui";

export default function Hero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);

  // 3D spatial mouse/tilt coordinates (-1 to 1)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (reduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }, [reduced]);

  const handlePointerLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 130]);
  const bgScale = useTransform(scrollY, [0, 900], [1.08, reduced ? 1.08 : 1.16]);
  const figureY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : -60]);
  const typeY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 35]);
  const typeFade = useTransform(scrollY, [0, 520], [1, 0]);

  // Mouse parallax offsets for the 3D layers
  const bgParallaxX = reduced ? 0 : mousePos.x * -14;
  const bgParallaxY = reduced ? 0 : mousePos.y * -10;

  const midPetalWindX = reduced ? 0 : mousePos.x * 20;

  const figureParallaxX = reduced ? 0 : mousePos.x * 16;
  const figureParallaxY = reduced ? 0 : mousePos.y * 8;
  const figureRotateY = reduced ? 0 : mousePos.x * 3.5;

  const frontParallaxX = reduced ? 0 : mousePos.x * 28;
  const frontParallaxY = reduced ? 0 : mousePos.y * 14;

  return (
    <header
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative z-0 h-[100svh] min-h-[640px] w-full overflow-hidden bg-stage select-none"
      style={{ perspective: "1200px" }}
    >
      {/* ─────────────────────────────────────────────────────────────
          PLATE 1: MANDAP BACKGROUND (Farthest 3D Layer, z-0)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        animate={{
          x: bgParallaxX,
          y: bgParallaxY,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 85 }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={mandap}
          alt="The wedding mandap dressed with jasmine and rose garlands, brass oil lamps lit"
          className="h-full w-full object-cover object-top filter brightness-[0.96] contrast-[1.04]"
        />
      </motion.div>

      {/* Atmospheric lighting & depth vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_35%,rgba(36,18,7,0.20)_0%,rgba(36,18,7,0.12)_45%,rgba(36,18,7,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(25,12,5,0.70)_0%,rgba(25,12,5,0.25)_30%,rgba(25,12,5,0)_60%,rgba(25,12,5,0.85)_100%)]" />

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
          PRIMARY 3D ROSE PETAL SHOWER (z-20)
          Falling from top, passing BETWEEN the background mandap
          and the foreground couple!
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        animate={{ x: midPetalWindX }}
        transition={{ type: "spring", damping: 40, stiffness: 60 }}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <PetalCanvas
          className="h-full w-full"
          count={46}
          minSize={14}
          maxSize={36}
          speed={1.05}
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          PLATE 2: THE COUPLE CUTOUT (z-30)
          Stands in front of the falling rose petals!
          Petals pass BEHIND their heads, shoulders, and bodies.
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: figureY }}
        animate={{
          x: figureParallaxX,
          y: figureParallaxY,
          rotateY: figureRotateY,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 75 }}
        className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center will-change-transform"
      >
        {/* Ground contact shadow under the couple on the mandap stage floor */}
        <div className="absolute bottom-[3%] h-9 w-[320px] max-w-[80vw] rounded-[100%] bg-black/60 blur-xl sm:bottom-[4%] sm:w-[420px]" />

        <motion.img
          initial={reduced ? false : { opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0 : 1.3, ease: [0.16, 1, 0.3, 1] }}
          src={coupleCutout}
          alt="Aadhira and Karthikeya in traditional golden wedding silk and fresh lotus garlands"
          className="h-[65%] max-h-[82%] min-h-[340px] w-auto max-w-none object-contain object-bottom drop-shadow-[0_12px_36px_rgba(20,8,3,0.55)] select-none"
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          FOREGROUND FLOATING PETALS (z-40)
          A few petals close to camera, out of focus, passing in front
          to complete the full 3-layer stereoscopic depth illusion!
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        animate={{ x: frontParallaxX, y: frontParallaxY }}
        transition={{ type: "spring", damping: 20, stiffness: 50 }}
        className="pointer-events-none absolute inset-0 z-40 opacity-75 blur-[2.5px]"
      >
        <PetalCanvas
          className="h-full w-full"
          count={8}
          minSize={42}
          maxSize={78}
          speed={1.65}
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM BANNER & EVENT DETAILS (z-50)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-50 bg-[linear-gradient(to_top,rgba(26,11,4,0.96)_0%,rgba(26,11,4,0.78)_48%,rgba(26,11,4,0)_100%)] px-5 pb-14 pt-24">
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

