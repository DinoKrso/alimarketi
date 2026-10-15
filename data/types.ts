/**
 * Shared content types. Data files in this folder are sample content
 * meant to move to a CMS later.
 */

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type DayHours = { open: string; close: string } | null;

export type WeekHours = Record<DayKey, DayHours>;

export type StoreKind = "retail" | "wholesale";

export type Store = {
  slug: string;
  name: string;
  neighbourhood: string;
  /** Label used in the homepage neighbourhood strip. */
  marquee: string;
  /** As published on alimarketi.ba/prodavnice. */
  address: string;
  city: string;
  postalCode: string;
  /** Pin from the store's Google Maps link on alimarketi.ba/prodavnice. */
  lat: number;
  lng: number;
  phoneDisplay: string;
  phoneTel: string;
  hours: WeekHours;
  hoursSummary: string;
  kind: StoreKind;
  image: string;
  imageAlt: string;
};

export type CategoryId =
  | "voce-povrce"
  | "meso"
  | "mlijecni"
  | "pica"
  | "kucna-hemija"
  | "pekara"
  | "osnovno"
  | "slatkisi"
  | "zamrznuto";

export type Deal = {
  id: string;
  name: string;
  unit: string;
  /** Current shelf price in KM. */
  price: number;
  /** Price before the discount, in KM. Omitted when the offer has no previous price. */
  oldPrice?: number;
  category: CategoryId;
  /** Shown on the card when it differs from the category catalogue label. */
  categoryName?: string;
  /** Brand, shown above the product name. */
  brand?: string;
  /** Offer flag such as SUPER CIJENA. Empty means no badge. */
  badge?: string;
  /** ISO date, inclusive. */
  validUntil?: string;
  storeIds: "all" | string[];
  featured?: boolean;
  hero?: boolean;
  image: string;
  imageAlt: string;
};

export type Job = {
  slug: string;
  title: string;
  storeSlug: string;
  type: string;
  posted: string;
  summary: string;
  description: string[];
  requirements: string[];
};

export type FlyerPage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Flyer = {
  id: string;
  title: string;
  validFrom: string;
  validUntil: string;
  pdf: string;
  pages: FlyerPage[];
  current?: boolean;
};
