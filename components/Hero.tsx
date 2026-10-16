"use client";

import { Burst } from "@/components/Burst";
import { Icon, type IconName } from "@/components/Icon";
import { Magnetic } from "@/components/Magnetic";
import { SplitTitle } from "@/components/Motion";
import { NeighbourhoodMarquee } from "@/components/NeighbourhoodMarquee";
import { heroHighlights } from "@/data/oktobar-akcija";
import { currentFlyer } from "@/data/flyers";
import { retailHours } from "@/data/stores";
import { cn } from "@/lib/cn";
import { discountPercent, formatKm, formatRange, formatValid } from "@/lib/format";
import { openingLine } from "@/lib/hours";
import { useShoppingList } from "@/lib/shopping-list";
import { btn, offerBadgeClass, offerLabel } from "@/lib/ui";
import { useTilt } from "@/lib/use-tilt";
import { useSplashDone } from "@/components/Splash";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const burstPoints =
  "100,14 112.9,35.3 132.9,20.5 136.7,45.1 160.8,39.2 154.9,63.3 179.5,67.1 164.7,87.1 186,100 164.7,112.9 179.5,132.9 154.9,136.7 160.8,160.8 136.7,154.9 132.9,179.5 112.9,164.7 100,186 87.1,164.7 67.1,179.5 63.3,154.9 39.2,160.8 45.1,136.7 20.5,132.9 35.3,112.9 14,100 35.3,87.1 20.5,67.1 45.1,63.3 39.2,39.2 63.3,45.1 67.1,20.5 87.1,35.3";

const wide = "(min-width: 1024px)";

/** Cards only drift apart on the wide, absolutely-positioned layout; stacked on phones they would collide. */
function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(wide);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(wide).matches,
    () => false,
  );
}

