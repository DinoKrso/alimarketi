"use client";

import { motion, useReducedMotion } from "motion/react";

const DOTS = 9;

export function Burst({ shot, className }: { shot: number; className?: string }) {
  const reduce = useReducedMotion();
  if (!shot || reduce) return null;

  return (
    <span key={shot} aria-hidden className={className ?? "pointer-events-none absolute inset-0"}>
      {Array.from({ length: DOTS }, (_, index) => {
        const angle = (index / DOTS) * Math.PI * 2 + (shot % 2) * 0.35;
        const distance = 30 + (index % 3) * 7;
        return (
          <motion.span
            key={index}
            className={index % 3 === 0 ? "absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-fresh" : "absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-brand"}
            style={{ marginLeft: -4, marginTop: -4 }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, scale: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </span>
  );
}
