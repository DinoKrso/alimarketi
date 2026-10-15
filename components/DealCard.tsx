"use client";

import { Icon } from "@/components/Icon";
import type { Deal } from "@/data/types";
import { categoryLabel, dealStoresLabel, discountPercent, formatKm, formatValid } from "@/lib/format";
import { offerBadgeClass, offerLabel } from "@/lib/ui";
import { useShoppingList } from "@/lib/shopping-list";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export function DealCard({ deal, priority = false }: { deal: Deal; priority?: boolean }) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const { add, items } = useShoppingList();
  const qty = items.find((item) => item.id === deal.id)?.qty ?? 0;
  const off = discountPercent(deal.price, deal.oldPrice);

  return (
    <article className="group lift lift-hover flex h-full flex-col rounded-[20px] border border-line bg-white p-1.5 sm:rounded-[26px] sm:p-2">
      <div ref={thumbRef} className="img-zoom relative aspect-square overflow-hidden rounded-[15px] bg-paper sm:aspect-[4/3] sm:rounded-[20px]">
        <Image
          src={deal.image}
          alt={deal.imageAlt}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-contain"
          priority={priority}
        />
        {deal.badge ? (
          <span className={cn("absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-extrabold sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-xs", offerBadgeClass(deal.badge))}>
            {offerLabel(deal.badge)}
          </span>
        ) : off > 0 ? (
          <span className="absolute top-2 left-2 rounded-full bg-brand px-2 py-0.5 text-xs font-extrabold text-ink shadow-sm sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-sm">
            −{off}%
          </span>
        ) : null}
        <span className="absolute top-3 right-3 hidden rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur sm:block">
          {deal.categoryName ?? categoryLabel(deal.category)}
        </span>
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
            <p className="font-display text-[1.6rem] leading-none font-extrabold tracking-tight text-ink sm:text-[2.1rem]">
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
            aria-label={`Dodaj na listu: ${deal.name}`}
            onClick={() =>
              add(
                {
                  id: deal.id,
                  name: deal.name,
                  unit: deal.unit,
                  price: deal.price,
                  image: deal.image,
                },
                thumbRef.current,
              )
            }
          >
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
            {qty > 0 ? (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-extrabold text-ink">
                {qty}
              </span>
            ) : null}
            {qty > 0 ? <span className="sr-only">, na listi {qty}</span> : null}
          </button>
        </div>
      </div>
    </article>
  );
}
