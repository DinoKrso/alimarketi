"use client";

import { Icon, type IconName } from "@/components/Icon";
import { cn } from "@/lib/cn";
import { listCountLabel } from "@/lib/format";
import { useShoppingList } from "@/lib/shopping-list";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; match: string; label: string; icon: IconName }[] = [
  { href: "/akcije", match: "/akcije", label: "Akcije", icon: "tag" },
  { href: "/letak", match: "/letak", label: "Katalog", icon: "book" },
  { href: "/poslovnice?najblizi=1", match: "/poslovnice", label: "Najbliži", icon: "navigate" },
];

const item =
  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[18px] text-[11px] font-semibold transition-colors";

export function MobileActionBar() {
  const { count, setOpen } = useShoppingList();
  const reduce = useReducedMotion();
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-40 rounded-[24px] border border-line bg-white/90 p-1 shadow-[0_12px_40px_-12px_rgb(15_43_33/0.35)] backdrop-blur-xl md:hidden"
      aria-label="Brze radnje"
    >
      <ul className="grid grid-cols-4">
        {links.map((link) => {
          const active = pathname === link.match || pathname.startsWith(`${link.match}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(item, active ? "text-paper" : "text-ink hover:bg-ink/5")}
              >
                {active ? (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-[18px] bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <motion.span
                  className="relative"
                  animate={active && !reduce ? { y: [0, -4, 0] } : { y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Icon name={link.icon} className={cn("h-5 w-5", active ? "text-brand" : "text-ink/70")} />
                </motion.span>
                <span className="relative">{link.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            data-list-target
            className={cn(item, "w-full bg-brand text-ink")}
            onClick={() => setOpen(true)}
          >
            <Icon name="list" className="h-5 w-5" />
            Lista
            {count > 0 ? (
              <motion.span
                key={count}
                aria-hidden
                className="absolute top-1.5 right-[calc(50%-22px)] grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-extrabold text-paper"
                animate={reduce ? undefined : { scale: [1, 1.3, 1] }}
                transition={{ duration: 0.3 }}
              >
                {count}
              </motion.span>
            ) : null}
            <span className="sr-only">{listCountLabel(count)}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
