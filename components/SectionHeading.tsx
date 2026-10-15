import { Reveal, SplitTitle } from "@/components/Motion";
import { cn } from "@/lib/cn";
import { eyebrow as eyebrowClass, eyebrowDark } from "@/lib/ui";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  accent,
  as = "h2",
  tone = "dark",
  align = "split",
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  accent?: string[];
  as?: "h1" | "h2";
  /** Text colour: dark text on light grounds, or light text on ink panels. */
  tone?: "dark" | "light";
  align?: "split" | "center";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap gap-5 md:mb-14 md:gap-6",
        align === "center" ? "flex-col items-center text-center" : "items-end justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "flex flex-col items-center")}>
        {eyebrow ? (
          <Reveal y={12} blur={false}>
            <p className={light ? eyebrowDark : eyebrowClass}>{eyebrow}</p>
          </Reveal>
        ) : null}
        <SplitTitle
          as={as}
          text={title}
          accent={accent}
          className={cn(
            "mt-4 font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.035em]",
            light ? "text-paper" : "text-ink",
          )}
        />
        {lede ? (
          <Reveal delay={0.15} y={16}>
            <p className={cn("mt-4 max-w-xl text-base leading-relaxed sm:mt-5 sm:text-lg", light ? "text-paper/70" : "text-muted")}>{lede}</p>
          </Reveal>
        ) : null}
      </div>
      {action ? (
        <Reveal delay={0.2} y={16} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
