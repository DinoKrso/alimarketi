import type { Deal } from "@/data/types";
import { categories } from "@/data/deals";
import { stores } from "@/data/stores";

/** Bosnian plural: 1 stavka, 2–4 stavke, 5+ stavki (and 11–14). */
export function listCountLabel(count: number) {
  const mod100 = count % 100;
  const mod10 = count % 10;
  let word = "stavki";
  if (mod100 < 11 || mod100 > 14) {
    if (mod10 === 1) word = "stavka";
    else if (mod10 >= 2 && mod10 <= 4) word = "stavke";
  }
  return `${count} ${word} na listi`;
}

export function formatKm(value: number) {
  const [whole, frac] = value.toFixed(2).split(".");
  return `${whole},${frac}`;
}

/** "Važi do 12.10." from an ISO date. Parsed as a calendar date, not a timezone instant. */
export function formatValid(iso: string) {
  const [, month, day] = iso.split("-");
  return `Važi do ${Number(day)}.${month}.`;
}

export function formatRange(from: string, until: string) {
  const [, fm, fd] = from.split("-");
  const [, um, ud] = until.split("-");
  return `${Number(fd)}.${fm}.–${Number(ud)}.${um}.`;
}

export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= 0) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function categoryLabel(id: Deal["category"]) {
  return categories.find((category) => category.id === id)?.label ?? id;
}

export function dealStoresLabel(deal: Deal) {
  if (deal.storeIds === "all") return "Svi marketi";
  const names = deal.storeIds
    .map((slug) => stores.find((store) => store.slug === slug)?.neighbourhood)
    .filter(Boolean);
  if (names.length === 0) return "Odabrane poslovnice";
  if (names.length > 3) return "Odabrane poslovnice";
  return names.join(", ");
}
