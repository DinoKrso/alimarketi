"use client";

import { Icon } from "@/components/Icon";
import { SplitTitle } from "@/components/Motion";
import { NeighbourhoodMarquee } from "@/components/NeighbourhoodMarquee";
import { heroHighlights } from "@/data/oktobar-akcija";
import { currentFlyer } from "@/data/flyers";
import { cn } from "@/lib/cn";
import { discountPercent, formatKm, formatRange, formatValid } from "@/lib/format";
import { btn, offerBadgeClass, offerLabel } from "@/lib/ui";
import { useSplashDone } from "@/components/Splash";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";

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

const facts = [
  { icon: "store", label: "12 marketa", sub: "+ Cash & Carry" },
  { icon: "clock", label: "07–22 h", sub: "pon–sub" },
  { icon: "tag", label: "Novi katalog", sub: formatRange(currentFlyer.validFrom, currentFlyer.validUntil) },
] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const drift = useWide() && !reduce;
  const ready = useSplashDone();
  const go = <T,>(target: T) => (ready ? target : undefined);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cardsY = [
    useTransform(scrollYProgress, [0, 1], [0, -60]),
    useTransform(scrollYProgress, [0, 1], [0, -160]),
    useTransform(scrollYProgress, [0, 1], [0, -240]),
  ];
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const maxOff = Math.max(0, ...heroHighlights.map((deal) => discountPercent(deal.price, deal.oldPrice)));
  const [lead, ...rest] = heroHighlights;

  return (
    <section ref={ref} className="px-2 pt-2 sm:px-3">
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
              className="font-display text-[clamp(3rem,7.4vw,6.4rem)] leading-[0.92] font-bold tracking-[-0.04em] text-paper"
            />
            <motion.p
              className="mt-6 max-w-[38ch] text-lg leading-relaxed text-paper/75 md:text-xl"
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
              <Link href="/akcije" className={btn.primary}>
                Pogledaj akcije
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
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
                  key={fact.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur sm:p-4"
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
                >
                  <Icon name={fact.icon} className="h-5 w-5 text-brand" />
                  <p className="mt-3 font-display text-base leading-tight font-bold text-paper sm:text-lg">{fact.label}</p>
                  <p className="text-xs text-paper/60 sm:text-sm">{fact.sub}</p>
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
              <motion.div
                className="hero-offer-stamp absolute z-20 hidden h-52 w-52 origin-center lg:top-0 lg:right-1 lg:block"
                initial={{ scale: 0.7, rotate: -16, opacity: 0 }}
                animate={go({ scale: 1, rotate: -6, opacity: 1 })}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.9 }}
              >
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
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
            ) : null}

            <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0">
              {lead ? (
                <motion.div
                  className="flex w-[84%] shrink-0 snap-start sm:w-[46%] lg:absolute lg:top-10 lg:left-[6%] lg:block lg:w-[58%]"
                  style={drift ? { y: cardsY[0] } : undefined}
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
                  style={drift ? { y: cardsY[index + 1] } : undefined}
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
  const off = discountPercent(deal.price, deal.oldPrice);
  return (
    <motion.article
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]"
      initial={{ opacity: 0, y: 60, rotate: large ? -3 : 3 }}
      animate={ready ? { opacity: 1, y: 0, rotate: 0 } : undefined}
      transition={{ duration: 1.1, ease, delay }}
    >
      <div className={cn("img-zoom relative aspect-[16/10] shrink-0 overflow-hidden bg-white", !large && "lg:aspect-[16/9]")}>
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
              "absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-extrabold tracking-wide",
              large && "lg:px-3.5 lg:py-1.5 lg:text-sm",
              offerBadgeClass(deal.badge),
            )}
          >
            {offerLabel(deal.badge)}
          </span>
        ) : off > 0 ? (
          <span className="absolute top-3 left-3 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-paper">−{off}%</span>
        ) : null}
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
          <p className={cn("font-display text-2xl leading-none font-extrabold text-brand sm:text-3xl", large ? "lg:text-4xl" : "lg:text-2xl")}>
            {formatKm(deal.price)}
            <span className="ml-1 text-sm font-bold text-ink">KM</span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}
