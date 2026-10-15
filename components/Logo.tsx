"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Official orange “ali MARKETI” mark, the right-hand version from the
 * Illustrator file, saved as a vector so it stays sharp at any size.
 * In the navbar it is the home control: other pages go to `/`, and a click
 * on the homepage itself returns to the top.
 */
export function Logo({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={cn("press flex shrink-0 items-center", className)}
      aria-label="Ali Marketi, početna"
      onClick={(event) => {
        onNavigate?.();
        if (pathname !== "/") return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <img src="/logo-ali.svg" alt="" width={161} height={100} className="h-12 w-auto md:h-14" />
    </Link>
  );
}
