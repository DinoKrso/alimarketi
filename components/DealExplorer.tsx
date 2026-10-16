"use client";

import { DealCard } from "@/components/DealCard";
import { Icon } from "@/components/Icon";
import { akcijaCategories, editorialDeals, oktobarDeals } from "@/data/oktobar-akcija";
import type { CategoryId, Deal } from "@/data/types";
import { cn } from "@/lib/cn";
import { productCountLabel } from "@/lib/format";
import { btn } from "@/lib/ui";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState } from "react";

type SortKey = "featured" | "price" | "name";

const sorts: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Istaknuto" },
  { id: "price", label: "Najjeftinije" },
  { id: "name", label: "A–Ž" },
];

const HOME_LIMIT = 8;

function fold(value: string) {
  return value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

const haystack = new Map(oktobarDeals.map((deal) => [deal.id, fold(`${deal.brand ?? ""} ${deal.name} ${deal.categoryName ?? ""}`)]));

function countFor(category: CategoryId | "sve") {
  return category === "sve" ? oktobarDeals.length : oktobarDeals.filter((deal) => deal.category === category).length;
}

export function DealExplorer({ variant = "home" }: { variant?: "home" | "full" }) {
  const full = variant === "full";
  const [category, setCategory] = useState<CategoryId | "sve">("sve");
  const [sort, setSort] = useState<SortKey>("featured");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const group = useId();

  const matching = useMemo(() => {
    const needle = fold(deferredQuery.trim());
    const list: Deal[] = editorialDeals.filter((deal) => {
      if (category !== "sve" && deal.category !== category) return false;
      return !needle || (haystack.get(deal.id) ?? "").includes(needle);
    });
    if (sort === "price") list.sort((a, b) => a.price - b.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "bs"));
    return list;
  }, [category, deferredQuery, sort]);

  const visible = full ? matching : matching.slice(0, HOME_LIMIT);

  return (
    <LayoutGroup id={group}>
      <div className="mb-6 flex flex-col gap-3 sm:mb-8">
        <div className="no-scrollbar -mx-4 flex overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div className="flex gap-1 rounded-full border border-line bg-white/70 p-1.5 backdrop-blur" role="group" aria-label="Kategorije">
            <Chip active={category === "sve"} count={countFor("sve")} onClick={() => setCategory("sve")}>
              Sve
            </Chip>
            {akcijaCategories.map((item) => (
              <Chip key={item.id} active={category === item.id} count={countFor(item.id)} onClick={() => setCategory(item.id)}>
                {item.label}
              </Chip>
            ))}
          </div>
        </div>

        {full ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block min-w-0 flex-1 sm:max-w-md">
              <span className="sr-only">Pretraži akcije</span>
              <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Traži proizvod ili brend"
                className="h-12 w-full rounded-full border border-line bg-white pr-11 pl-11 text-base text-ink transition-[border-color,box-shadow] outline-none placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/20 [&::-webkit-search-cancel-button]:hidden"
              />
              <AnimatePresence>
                {query ? (
                  <motion.button
                    type="button"
                    aria-label="Očisti pretragu"
                    className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-ink/5 text-ink hover:bg-ink/10"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    onClick={() => setQuery("")}
                  >
                    <Icon name="close" className="h-4 w-4" />
                  </motion.button>
                ) : null}
              </AnimatePresence>
            </label>
            <div className="flex shrink-0 rounded-full border border-line bg-white p-1 sm:ml-auto" role="group" aria-label="Sortiranje">
              {sorts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={sort === item.id}
                  onClick={() => setSort(item.id)}
                  className={cn(
                    "relative min-h-10 flex-1 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 sm:flex-none",
                    sort === item.id ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {sort === item.id ? (
                    <motion.span
                      layoutId="deal-sort"
                      className="absolute inset-0 rounded-full bg-brand-soft"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {full ? (
        <p className="mb-4 text-sm font-medium text-muted" aria-live="polite">
          {productCountLabel(matching.length)}
          {deferredQuery.trim() ? ` za „${deferredQuery.trim()}”` : null}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-white/60 px-6 py-14 text-center"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
            <Icon name="search" />
          </span>
          <p className="mt-4 font-display text-2xl font-bold">Ništa za „{query.trim()}”</p>
          <p className="mt-1 text-muted">Probaj kraći naziv ili samo brend.</p>
          <button
            type="button"
            className={cn(btn.light, "mt-6")}
            onClick={() => {
              setQuery("");
              setCategory("sve");
            }}
          >
            Prikaži sve akcije
          </button>
        </motion.div>
      ) : (
        <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          <AnimatePresence mode="popLayout">
            {visible.map((deal, index) => (
              <motion.li
                key={deal.id}
                layout="position"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                  delay: (index % 4) * 0.06,
                  layout: { type: "spring", stiffness: 380, damping: 36 },
                }}
              >
                <DealCard deal={deal} priority={index < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {!full && matching.length > HOME_LIMIT ? (
        <div className="mt-6 flex justify-center sm:mt-8">
          <Link href="/akcije" className={btn.light}>
            Još {matching.length - HOME_LIMIT} u katalogu
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm leading-relaxed text-muted">
        Cijene su izražene u KM sa uključenim PDV-om. Ponuda važi do isteka zaliha. Slike su ilustrativne.
      </p>
    </LayoutGroup>
  );
}

function Chip({
  active,
  count,
  children,
  onClick,
}: {
  active: boolean;
  count: number;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex min-h-10 shrink-0 items-center gap-2 rounded-full pr-2 pl-4 text-[15px] font-semibold whitespace-nowrap transition-colors duration-300",
        active ? "text-paper" : "text-ink hover:bg-ink/5",
      )}
    >
      {active ? (
        <motion.span
          layoutId="deal-chip"
          className="absolute inset-0 rounded-full bg-ink"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
      <span className="relative">{children}</span>
      <span
        className={cn(
          "relative grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold tabular-nums transition-colors duration-300",
          active ? "bg-brand text-ink" : "bg-ink/[0.06] text-muted",
        )}
      >
        {count}
      </span>
    </button>
  );
}
