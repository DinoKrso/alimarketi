"use client";

import { cn } from "@/lib/cn";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { useSplashDone } from "@/components/Splash";
import { useRef, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type Tag = "div" | "section" | "li" | "ul" | "ol" | "p" | "span" | "header" | "article" | "dl" | "form";

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  p: motion.p,
  span: motion.span,
  header: motion.header,
  article: motion.article,
  dl: motion.dl,
  form: motion.form,
} as unknown as Record<Tag, typeof motion.div>;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  x = 0,
  blur = true,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  blur?: boolean;
  amount?: number;
  as?: Tag;
}) {
  const Comp = tags[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Comp>
  );
}

const group: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({ transition: { staggerChildren: stagger, delayChildren: 0.05 } }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/** Parent for a list whose children reveal one after another. */
export function Stagger({
  children,
  className,
  as = "ul",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
}) {
  const Comp = tags[as];
  return (
    <Comp
      className={className}
      variants={group}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      // Lists can be taller than the screen, so start as soon as the top edge is well inside.
      viewport={{ once: true, amount: "some", margin: "0px 0px -12% 0px" }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "li",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const Comp = tags[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}

/** Heading whose words slide up out of a mask, one after another. */
export function SplitTitle({
  text,
  as = "h2",
  className,
  accent,
  delay = 0,
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Words (exact match) to paint in the brand colour. */
  accent?: string[];
  delay?: number;
  /** Animate on mount instead of on scroll (for above-the-fold titles). */
  immediate?: boolean;
}) {
  const Tag = as;
  const words = text.split(" ");
  const ready = useSplashDone();
  const trigger = immediate
    ? { animate: ready ? "show" : "hidden" }
    : { whileInView: "show", viewport: { once: true, amount: 0.6 } };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      >
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
            <motion.span
              className={cn("inline-block", accent?.includes(word) && "text-brand")}
              variants={{
                hidden: { y: "105%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {word}
            </motion.span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

function useSectionProgress(offset: ["start end", "end start"] | ["start start", "end start"] = ["start end", "end start"]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return { ref, progress: scrollYProgress };
}

/** Moves its children vertically at a different speed than the page. */
export function Parallax({
  children,
  className,
  speed = 60,
}: {
  children: ReactNode;
  className?: string;
  /** Pixels travelled across the whole pass through the viewport. Negative reverses. */
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, progress } = useSectionProgress();
  const y = useTransform(progress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** Slides a large decorative word sideways while its section scrolls past. */
export function DriftText({
  children,
  className,
  distance = 220,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, progress } = useSectionProgress();
  const x = useTransform(progress, [0, 1], [distance, -distance]);
  return (
    <div ref={ref} className={cn("pointer-events-none select-none", className)} aria-hidden>
      <motion.div style={reduce ? undefined : { x }} className="whitespace-nowrap">
        {children}
      </motion.div>
    </div>
  );
}

/** Tilts a card from a laid-back angle to upright as it scrolls into view. */
export function TiltIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const rotateX = useTransform(smooth, [0, 1], [28, 0]);
  const rotateZ = useTransform(smooth, [0, 1], [-6, 0]);
  const scale = useTransform(smooth, [0, 1], [0.86, 1]);
  const opacity = useTransform(smooth, [0, 0.4], [0.2, 1]);
  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }}>
      <motion.div style={reduce ? undefined : { rotateX, rotateZ, scale, opacity, transformOrigin: "50% 100%" }}>
        {children}
      </motion.div>
    </div>
  );
}

/** Thin brand bar at the top of the window showing how far the page has scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand"
      style={{ scaleX }}
    />
  );
}