function useOpeningLine() {
  const [line, setLine] = useState<ReturnType<typeof openingLine> | null>(null);
  useEffect(() => {
    const tick = () => setLine(openingLine(retailHours));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return line;
}

function useDepth(scroll: MotionValue<number>, pointerX: MotionValue<number>, pointerY: MotionValue<number>, depth: number) {
  const x = useTransform(pointerX, (value) => value * depth);
  const y = useTransform(() => scroll.get() + pointerY.get() * depth);
  return { x, y };
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const drift = useWide() && !reduce;
  const ready = useSplashDone();
  const opening = useOpeningLine();
  const go = <T,>(target: T) => (ready ? target : undefined);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, { stiffness: 70, damping: 20, mass: 0.6 });
  const py = useSpring(pointerY, { stiffness: 70, damping: 20, mass: 0.6 });
  const cards = [
    useDepth(useTransform(scrollYProgress, [0, 1], [0, -60]), px, py, 18),
    useDepth(useTransform(scrollYProgress, [0, 1], [0, -160]), px, py, -28),
    useDepth(useTransform(scrollYProgress, [0, 1], [0, -240]), px, py, 36),
  ];
  const stamp = useDepth(useTransform(scrollYProgress, [0, 1], [0, -90]), px, py, 48);

  const maxOff = Math.max(0, ...heroHighlights.map((deal) => discountPercent(deal.price, deal.oldPrice)));
  const [lead, ...rest] = heroHighlights;

  const facts: { icon: IconName; label: string; sub: string; live?: boolean }[] = [
    { icon: "store", label: "12 marketa", sub: "+ Cash & Carry" },
    opening
      ? { icon: "clock", label: opening.open ? "Otvoreno" : "Zatvoreno", sub: opening.text, live: opening.open }
      : { icon: "clock", label: "07–22 h", sub: "pon–sub" },
    { icon: "tag", label: "Novi katalog", sub: formatRange(currentFlyer.validFrom, currentFlyer.validUntil) },
  ];

  return (
    <section
      ref={ref}
      className="px-2 pt-2 sm:px-3"
      onPointerMove={(event) => {
        if (!drift || event.pointerType !== "mouse") return;
        pointerX.set(event.clientX / window.innerWidth - 0.5);
        pointerY.set(event.clientY / window.innerHeight - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="panel-ink mx-auto max-w-[1600px] rounded-[28px] sm:rounded-[36px]">
        <motion.div
          aria-hidden
          className="glow-orb top-[-10%] right-[-5%] h-[520px] w-[520px] bg-brand/30"
          style={reduce ? undefined : { scale: glowScale }}
        />
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 pt-10 pb-8 sm:px-8 md:pt-20 lg:min-h-[calc(100svh-150px)] lg:grid-cols-12 lg:gap-8 lg:pt-16">
          <motion.div className="min-w-0 lg:col-span-6" style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
            <SplitTitle
              as="h1"
              immediate
              delay={0.05}
              text="Vaša dnevna rutina"
              accent={["rutina"]}
              underline={["rutina"]}
              className="font-display text-[clamp(3rem,7.4vw,6.4rem)] leading-[0.92] font-bold tracking-[-0.04em] text-paper"
            />
            <motion.p
              className="mt-7 max-w-[38ch] text-lg leading-relaxed text-paper/75 md:text-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={go({ opacity: 1, y: 0 })}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
            >
              Dvanaest marketa po Sarajevu. Svježe, blizu kuće i po pravoj cijeni - svake sedmice nove akcije.
            </motion.p>
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={go({ opacity: 1, y: 0 })}
              transition={{ duration: 0.8, ease, delay: 0.55 }}
            >
              <Magnetic>
                <Link href="/akcije" className={cn(btn.primary, "group/cta")}>
                  Pogledaj akcije
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </Magnetic>
              <a href="#pronadji" className={btn.ghostOnDark}>
                <Icon name="pin" className="h-4 w-4" />
                Pronađi market
              </a>
            </motion.div>
            <motion.ul
              className="mt-9 grid max-w-xl grid-cols-3 gap-2 sm:mt-12 sm:gap-3"
              initial="hidden"
              animate={ready ? "show" : "hidden"}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}
            >
              {facts.map((fact) => (
                <motion.li
                  key={fact.icon}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07] sm:p-4"
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={fact.icon} className="h-5 w-5 text-brand" />
                    {fact.live ? <span aria-hidden className="open-pulse h-2 w-2 rounded-full bg-fresh" /> : null}
                  </span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={fact.label}
                      className="block"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease }}
                    >
                      <span className="mt-3 block font-display text-base leading-tight font-bold text-paper sm:text-lg">{fact.label}</span>
                      <span className="block text-xs text-paper/60 sm:text-sm">{fact.sub}</span>
                    </motion.span>
                  </AnimatePresence>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <div className="relative min-w-0 lg:col-span-6 lg:h-[600px]">
            {maxOff > 0 ? (
              <motion.div
                className="absolute z-20 hidden h-24 w-24 place-items-center rounded-full bg-brand text-center text-ink shadow-[0_20px_50px_-15px_rgb(241_94_25/0.8)] sm:h-28 sm:w-28 lg:top-6 lg:right-6 lg:grid"
                initial={{ scale: 0, rotate: -40 }}
                animate={go({ scale: 1, rotate: -12 })}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.9 }}
              >
                <span className="leading-none">
                  <span className="block text-xs font-semibold tracking-wide uppercase">do</span>
                  <span className="block font-display text-3xl font-extrabold sm:text-4xl">−{maxOff}%</span>
                </span>
              </motion.div>
            ) : lead?.badge ? (
              <motion.div className="absolute z-20 hidden lg:top-0 lg:right-1 lg:block" style={drift ? stamp : undefined}>
                <motion.div
                  className="hero-offer-stamp relative h-52 w-52 origin-center"
                  initial={{ scale: 0.7, rotate: -16, opacity: 0 }}
                  animate={go({ scale: 1, rotate: -6, opacity: 1 })}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: ready ? 0 : 0.9 }}
                >
                  <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                    <defs>
                      <filter id="offer-burst-glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#F15E19" floodOpacity="0.55" />
                      </filter>
                    </defs>
                    <polygon points={burstPoints} fill="#F15E19" stroke="#fff" strokeWidth="5" strokeLinejoin="round" filter="url(#offer-burst-glow)" />
                  </svg>
                  <span className="relative grid h-full w-full place-items-center px-11 text-center text-[#fff6e8]">
                    <span>
                      <span className="block text-[13px] font-extrabold tracking-[0.22em]">{offerLabel(lead.badge).split(" ")[0]}</span>
                      <span className="mt-1 block font-display text-[2rem] leading-none font-extrabold tracking-tight">
                        {offerLabel(lead.badge).split(" ").slice(1).join(" ") || offerLabel(lead.badge)}
                      </span>
                    </span>
                  </span>
                </motion.div>
              </motion.div>
            ) : null}

            <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0">
              {lead ? (
                <motion.div
                  className="flex w-[84%] shrink-0 snap-start sm:w-[46%] lg:absolute lg:top-8 lg:left-0 lg:block lg:w-[57%]"
                  style={drift ? cards[0] : undefined}
                >
                  <HeroDealCard deal={lead} large delay={0.35} ready={ready} />
                </motion.div>
              ) : null}
              {rest.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  className={cn(
                    "flex w-[84%] shrink-0 snap-start sm:w-[46%] lg:absolute lg:block lg:w-[40%]",
                    index === 0 ? "lg:top-[38%] lg:right-0" : "lg:bottom-0 lg:left-[18%]",
                  )}
                  style={drift ? cards[index + 1] : undefined}
                >
                  <HeroDealCard deal={deal} delay={0.5 + index * 0.12} ready={ready} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-4">
          <NeighbourhoodMarquee />
        </div>
      </div>
    </section>
  );
}

