import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Monogram — hand-drawn vector: a lotus roundel holding A and K       */
/* ------------------------------------------------------------------ */

export function Monogram({
  className = "",
  stroke = "#B98A34",
  title = "Aadhira and Karthikeya monogram",
}: {
  className?: string;
  stroke?: string;
  title?: string;
}) {
  const petal = (
    <path
      id="mg-petal"
      d="M0 -46 C 7.5 -33.5, 12.5 -22, 12.5 -12 C 12.5 -4, 6.8 0, 0 0 C -6.8 0, -12.5 -4, -12.5 -12 C -12.5 -22, -7.5 -33.5, 0 -46 Z"
    />
  );
  return (
    <svg
      viewBox="-60 -60 120 120"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke={stroke}
    >
      <defs>{petal}</defs>
      {/* twelve lotus petals around the roundel */}
      <g opacity="0.85" strokeWidth="1.4" strokeLinejoin="round">
        {Array.from({ length: 12 }).map((_, i) => (
          <use
            key={i}
            href="#mg-petal"
            transform={`rotate(${i * 30})`}
            fill={i % 2 === 0 ? "rgba(185,138,52,0.16)" : "rgba(185,138,52,0.06)"}
          />
        ))}
      </g>
      <circle cx="0" cy="0" r="34" strokeWidth="1.6" />
      <circle cx="0" cy="0" r="30.5" strokeWidth="0.8" opacity="0.7" />
      {/* A */}
      <g strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-19 15 L-8.5 -14 L2 15" />
        <path d="M-14.5 4 L-3 4" />
        {/* K */}
        <path d="M11 -15 L11 16" />
        <path d="M22 -15 L11.5 2" />
        <path d="M15 0 L23 16" />
      </g>
      {/* the thali thread under the letters */}
      <path
        d="M-16 24 C -6 30, 6 30, 16 24"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Divider — a gold rule broken by a lotus bud                         */
/* ------------------------------------------------------------------ */

export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="#B98A34"
      strokeWidth="1"
    >
      <path d="M0 12 H86" opacity="0.6" />
      <path d="M154 12 H240" opacity="0.6" />
      <path d="M92 12 L98 8 L104 12 L98 16 Z" fill="rgba(185,138,52,0.35)" />
      <path d="M136 12 L142 8 L148 12 L142 16 Z" fill="rgba(185,138,52,0.35)" />
      <path d="M120 3 C 127 8, 127 14, 120 21 C 113 14, 113 8, 120 3 Z" fill="rgba(110,31,60,0.18)" />
      <path d="M120 3 C 127 8, 127 14, 120 21" />
      <path d="M112 12 C 115 10, 117 9, 120 8 C 123 9, 125 10, 128 12" opacity="0.7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Corner flourish for the pathirikai frame                            */
/* ------------------------------------------------------------------ */

export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="#B98A34"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M2 22 C 2 10, 10 2, 22 2" opacity="0.85" />
      <path d="M2 30 C 2 14, 14 2, 30 2" opacity="0.45" />
      <path d="M8 18 C 12 12, 18 8, 24 8 C 20 12, 14 15, 8 18 Z" fill="rgba(185,138,52,0.22)" />
      <circle cx="7" cy="7" r="2.2" fill="rgba(110,31,60,0.35)" stroke="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Reveal — ceremonial entrance                                        */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduced ? 0 : 0.9,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading — tracked label above a serif title                 */
/* ------------------------------------------------------------------ */

export function Heading({
  telugu,
  tamil,
  label,
  title,
  tone = "gold",
}: {
  telugu?: string;
  tamil?: string;
  label: string;
  title: string;
  tone?: "gold" | "kumkum";
}) {
  const regionalText = telugu || tamil;
  return (
    <div className="text-center">
      {regionalText && (
        <p
          className={`font-telugu text-[1.1rem] leading-relaxed font-normal tracking-wide ${
            tone === "gold" ? "text-gold" : "text-kumkum-light"
          }`}
        >
          {regionalText}
        </p>
      )}
      <p className="label mt-1 text-ink-soft">{label}</p>
      <h2 className="mt-3 font-display text-[2.1rem] leading-[1.05] font-normal text-ink sm:text-[2.6rem]">
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lord Ganesha in radiant gold — auspicious wedding invitation art   */
/* ------------------------------------------------------------------ */

export function GaneshGold({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 160"
      className={className}
      fill="none"
      aria-label="Lord Ganesha in Gold"
      role="img"
    >
      <defs>
        <linearGradient id="ganeshGoldLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4D0" />
          <stop offset="25%" stopColor="#F5D88A" />
          <stop offset="55%" stopColor="#D4A446" />
          <stop offset="85%" stopColor="#A87722" />
          <stop offset="100%" stopColor="#E2BD6E" />
        </linearGradient>
        <radialGradient id="ganeshGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245, 216, 138, 0.22)" />
          <stop offset="70%" stopColor="rgba(212, 164, 70, 0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Aura / Halo glow */}
      <circle cx="70" cy="78" r="62" fill="url(#ganeshGlow)" />
      <circle cx="70" cy="78" r="56" stroke="url(#ganeshGoldLine)" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6" />

      {/* Crown / Kireetam */}
      <path
        d="M58 32 L70 8 L82 32 Z"
        stroke="url(#ganeshGoldLine)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="rgba(245,216,138,0.12)"
      />
      <path d="M62 22 L70 12 L78 22" stroke="url(#ganeshGoldLine)" strokeWidth="1.6" />
      <circle cx="70" cy="8" r="3" fill="#F5D88A" stroke="url(#ganeshGoldLine)" strokeWidth="1" />
      <path d="M50 34 C 64 28, 76 28, 90 34" stroke="url(#ganeshGoldLine)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M52 40 C 64 36, 76 36, 88 40" stroke="url(#ganeshGoldLine)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Sacred Tilak / Namam on Forehead */}
      <path d="M70 36 L70 52" stroke="url(#ganeshGoldLine)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M65 42 Q 70 50 75 42" stroke="url(#ganeshGoldLine)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="70" cy="46" r="2" fill="#F5D88A" />

      {/* Left Ear */}
      <path
        d="M50 38 C 30 40, 20 54, 26 72 C 30 82, 40 85, 48 82"
        stroke="url(#ganeshGoldLine)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="rgba(245,216,138,0.06)"
      />
      <path d="M34 50 C 28 62, 32 72, 42 76" stroke="url(#ganeshGoldLine)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

      {/* Right Ear */}
      <path
        d="M90 38 C 110 40, 120 54, 114 72 C 110 82, 100 85, 92 82"
        stroke="url(#ganeshGoldLine)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="rgba(245,216,138,0.06)"
      />
      <path d="M106 50 C 112 62, 108 72, 98 76" stroke="url(#ganeshGoldLine)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

      {/* Serene Eyes */}
      <path d="M52 54 Q 59 51 64 54" stroke="url(#ganeshGoldLine)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="58" cy="56" r="1.6" fill="#F5D88A" />
      <path d="M76 54 Q 81 51 88 54" stroke="url(#ganeshGoldLine)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="82" cy="56" r="1.6" fill="#F5D88A" />

      {/* Ekadanta (Single Tusk) */}
      <path d="M78 68 L86 71 L78 73 Z" fill="#F5D88A" stroke="url(#ganeshGoldLine)" strokeWidth="0.8" />

      {/* Elegant Curved Trunk (Vamamukhi) holding Modakam */}
      <path
        d="M62 60 C 64 74, 61 88, 56 100 C 51 112, 56 122, 68 124 C 78 125, 85 119, 85 110 C 85 100, 75 97, 69 103"
        stroke="url(#ganeshGoldLine)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Golden Modak / Laddu */}
      <circle cx="68" cy="104" r="5" fill="#F5D88A" stroke="url(#ganeshGoldLine)" strokeWidth="1.4" />
      <path d="M66 101 L68 98 L70 101" stroke="#8C6219" strokeWidth="1" />

      {/* Auspicious Round Belly line */}
      <path
        d="M46 86 C 40 106, 48 132, 66 138 C 84 144, 100 132, 100 110 C 100 94, 94 84, 88 82"
        stroke="url(#ganeshGoldLine)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Right Abhaya Mudra Hand (Blessing) */}
      <path
        d="M96 90 C 105 90, 112 95, 110 104 C 108 111, 101 113, 94 111"
        stroke="url(#ganeshGoldLine)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="104" cy="99" r="2.5" stroke="url(#ganeshGoldLine)" strokeWidth="1.2" fill="rgba(245,216,138,0.2)" />

      {/* Sacred Lotus Pedestal Base */}
      <path d="M36 142 C 54 136, 86 136, 104 142" stroke="url(#ganeshGoldLine)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 147 C 58 142, 82 142, 98 147" stroke="url(#ganeshGoldLine)" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
