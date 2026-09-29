import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import mandap from "../assets/mandap.jpg";
import ganeshaGold from "../assets/ganesha-gold.png";
import { CornerFlourish, Monogram } from "./ui";

export default function Hero() {
  const containerRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // Scroll progress through the 260vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* ─────────────────────────────────────────────────────────────
     STAGE 1: TOP 25% ENVELOPE FLAP & POCKET (scroll: 0.0 -> 0.28)
     Ranges extend to 1.0 so Web Animations API never finishes early!
     ───────────────────────────────────────────────────────────── */
  const topFlapRotateX = useTransform(
    scrollYProgress,
    [0.02, 0.22, 1],
    [0, reduced ? 0 : -145, reduced ? 0 : -145]
  );
  const topFlapOpacity = useTransform(
    scrollYProgress,
    [0.17, 0.23, 1],
    [1, 0, 0]
  );

  // Wax seal on the 25% seam
  const sealScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 1],
    [1, 1.25, 0.4, 0.4]
  );
  const sealOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.17, 1],
    [1, 0, 0]
  );

  // Envelope bottom pocket (lower 75%) slides down completely off screen (100% opaque, zero bleed)
  const envelopePocketY = useTransform(
    scrollYProgress,
    [0.08, 0.26, 1],
    [0, reduced ? 0 : 900, reduced ? 0 : 900]
  );

  // Completely remove envelope from DOM rendering once slid off
  const envelopeDisplay = useTransform(
    scrollYProgress,
    (v) => (v >= 0.27 ? "none" : "block")
  );

  /* ─────────────────────────────────────────────────────────────
     STAGE 2: INSIDE CARD SLIDES UP TO THE TOP (scroll: 0.04 -> 0.28)
     ───────────────────────────────────────────────────────────── */
  const cardSlideY = useTransform(
    scrollYProgress,
    [0.04, 0.26, 1],
    [reduced ? 0 : 160, 0, 0]
  );
  const cardScale = useTransform(
    scrollYProgress,
    [0.04, 0.26, 1],
    [0.92, 1.0, 1.0]
  );

  /* ─────────────────────────────────────────────────────────────
     STAGE 3 & 4: CARD OPENS LIKE A BOOK (scroll: 0.34 -> 0.72)
     The front page (with Lord Ganesha in gold) swings open to the left
     ───────────────────────────────────────────────────────────── */
  const bookRotateY = useTransform(
    scrollYProgress,
    [0.34, 0.68, 1],
    [0, reduced ? 0 : -135, reduced ? 0 : -135]
  );
  const bookCoverOpacity = useTransform(
    scrollYProgress,
    [0.54, 0.68, 1],
    [1, 0, 0]
  );
  const bookCoverDisplay = useTransform(
    scrollYProgress,
    (v) => (v >= 0.70 ? "none" : "flex")
  );

  // Details inside book emerge as the cover opens
  const detailsScale = useTransform(
    scrollYProgress,
    [0.34, 0.68, 1],
    [0.96, 1.0, 1.0]
  );
  const detailsOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.55, 1],
    [0.6, 1.0, 1.0]
  );

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-[260vh] w-full"
      aria-label="Royal wedding card opening intro"
    >
      {/* Sticky 100vh viewport */}
      <div className="sticky top-0 h-[100svh] min-h-[640px] w-full overflow-hidden bg-stage select-none">

        {/* ==============================================================
            THE INSIDE CARD (Slides UP from envelope, then opens like a book)
            ============================================================== */}
        <motion.div
          style={{
            y: cardSlideY,
            scale: cardScale,
          }}
          className="absolute inset-0 z-10 h-full w-full will-change-transform"
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ perspective: "1800px" }}
          >
            {/* ─────────────────────────────────────────────────────────
                INNER SPREAD: WEDDING DETAILS (Inside the opened book)
                ───────────────────────────────────────────────────────── */}
            <motion.div
              style={{
                scale: detailsScale,
                opacity: detailsOpacity,
              }}
              className="absolute inset-0 h-full w-full overflow-hidden bg-stage"
            >
              {/* Sacred Mandap backdrop */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={mandap}
                  alt="The sacred wedding mandap dressed with jasmine and rose garlands, brass oil lamps lit"
                  className="h-full w-full object-cover object-top filter brightness-[0.92] contrast-[1.05]"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Atmospheric warm lighting, sacred glow & vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_35%,rgba(36,18,7,0.2)_0%,rgba(36,18,7,0.1)_45%,rgba(36,18,7,0.85)_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(25,12,5,0.72)_0%,rgba(25,12,5,0.22)_35%,rgba(25,12,5,0.15)_60%,rgba(25,12,5,0.92)_100%)]" />

              {/* Typography inside the opened book */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-full flex-col justify-between px-5 pt-[5svh] pb-24 text-center sm:pt-[7svh]">
                <div className="relative mx-auto max-w-2xl">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(8rem,36vw,13rem)] leading-none text-gold/15 italic select-none"
                  >
                    &amp;
                  </span>

                  <p className="font-telugu text-[1.1rem] sm:text-[1.3rem] font-medium tracking-wide text-gold-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    || శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు ||
                  </p>
                  <p className="font-telugu mt-1.5 text-[1rem] sm:text-[1.12rem] tracking-wide text-paper/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    సగౌరవంగా ఆహ్వానిస్తున్నాము
                  </p>
                  <p className="label mt-2 text-paper/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    Together with their families
                  </p>

                  <h1 className="mt-5 font-display text-paper">
                    <span className="block font-telugu text-[1.65rem] sm:text-[2.2rem] font-normal text-gold-light tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                      ఆదిర
                    </span>
                    <span className="block text-[clamp(2.9rem,11vw,4.8rem)] leading-[0.9] font-light tracking-tight [text-shadow:0_3px_25px_rgba(15,7,2,0.95)]">
                      Aadhira
                    </span>

                    <span className="my-2.5 flex items-center justify-center gap-3">
                      <span className="h-px w-10 bg-gold-light/60 sm:w-16" />
                      <span className="font-telugu text-[0.95rem] sm:text-[1.05rem] text-gold-light/90 font-medium">
                        పరిణయం
                      </span>
                      <span className="font-display text-[1.4rem] text-gold-light italic drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-[1.7rem]">
                        weds
                      </span>
                      <span className="h-px w-10 bg-gold-light/60 sm:w-16" />
                    </span>

                    <span className="block font-telugu text-[1.65rem] sm:text-[2.2rem] font-normal text-gold-light tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                      కార్తికేయ
                    </span>
                    <span className="block text-[clamp(2.9rem,11vw,4.8rem)] leading-[0.9] font-light tracking-tight [text-shadow:0_3px_25px_rgba(15,7,2,0.95)]">
                      Karthikeya
                    </span>
                  </h1>

                  <p className="font-telugu mt-4 text-[0.95rem] text-paper/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    కళ్యాణ మహోత్సవ ఆహ్వాన పత్రిక
                  </p>
                </div>
              </div>

              {/* Bottom details banner inside */}
              <div className="absolute inset-x-0 bottom-0 z-20 bg-[linear-gradient(to_top,rgba(26,11,4,0.98)_0%,rgba(26,11,4,0.85)_50%,rgba(26,11,4,0)_100%)] px-5 pb-14 pt-20">
                <div className="mx-auto flex max-w-xl items-end justify-between gap-4 border-t border-gold/35 pt-4">
                  <div>
                    <p className="font-telugu text-[0.85rem] text-gold-light font-medium leading-none">ముహూర్తం</p>
                    <p className="label mt-1 text-gold-light/90">Muhurtham</p>
                    <p className="tnum mt-1 font-display text-2xl font-medium text-paper">10:48 AM</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Monogram className="h-10 w-10 shrink-0 opacity-90" stroke="#E4C076" />
                    <p className="font-telugu mt-1 text-[0.72rem] text-gold-light/80">శుభం</p>
                  </div>
                  <div className="text-right">
                    <p className="font-telugu text-[0.85rem] text-gold-light font-medium leading-none">శనివారం · తిరుపతి</p>
                    <p className="label mt-1 text-gold-light/90">Saturday · Tirupati</p>
                    <p className="tnum mt-1 font-display text-2xl font-medium text-paper">21 · 11 · 2026</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─────────────────────────────────────────────────────────
                FRONT COVER OF THE BOOK: LORD GANESHA IN RADIANT GOLD
                Hinged on the left spine: opens like a book (rotateY)
                ───────────────────────────────────────────────────────── */}
            <motion.div
              style={{
                transformOrigin: "left center",
                rotateY: bookRotateY,
                opacity: bookCoverOpacity,
                display: bookCoverDisplay,
              }}
              className="absolute inset-0 z-20 flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#290514] via-[#430f23] to-[#1e030e] p-6 shadow-[20px_0_50px_rgba(0,0,0,0.9)] will-change-transform sm:p-12"
            >
              {/* Opaque royal paper background texture with gold radial illumination */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(228,192,118,0.22)_0%,transparent_75%)]" />
              <div className="grain absolute inset-3 border-2 border-gold/55 shadow-[inset_0_0_0_3px_rgba(56,11,28,0.9),inset_0_0_0_4px_rgba(228,192,118,0.35)] sm:inset-6" />

              {/* Corner flourishes on book cover */}
              <CornerFlourish className="absolute left-5 top-5 h-8 w-8 text-gold-light opacity-85 sm:left-8 sm:top-8 sm:h-12 sm:w-12" />
              <CornerFlourish className="absolute right-5 top-5 h-8 w-8 rotate-90 text-gold-light opacity-85 sm:right-8 sm:top-8 sm:h-12 sm:w-12" />
              <CornerFlourish className="absolute left-5 bottom-5 h-8 w-8 -rotate-90 text-gold-light opacity-85 sm:left-8 sm:bottom-8 sm:h-12 sm:w-12" />
              <CornerFlourish className="absolute right-5 bottom-5 h-8 w-8 rotate-180 text-gold-light opacity-85 sm:right-8 sm:bottom-8 sm:h-12 sm:w-12" />

              {/* Left spine shadow */}
              <div className="pointer-events-none absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-black/70 to-transparent sm:w-12" />

              {/* Top Invocation on Book Cover */}
              <div className="relative z-10 text-center pt-2 sm:pt-4">
                <p className="font-telugu text-[1.15rem] sm:text-[1.35rem] font-semibold tracking-wider text-gold-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  || శ్రీ గణేశాయ నమః ||
                </p>
                <p className="font-telugu mt-1 text-[0.82rem] sm:text-[0.95rem] text-gold-light/90 tracking-wide">
                  వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ । నిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ॥
                </p>
              </div>

              {/* CENTERPIECE: LORD GANESHA IN RADIANT GOLD */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2 text-center">
                <div className="relative flex items-center justify-center">
                  {/* Subtle divine golden glow behind Lord Ganesha */}
                  <div className="absolute inset-0 -m-8 sm:-m-12 rounded-full bg-[radial-gradient(circle,rgba(245,216,138,0.4)_0%,rgba(228,192,118,0.15)_50%,transparent_75%)] blur-2xl pointer-events-none" />
                  <img
                    src={ganeshaGold}
                    alt="Lord Ganesha in radiant gold"
                    className="relative z-10 h-44 w-auto max-w-[280px] object-contain drop-shadow-[0_12px_40px_rgba(228,192,118,0.7)] sm:h-64 sm:max-w-[420px] md:h-72 filter brightness-[1.04] contrast-[1.02] select-none"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <div className="mt-3">
                  <p className="font-telugu text-[1.35rem] sm:text-[1.8rem] font-medium text-gold-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    ఆదిర &amp; కార్తికేయ
                  </p>
                  <p className="font-display text-base sm:text-xl text-paper/85 italic">
                    Aadhira weds Karthikeya
                  </p>
                  <p className="font-telugu mt-1 text-[0.88rem] sm:text-[0.98rem] text-gold-light/90">
                    వివాహ మహోత్సవ ఆహ్వాన పత్రిక
                  </p>
                </div>
              </div>

              {/* Bottom line on Book Cover */}
              <div className="relative z-10 text-center pb-2 sm:pb-4">
                <div className="mx-auto flex items-center justify-center gap-3 opacity-90">
                  <span className="h-px w-10 bg-gold-light/60 sm:w-16" />
                  <span className="font-telugu text-[0.82rem] sm:text-[0.92rem] text-gold-light font-medium">
                    21 నవంబర్ 2026 · తిరుపతి, ఆంధ్రప్రదేశ్
                  </span>
                  <span className="h-px w-10 bg-gold-light/60 sm:w-16" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ==============================================================
            THE OUTER ENVELOPE (TOP 25% FLAP & 75% POCKET)
            Completely opaque, covers the screen until opened
            ============================================================== */}
        <motion.div
          style={{ display: envelopeDisplay }}
          className="absolute inset-0 z-30"
        >
          <div
            className="relative h-full w-full"
            style={{ perspective: "1500px" }}
          >
            {/* BOTTOM ENVELOPE POCKET (75% height: from top 25% to bottom) */}
            <motion.div
              style={{
                y: envelopePocketY,
              }}
              className="absolute top-[25%] inset-x-0 bottom-0 overflow-hidden border-t-2 border-gold/75 bg-[#2A0514] shadow-[0_-15px_45px_rgba(0,0,0,0.85)] will-change-transform"
            >
              {/* Opaque royal textured finish with zero bleed-through */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#380b1d] via-[#2A0514] to-[#1c030c]" />
              <div className="grain absolute inset-3 border border-gold/45 shadow-[inset_0_0_0_2px_rgba(56,11,28,0.9),inset_0_0_0_3px_rgba(228,192,118,0.25)] sm:inset-5" />

              <CornerFlourish className="absolute left-4 bottom-4 h-8 w-8 -rotate-90 text-gold-light opacity-80 sm:left-6 sm:bottom-6 sm:h-10 sm:w-10" />
              <CornerFlourish className="absolute right-4 bottom-4 h-8 w-8 rotate-180 text-gold-light opacity-80 sm:right-6 sm:bottom-6 sm:h-10 sm:w-10" />

              {/* Envelope pocket cover design */}
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 pt-10 sm:pt-14 text-center">
                <div className="mx-auto max-w-md">
                  <div className="mx-auto flex items-center justify-center gap-3 opacity-80">
                    <span className="h-px w-10 bg-gold-light/60 sm:w-16" />
                    <span className="font-telugu text-[0.85rem] text-gold-light">
                      లగ్న పత్రిక
                    </span>
                    <span className="h-px w-10 bg-gold-light/60 sm:w-16" />
                  </div>
                  <p className="font-telugu mt-3 text-lg sm:text-2xl text-gold-light font-medium">
                    వివాహ మహోత్సవ ఆహ్వాన పత్రిక
                  </p>
                  <p className="tnum font-telugu text-[0.85rem] sm:text-[0.95rem] text-gold-light/90 mt-1">
                    21 నవంబర్ 2026 · తిరుపతి, ఆంధ్రప్రదేశ్
                  </p>
                </div>

                <div className="pb-4">
                  <p className="label text-[0.62rem] sm:text-[0.72rem] text-gold-light/60 tracking-[0.25em]">
                    Sri Venkateswara Kalyana Mandapam · Tirupati
                  </p>
                </div>
              </div>
            </motion.div>

            {/* TOP 25% FLAP (Hinged at top edge, flips open UPWARD) */}
            <motion.div
              style={{
                transformOrigin: "top center",
                rotateX: topFlapRotateX,
                opacity: topFlapOpacity,
              }}
              className="absolute top-0 inset-x-0 h-[25%] overflow-hidden border-b-2 border-gold/75 bg-[#2A0514] shadow-[0_15px_45px_rgba(0,0,0,0.9)] will-change-transform"
            >
              {/* Opaque royal textured finish */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1e030e] via-[#33081a] to-[#3a0b1d]" />
              <div className="grain absolute inset-2.5 border border-gold/45 shadow-[inset_0_0_0_2px_rgba(72,17,38,0.9),inset_0_0_0_3px_rgba(228,192,118,0.3)] sm:inset-4" />

              <CornerFlourish className="absolute left-3 top-3 h-7 w-7 text-gold-light opacity-80 sm:left-5 sm:top-5 sm:h-9 sm:w-9" />
              <CornerFlourish className="absolute right-3 top-3 h-7 w-7 rotate-90 text-gold-light opacity-80 sm:right-5 sm:top-5 sm:h-9 sm:w-9" />

              {/* Top 25% flap content */}
              <div className="relative flex h-full flex-col justify-center px-6 text-center">
                <p className="font-telugu text-[0.92rem] sm:text-[1.15rem] font-semibold tracking-wider text-gold-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  || శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు ||
                </p>
                <p className="label mt-1 text-[0.58rem] sm:text-[0.66rem] text-gold-light/80">
                  Royal Wedding Invitation
                </p>
              </div>
            </motion.div>

            {/* GOLDEN WAX SEAL AT THE 25% SEAM LINE */}
            <motion.div
              style={{
                scale: sealScale,
                opacity: sealOpacity,
              }}
              className="absolute left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
            >
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#8E6523] via-[#E6C075] to-[#FDE8AE] p-[2.5px] shadow-[0_10px_35px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.5)]">
                <div className="relative flex h-full w-full items-center justify-center rounded-full border border-gold/60 bg-[#2A0514] p-2 text-center shadow-[inset_0_3px_10px_rgba(0,0,0,0.7)]">
                  <Monogram className="h-12 w-12 sm:h-14 sm:w-14" stroke="#F5D88A" />
                  <span className="font-telugu absolute bottom-0.5 text-[0.55rem] sm:text-[0.62rem] font-semibold text-gold-light tracking-wide">
                    శుభం
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
