"use client";

import { AnimatedLogo } from "@/components/AnimatedLogo";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Official orange “ali MARKETI” mark, the right-hand version from the
 * Illustrator file, saved as a vector so it stays sharp at any size.
 * In the navbar it is the home control: other pages go to `/`, and a click
 * on the homepage itself returns to the top.
 */
export function Logo({
  className,
  compact = false,
  onNavigate,
}: {
  className?: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/"
      className={cn("press flex shrink-0 items-center", className)}
      aria-label="Ali Marketi, početna"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={(event) => {
        onNavigate?.();
        if (pathname !== "/") return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <AnimatedLogo compact={compact} hovered={hovered} className="h-12 w-auto md:h-14" />
    </Link>
  );
}
