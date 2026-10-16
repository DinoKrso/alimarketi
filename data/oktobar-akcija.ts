import type { CategoryId, Deal } from "@/data/types";
import proizvodiJson from "@/public/web_proizvodi/proizvodi.json";

export type Proizvod = (typeof proizvodiJson)[number];

export const proizvodi: Proizvod[] = proizvodiJson;

/** JSON stores `slike/<file>`. Files are served from the static images folder. */
export function slikaSrc(slika: string) {
  const file = slika.split("/").pop() ?? slika;
  return `/images/akcija-oktobar-2026/${file}`;
}

export const akcijaCategories: { id: CategoryId; label: string; kategorija: string }[] = [
  { id: "osnovno", label: "Namirnice", kategorija: "Namirnice" },
  { id: "slatkisi", label: "Slatko i grickalice", kategorija: "Slatko i grickalice" },
  { id: "pica", label: "Pića", kategorija: "Pića" },
  { id: "kucna-hemija", label: "Kozmetika i dom", kategorija: "Kozmetika i dom" },
];

function categoryOf(kategorija: string): CategoryId {
  return akcijaCategories.find((item) => item.kategorija === kategorija)?.id ?? "osnovno";
}

const flagRank: Record<string, number> = {
  "SUPER CIJENA": 0,
  "+3 GRATIS": 1,
  "+2 GRATIS": 1,
  "TOP PONUDA": 2,
  "ZA NAJMLAĐE": 3,
};

function toDeal(product: Proizvod): Deal {
  return {
    id: `oktobar-${product.rb}`,
    name: product.naziv,
    brand: product.brend,
    unit: product.pakovanje,
    price: product.cijena_km,
    category: categoryOf(product.kategorija),
    categoryName: product.kategorija,
    badge: product.oznaka || undefined,
    storeIds: "all",
    featured: Boolean(product.oznaka),
    image: slikaSrc(product.slika),
    imageAlt: `${product.brend} ${product.naziv}`,
  };
}

export const oktobarDeals: Deal[] = proizvodi.map(toDeal);

export const editorialDeals: Deal[] = [...oktobarDeals].sort(
  (a, b) => (flagRank[a.badge ?? ""] ?? 9) - (flagRank[b.badge ?? ""] ?? 9),
);

/** Hero cards: the super price, then two top offers from the same catalogue. */
const heroRbs = [1, 15, 44];

export const heroHighlights: Deal[] = heroRbs.map((rb) => {
  const product = proizvodi.find((item) => item.rb === rb);
  if (!product) throw new Error(`Nedostaje proizvod rb ${rb}`);
  return { ...toDeal(product), hero: true };
});
