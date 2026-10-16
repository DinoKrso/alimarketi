"use client";

import { LOGO_VIEWBOX, logoPaths, marketiLetters } from "@/components/logo-paths";
import { cn } from "@/lib/cn";
import { motion, type Variants } from "motion/react";
import { useId } from "react";

const LOGO_ORANGE = "#EB6807";
const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 520, damping: 18 } as const;

const markDraw: Variants = {
  out: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1 },
  in: {
    pathLength: 1,
    fillOpacity: 1,
    strokeOpacity: 0,
    transition: {
      pathLength: { duration: 0.85, ease: [0.65, 0, 0.35, 1] },
      fillOpacity: { duration: 0.35, delay: 0.6 },
      strokeOpacity: { duration: 0.3, delay: 0.8 },
    },
  },
};

const markGroup: Variants = {
  full: { y: 0, scale: 1, transition: { duration: 0.55, ease } },
  compact: { y: 44, scale: 1.24, transition: { duration: 0.55, ease, delay: 0.08 } },
};

const markWiggle: Variants = {
  rest: { rotate: 0, transition: spring },
  hover: { rotate: [0, -10, 6, 0], transition: { duration: 0.65, ease: "easeInOut" } },
};

const rise = (delay: number): Variants => ({
  out: { y: 70, opacity: 0 },
  in: { y: 0, opacity: 1, transition: { ...spring, delay } },
});

const hop = (height: number, delay: number): Variants => ({
  rest: { y: 0, transition: spring },
  hover: { y: [0, -height, 0], transition: { duration: 0.5, delay, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] } },
});

const dotDrop: Variants = {
  out: { y: -150, opacity: 0 },
  in: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 11, delay: 0.75 } },
};

const letter: Variants = {
  out: { y: 46, opacity: 0 },
  in: (i: number) => ({ y: 0, opacity: 1, transition: { duration: 0.6, ease, delay: 0.55 + i * 0.05 } }),
  full: (i: number) => ({ y: 0, opacity: 1, transition: { duration: 0.45, ease, delay: 0.12 + i * 0.025 } }),
  compact: (i: number) => ({ y: 26, opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1], delay: i * 0.02 } }),
};

export function AnimatedLogo({
  className,
  intro = false,
  compact = false,
  hovered = false,
}: {
  className?: string;
  intro?: boolean;
  compact?: boolean;
  hovered?: boolean;
}) {
  const clip = `logo-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const animate = intro ? ["in"] : ["in", compact ? "compact" : "full", hovered ? "hover" : "rest"];

  return (
    <motion.svg
      viewBox={LOGO_VIEWBOX}
      className={cn("block overflow-visible", className)}
      initial={intro ? ["out"] : false}
      animate={animate}
      aria-hidden
    >
      <defs>
        <clipPath id={clip}>
          {Object.entries(logoPaths).map(([key, d]) => (
            <path key={key} d={d} />
          ))}
        </clipPath>
        <linearGradient id={`${clip}-shine`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g fill={LOGO_ORANGE}>
        <motion.g variants={markGroup}>
          <motion.g variants={markWiggle}>
            <motion.path d={logoPaths.mark} variants={markDraw} stroke={LOGO_ORANGE} strokeWidth={3} />
          </motion.g>
          <motion.g variants={hop(34, 0)}>
            <motion.path d={logoPaths.l} variants={rise(0.45)} />
          </motion.g>
          <motion.g variants={hop(34, 0.06)}>
            <motion.path d={logoPaths.iStem} variants={rise(0.55)} />
          </motion.g>
          <motion.g variants={hop(90, 0.1)}>
            <motion.path d={logoPaths.iDot} variants={dotDrop} />
          </motion.g>
        </motion.g>

        {marketiLetters.map((key, index) => (
          <motion.path key={key + index} d={logoPaths[key]} custom={index} variants={letter} />
        ))}
      </g>

      {intro ? (
        <g clipPath={`url(#${clip})`} style={{ pointerEvents: "none" }}>
          <motion.rect
            y="120"
            width="140"
            height="330"
            fill={`url(#${clip}-shine)`}
            initial={{ x: 480, skewX: -20 }}
            animate={{ x: 1120 }}
            transition={{ duration: 0.9, delay: 1.15, ease: [0.4, 0, 0.2, 1] }}
          />
        </g>
      ) : null}
    </motion.svg>
  );
}
