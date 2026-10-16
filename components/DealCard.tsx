"use client";

import { Burst } from "@/components/Burst";
import { Icon } from "@/components/Icon";
import type { Deal } from "@/data/types";
import { categoryLabel, dealStoresLabel, discountPercent, formatKm, formatValid } from "@/lib/format";
import { offerBadgeClass, offerLabel } from "@/lib/ui";
import { useShoppingList } from "@/lib/shopping-list";
import { useTilt } from "@/lib/use-tilt";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

export function DealCard({ deal, priority = false }: { deal: Deal; priority?: boolean }) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const cardRef = useTilt<HTMLElement>();
  const { add, items, setQty } = useShoppingList();
  const [shot, setShot] = useState(0);
  const qty = items.find((item) => item.id === deal.id)?.qty ?? 0;
  const off = discountPercent(deal.price, deal.oldPrice);

  const addOne = () => {
    add({ id: deal.id, name: deal.name, unit: deal.unit, price: deal.price, image: deal.image }, thumbRef.current);
    setShot((value) => value + 1);
  };

  return (
    <article
      ref={cardRef}
      className="tilt group lift relative flex h-full flex-col rounded-[20px] border border-line bg-white p-1.5 sm:rounded-[26px] sm:p-2"
    >
      <div ref={thumbRef} className="img-zoom relative aspect-square overflow-hidden rounded-[15px] bg-white sm:aspect-[4/3] sm:rounded-[20px]">
        <Image
          src={deal.image}
          alt={deal.imageAlt}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-contain p-1"
          priority={priority}
        />
        {deal.badge ? (
          <span
            className={cn(
              "tag-swing absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-extrabold sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-xs",
              offerBadgeClass(deal.badge),
            )}
          >
            {offerLabel(deal.badge)}
          </span>
        ) : off > 0 ? (
          <span className="tag-swing absolute top-2 left-2 rounded-full bg-brand px-2 py-0.5 text-xs font-extrabold text-ink shadow-sm sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-sm">
            −{off}%
          </span>
        ) : null}
        <span className="absolute top-3 right-3 hidden rounded-full bg-paper/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur sm:block">
          {deal.categoryName ?? categoryLabel(deal.category)}
        </span>

        <AnimatePresence>
          {qty > 0 ? (
            <motion.div
              className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between rounded-full bg-ink/90 p-1 text-paper shadow-lg backdrop-blur sm:inset-x-2 sm:bottom-2"
              initial={{ y: 24, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 480, damping: 32 }}
            >
              <button
                type="button"
                className="press grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:h-9 sm:w-9"
                aria-label={`Smanji količinu: ${deal.name}`}
                onClick={() => setQty(deal.id, qty - 1)}
              >
                <Icon name={qty === 1 ? "trash" : "minus"} className="h-4 w-4" />
              </button>
              <span className="flex items-baseline gap-1 overflow-hidden text-xs font-semibold sm:text-sm" aria-live="polite">
                <span className="hidden text-paper/60 sm:inline">Na listi</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={qty}
                    className="inline-block font-display text-base font-extrabold tabular-nums sm:text-lg"
                    initial={{ y: -14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 14, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                  >
                    {qty}
                  </motion.span>
                </AnimatePresence>
              </span>
              <button
                type="button"
                className="press grid h-8 w-8 place-items-center rounded-full bg-brand text-ink hover:bg-brand-dark sm:h-9 sm:w-9"
                aria-label={`Povećaj količinu: ${deal.name}`}
                onClick={addOne}
              >
                <Icon name="plus" className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1.5 sm:px-3 sm:pt-4 sm:pb-3">
        {deal.brand ? (
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase sm:text-xs">{deal.brand}</p>
        ) : null}
        <h3 className="font-display text-base leading-tight font-bold text-ink sm:text-xl">{deal.name}</h3>
        <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">
          {deal.unit}
          <span className="hidden sm:inline"> · {dealStoresLabel(deal)}</span>
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:gap-3 sm:pt-5">
          <div>
            {deal.oldPrice ? (
              <p className="text-xs text-muted sm:text-sm">
                <span className="line-through decoration-ink/50">{formatKm(deal.oldPrice)} KM</span>
              </p>
            ) : null}
            <p className="font-display text-[1.6rem] leading-none font-extrabold tracking-tight text-ink tabular-nums sm:text-[2.1rem]">
              {formatKm(deal.price)}
              <span className="ml-0.5 text-xs font-bold text-brand sm:ml-1 sm:text-base">KM</span>
            </p>
            {deal.validUntil ? (
              <p className="mt-1 text-[11px] font-medium text-muted sm:mt-1.5 sm:text-xs">{formatValid(deal.validUntil)}</p>
            ) : null}
          </div>
          <button
            type="button"
            className={cn(
              "press relative grid h-10 w-10 shrink-0 place-items-center rounded-full sm:h-12 sm:w-12",
              qty > 0 ? "bg-fresh text-white" : "bg-ink text-paper hover:bg-brand hover:text-ink",
            )}
            aria-label={qty > 0 ? `Dodaj još jedan: ${deal.name}` : `Dodaj na listu: ${deal.name}`}
            onClick={addOne}
          >
            <Burst shot={shot} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={qty > 0 ? "on" : "off"}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
              >
                <Icon name={qty > 0 ? "check" : "plus"} className="h-5 w-5" strokeWidth={2.5} />
              </motion.span>
            </AnimatePresence>
            {qty > 0 ? <span className="sr-only">, na listi {qty}</span> : null}
          </button>
        </div>
      </div>
      <span aria-hidden className="tilt-glare" />
    </article>
  );
}
