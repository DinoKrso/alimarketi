"use client";

import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export function AnimatedNumber({
  value,
  format = (n) => String(Math.round(n)),
  className,
}: {
  value: number;
  format?: (value: number) => string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 22, mass: 0.6 });
  const text = useTransform(spring, (current) => format(current));

  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [reduce, spring, value]);

  return <motion.span className={className}>{text}</motion.span>;
}