function HeroDealCard({
  deal,
  large = false,
  delay,
  ready,
}: {
  deal: (typeof heroHighlights)[number];
  large?: boolean;
  delay: number;
  ready: boolean;
}) {
  const tiltRef = useTilt<HTMLDivElement>(9);
  const thumbRef = useRef<HTMLDivElement>(null);
  const { add, items } = useShoppingList();
  const [shot, setShot] = useState(0);
  const qty = items.find((item) => item.id === deal.id)?.qty ?? 0;
  const off = discountPercent(deal.price, deal.oldPrice);

  return (
    <motion.article
      className="flex h-full w-full"
      initial={{ opacity: 0, y: 60, rotate: large ? -3 : 3 }}
      animate={ready ? { opacity: 1, y: 0, rotate: 0 } : undefined}
      transition={{ duration: 1.1, ease, delay }}
    >
      <div
        ref={tiltRef}
        className="tilt group relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]"
      >
        <div ref={thumbRef} className={cn("img-zoom relative aspect-[16/10] shrink-0 overflow-hidden bg-white", !large && "lg:aspect-[16/9]")}>
          <Image
            src={deal.image}
            alt={deal.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-contain p-3"
          />
          {deal.badge ? (
            <span
              className={cn(
                "tag-swing absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-extrabold tracking-wide",
                large && "lg:px-3.5 lg:py-1.5 lg:text-sm",
                offerBadgeClass(deal.badge),
              )}
            >
              {offerLabel(deal.badge)}
            </span>
          ) : off > 0 ? (
            <span className="absolute top-3 left-3 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-paper">−{off}%</span>
          ) : null}
          <button
            type="button"
            className={cn(
              "press absolute right-3 bottom-3 grid h-11 w-11 place-items-center rounded-full shadow-lg",
              qty > 0 ? "bg-fresh text-white" : "bg-ink text-paper hover:bg-brand hover:text-ink",
            )}
            aria-label={qty > 0 ? `Na listi ${qty}. Dodaj još jedan: ${deal.name}` : `Dodaj na listu: ${deal.name}`}
            onClick={() => {
              add({ id: deal.id, name: deal.name, unit: deal.unit, price: deal.price, image: deal.image }, thumbRef.current);
              setShot((value) => value + 1);
            }}
          >
            <Burst shot={shot} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={qty > 0 ? qty : "add"}
                className="font-display text-base font-extrabold tabular-nums"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
              >
                {qty > 0 ? qty : <Icon name="plus" className="h-5 w-5" strokeWidth={2.5} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
        <div className="mt-auto flex flex-1 items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className={cn("line-clamp-2 min-h-[2.5em] font-display text-lg leading-tight font-bold", large ? "lg:text-xl" : "lg:text-base lg:min-h-0")}>{deal.name}</p>
            <p className="text-sm text-muted">
              {deal.brand ? `${deal.brand} · ` : null}
              {deal.unit}
              {deal.validUntil ? ` · ${formatValid(deal.validUntil)}` : null}
            </p>
          </div>
          <div className="shrink-0 text-right">
            {deal.oldPrice ? <p className="text-xs text-muted line-through">{formatKm(deal.oldPrice)} KM</p> : null}
            <p className={cn("font-display text-2xl leading-none font-extrabold text-brand tabular-nums sm:text-3xl", large ? "lg:text-4xl" : "lg:text-2xl")}>
              {formatKm(deal.price)}
              <span className="ml-1 text-sm font-bold text-ink">KM</span>
            </p>
          </div>
        </div>
        <span aria-hidden className="tilt-glare" />
      </div>
    </motion.article>
  );
}
