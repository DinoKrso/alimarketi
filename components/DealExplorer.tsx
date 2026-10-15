"use client";

import { DealCard } from "@/components/DealCard";
import { akcijaCategories, namirniceDeals } from "@/data/oktobar-akcija";
import { stores } from "@/data/stores";
import type { CategoryId, Deal } from "@/data/types";
import { cn } from "@/lib/cn";
import { discountPercent } from "@/lib/format";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type SortKey = "discount" | "price" | "name";

const editorial = [...namirniceDeals].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

function matchesStore(deal: Deal, storeId: string) {
  if (storeId === "all") return true;
  if (deal.storeIds === "all") return true;
  return deal.storeIds.includes(storeId);
}

export function DealExplorer({ variant = "home" }: { variant?: "home" | "full" }) {
  const [category, setCategory] = useState<CategoryId | "sve">("sve");
  const [storeId, setStoreId] = useState("all");
  const [sort, setSort] = useState<SortKey>(variant === "full" ? "discount" : "discount");

  const visible = useMemo(() => {
    let list = (variant === "home" ? editorial : [...namirniceDeals]).filter((deal) => {
      const categoryOk = category === "sve" || deal.category === category;
      return categoryOk && matchesStore(deal, storeId);
    });

    if (variant === "full") {
      list.sort((a, b) => {
        if (sort === "price") return a.price - b.price;
        if (sort === "name") return a.name.localeCompare(b.name, "bs");
        return discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice);
      });
    }

    return list;
  }, [category, sort, storeId, variant]);

  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-6 flex sm:mb-8 gap-1.5 overflow-x-auto px-4 pb-1">
        <div className="flex gap-1.5 rounded-full border border-line bg-white/70 p-1.5 backdrop-blur">
          <Chip active={category === "sve"} onClick={() => setCategory("sve")}>
            Sve
          </Chip>
          {akcijaCategories.map((item) => (
            <Chip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>
      </div>

      {variant === "full" ? (
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-3xl border border-line bg-white p-3 sm:mb-8 sm:gap-3 sm:p-4">
          <label className="block min-w-0 text-xs font-semibold text-ink sm:text-sm">
            Poslovnica
            <select
              className="field mt-1.5"
              value={storeId}
              onChange={(event) => setStoreId(event.target.value)}
            >
              <option value="all">Sve poslovnice</option>
              {stores.map((store) => (
                <option key={store.slug} value={store.slug}>
                  {store.neighbourhood}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0 text-xs font-semibold text-ink sm:text-sm">
            Sortiranje
            <select
              className="field mt-1.5"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
            >
              <option value="discount">Najveći popust</option>
              <option value="price">Niža cijena</option>
              <option value="name">Naziv</option>
            </select>
          </label>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="rounded-3xl border border-line bg-white px-6 py-12 text-center text-lg text-muted">
          Nema akcija za ovaj izbor.
        </p>
      ) : (
        <motion.ul
          layout
          className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 lg:gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some", margin: "0px 0px -12% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((deal, index) => (
              <motion.li
                key={deal.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
                }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
              >
                <DealCard deal={deal} priority={index < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <p className="mt-6 text-center text-sm leading-relaxed text-muted">
        Cijene su izražene u KM sa uključenim PDV-om. Ponuda važi do isteka zaliha. Slike su ilustrativne.
      </p>
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative min-h-10 shrink-0 rounded-full px-4 text-[15px] font-semibold whitespace-nowrap transition-colors duration-300",
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
    </button>
  );
}
