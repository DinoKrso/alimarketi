/**
 * UZORAK AKCIJA — SAMPLE PRICES.
 * These are not live shelf prices. TODO(client): replace with the current
 * weekly flyer before go-live. Validity dates follow the sample week 6–12.10.2026.
 */
import type { CategoryId, Deal } from "@/data/types";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "voce-povrce", label: "Voće i povrće" },
  { id: "meso", label: "Meso" },
  { id: "mlijecni", label: "Mliječni" },
  { id: "pica", label: "Pića" },
  { id: "kucna-hemija", label: "Kućna hemija" },
  { id: "pekara", label: "Pekara" },
  { id: "osnovno", label: "Osnovno" },
  { id: "slatkisi", label: "Slatkiši" },
  { id: "zamrznuto", label: "Zamrznuto" },
];

function deal(
  partial: Omit<Deal, "image" | "imageAlt"> & { imageAlt?: string },
): Deal {
  return {
    ...partial,
    image: `/placeholders/deals/${partial.id}.webp`,
    imageAlt:
      partial.imageAlt ??
      `Placeholder ilustracija: ${partial.name}. Prava fotografija proizvoda dolazi kasnije.`,
  };
}

export const deals: Deal[] = [
  deal({
    id: "paradajz",
    name: "Paradajz",
    unit: "1 kg",
    price: 1.49,
    oldPrice: 2.29,
    category: "voce-povrce",
    validUntil: "2026-10-12",
    storeIds: "all",
    featured: true,
    hero: true,
  }),
  deal({
    id: "pileci-file",
    name: "Pileći file",
    unit: "1 kg",
    price: 8.49,
    oldPrice: 11.99,
    category: "meso",
    validUntil: "2026-10-12",
    storeIds: "all",
    hero: true,
  }),
  deal({
    id: "banane",
    name: "Banane",
    unit: "1 kg",
    price: 1.99,
    oldPrice: 2.49,
    category: "voce-povrce",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "paprika",
    name: "Babura paprika",
    unit: "1 kg",
    price: 1.69,
    oldPrice: 2.59,
    category: "voce-povrce",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "jaja",
    name: "Jaja, A klasa",
    unit: "10 kom",
    price: 2.89,
    oldPrice: 3.59,
    category: "osnovno",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "junetina",
    name: "Junetina, but",
    unit: "1 kg",
    price: 13.99,
    oldPrice: 16.99,
    category: "meso",
    validUntil: "2026-10-12",
    storeIds: ["bascarsija", "vogosca", "bjelave", "cash-and-carry"],
  }),
  deal({
    id: "trapist",
    name: "Trapist",
    unit: "1 kg",
    price: 11.49,
    oldPrice: 14.99,
    category: "mlijecni",
    validUntil: "2026-10-12",
    storeIds: "all",
    hero: true,
  }),
  deal({
    id: "voda",
    name: "Mineralna voda",
    unit: "1,5 l",
    price: 0.65,
    oldPrice: 0.95,
    category: "pica",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "sok-jabuka",
    name: "Sok od jabuke",
    unit: "1 l",
    price: 1.29,
    oldPrice: 1.89,
    category: "pica",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "kafa",
    name: "Mljevena kafa",
    unit: "500 g",
    price: 6.99,
    oldPrice: 8.49,
    category: "osnovno",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "hljeb",
    name: "Bijeli hljeb",
    unit: "500 g",
    price: 0.9,
    oldPrice: 1.2,
    category: "pekara",
    validUntil: "2026-10-08",
    storeIds: "all",
  }),
  deal({
    id: "deterdzent",
    name: "Deterdžent za veš",
    unit: "3 kg",
    price: 7.99,
    oldPrice: 11.49,
    category: "kucna-hemija",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "toalet-papir",
    name: "Toalet papir",
    unit: "10/1",
    price: 4.49,
    oldPrice: 6.29,
    category: "kucna-hemija",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "cokolada",
    name: "Mliječna čokolada",
    unit: "100 g",
    price: 1.19,
    oldPrice: 1.69,
    category: "slatkisi",
    validUntil: "2026-10-12",
    storeIds: "all",
  }),
  deal({
    id: "grasak",
    name: "Grašak, smrznuti",
    unit: "450 g",
    price: 1.59,
    oldPrice: 2.19,
    category: "zamrznuto",
    validUntil: "2026-10-12",
    storeIds: ["luzani", "betanija", "velesici", "jarcedoli", "cash-and-carry"],
  }),
];

export const heroDeals = deals.filter((item) => item.hero);

export function dealById(id: string) {
  return deals.find((item) => item.id === id);
}
