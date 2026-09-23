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
  tamil,
  label,
  title,
  tone = "gold",
}: {
  tamil: string;
  label: string;
  title: string;
  tone?: "gold" | "kumkum";
}) {
  return (
    <div className="text-center">
      <p
        className={`font-tamil text-[1.05rem] leading-relaxed ${
          tone === "gold" ? "text-gold" : "text-kumkum-light"
        }`}
      >
        {tamil}
      </p>
      <p className="label mt-1 text-ink-soft">{label}</p>
      <h2 className="mt-3 font-display text-[2.1rem] leading-[1.05] font-normal text-ink sm:text-[2.6rem]">
        {title}
      </h2>
    </div>
  );
}
