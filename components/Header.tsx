"use client";

import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { nav } from "@/data/site";
import { listCountLabel } from "@/lib/format";
import { useShoppingList } from "@/lib/shopping-list";
import { cn } from "@/lib/cn";
import { btn } from "@/lib/ui";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function ListButton({ className }: { className?: string }) {
  const { count, setOpen } = useShoppingList();
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      data-list-target
      className={cn(
        "press relative h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-[15px] font-semibold text-ink hover:border-ink/40",
        className,
      )}
      onClick={() => setOpen(true)}
    >
      <Icon name="list" className="h-4 w-4" />
      Moja lista
      {count > 0 ? (
        <motion.span
          key={count}
          aria-hidden
          className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-extrabold text-ink"
          initial={false}
          animate={reduce ? { scale: 1 } : { scale: [1, 1.3, 1] }}
          transition={{ duration: 0.3 }}
        >
          {count}
        </motion.span>
      ) : null}
      <span className="sr-only">{listCountLabel(count)}</span>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menu = menuPath === pathname;
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 16));

  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <header className="sticky top-0 z-40 px-2 pt-2 sm:px-3">
      <div
        className={cn(
          "mx-auto flex h-[68px] max-w-7xl items-center gap-3 rounded-full pr-3 pl-4 transition-[background-color,box-shadow,border-color] duration-500 sm:pr-3 sm:pl-5 md:h-[76px]",
          scrolled || menu
            ? "border border-line bg-white/85 shadow-[0_10px_40px_-20px_rgb(15_43_33/0.35)] backdrop-blur-xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <Logo onNavigate={() => setMenuPath(null)} />
        <nav
          className="ml-8 hidden items-center xl:flex"
          aria-label="Glavna navigacija"
          onMouseLeave={() => setHovered(null)}
        >
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const lit = hovered ? hovered === item.href : active;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(item.href)}
                className="relative rounded-full px-3.5 py-2 text-[15px] font-medium text-ink"
              >
                {lit ? (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn("absolute inset-0 rounded-full", active && !hovered ? "bg-ink/[0.07]" : "bg-ink/[0.05]")}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
                {active ? (
                  <span aria-hidden className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand" />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ListButton className="hidden md:inline-flex" />
          <Link href="/poslovnice?najblizi=1" className="press inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-[15px] font-semibold whitespace-nowrap text-ink shadow-[0_10px_30px_-12px_rgb(241_94_25/0.8)] hover:bg-brand-dark max-sm:hidden">
            <Icon name="navigate" className="h-4 w-4" />
            Najbliži market
          </Link>
          <button
            type="button"
            className="press grid h-11 w-11 place-items-center rounded-full border border-line bg-white xl:hidden"
            aria-expanded={menu}
            aria-controls="mobilni-meni"
            onClick={() => setMenuPath(menu ? null : pathname)}
          >
            <span className="sr-only">{menu ? "Zatvori meni" : "Otvori meni"}</span>
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-full rounded bg-ink transition-transform duration-300",
                  menu ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-0.5 rounded bg-ink transition-all duration-300",
                  menu ? "top-1.5 w-full -rotate-45" : "top-3 w-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu ? (
          <motion.div
            id="mobilni-meni"
            className="fixed inset-x-2 top-[84px] bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-40 md:bottom-2 overflow-y-auto rounded-[28px] border border-line bg-white/95 shadow-2xl backdrop-blur-xl xl:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.nav
              className="flex flex-col px-5 py-6"
              aria-label="Mobilna navigacija"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
            >
              {nav.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between border-b border-line py-4 font-display text-3xl font-bold tracking-tight text-ink"
                  >
                    {item.label}
                    <Icon name="arrow" className="h-5 w-5 text-brand" />
                  </Link>
                </motion.div>
              ))}
              <Link href="/poslovnice?najblizi=1" className={cn(btn.primary, "mt-6")}>
                <Icon name="navigate" className="h-4 w-4" />
                Najbliži market
              </Link>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
