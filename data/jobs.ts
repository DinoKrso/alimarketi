/**
 * Otvorene pozicije. Nije vezano za jednu poslovnicu.
 */
import type { Job } from "@/data/types";

export const jobs: Job[] = [
  {
    slug: "trgovac-prodavac",
    title: "TRGOVAC / PRODAVAČ (m/ž) - VIŠE IZVRŠILACA",
    storeSlug: "",
    type: "Više izvršilaca",
    posted: "2026-10-21",
    summary: "Rad u marketima Ali Marketi. Tražimo više izvršilaca.",
    description: [
      "Tražimo trgovce i prodavače za rad u marketima. Otvoreno je više mjesta.",
      "Posao obuhvata rad na kasi, slaganje robe i pomoć kupcima.",
    ],
    requirements: [
      "Iskustvo u maloprodaji je prednost, nije uslov.",
      "Komunikacija s kupcima i urednost na radnom mjestu.",
    ],
  },
];

export function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug);
}
