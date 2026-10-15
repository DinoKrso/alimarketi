import type { Deal } from "@/data/types";
import proizvodiJson from "@/public/web_proizvodi/proizvodi.json";

export type Proizvod = (typeof proizvodiJson)[number];

export const proizvodi: Proizvod[] = proizvodiJson;

/** JSON stores `slike/<file>`. Files are served from the static images folder. */
export function slikaSrc(slika: string) {
  const file = slika.split("/").pop() ?? slika;
  return `/images/akcija-oktobar-2026/${file}`;
}

function toDeal(product: Proizvod): Deal {
  return {
    id: `oktobar-${product.rb}`,
    name: product.naziv,
    brand: product.brend,
    unit: product.pakovanje,
    price: product.cijena_km,
    category: "osnovno",
    categoryName: product.kategorija,
    badge: product.oznaka || undefined,
    storeIds: "all",
    featured: product.oznaka === "SUPER CIJENA",
    image: slikaSrc(product.slika),
    imageAlt: `${product.brend} ${product.naziv}`,
  };
}

/** October groceries only — the akcije grid. */
export const namirniceDeals: Deal[] = proizvodi.filter((item) => item.kategorija === "Namirnice").map(toDeal);

export const akcijaCategories = [{ id: "osnovno" as const, label: "Namirnice" }];

/** Hero cards: the super price, then two top offers from the same catalogue. */
const heroRbs = [1, 15, 44];

export const heroHighlights: Deal[] = heroRbs.map((rb) => {
  const product = proizvodi.find((item) => item.rb === rb);
  if (!product) throw new Error(`Nedostaje proizvod rb ${rb}`);
  return { ...toDeal(product), hero: true };
});
