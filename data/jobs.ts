/**
 * UZORAK OGLASA — SAMPLE JOB POSTS.
 * TODO(client): replace with real openings, or remove the ones that are filled.
 * Salaries are intentionally omitted.
 */
import type { Job } from "@/data/types";

export const jobs: Job[] = [
  {
    slug: "prodavac-bascarsija",
    title: "Prodavač/ica",
    storeSlug: "bascarsija",
    type: "Puno radno vrijeme",
    posted: "2026-09-28",
    summary: "Rad na kasi i u radnji, na Baščaršiji. Smjene uključuju subotu.",
    description: [
      "Tražimo osobu za rad u marketu na Baščaršiji: kasa, slaganje robe i pomoć kupcima.",
      "Posao je u smjenama, uključujući subotu. Nedjelja po rasporedu poslovnice.",
    ],
    requirements: [
      "Iskustvo u maloprodaji je prednost, nije uslov.",
      "Komunikacija s kupcima i urednost na radnom mjestu.",
      "Spremnost na smjenski rad.",
    ],
  },
  {
    slug: "mesar-vogosca",
    title: "Mesar/ka",
    storeSlug: "vogosca",
    type: "Puno radno vrijeme",
    posted: "2026-09-20",
    summary: "Priprema mesa u poslovnici Vogošća.",
    description: [
      "Rad u mesnom odjelu: priprema, vaga i držanje pulta urednim.",
      "Mjesto je u marketu u Vogošći.",
    ],
    requirements: [
      "Iskustvo u mesnici ili mesnom odjelu.",
      "Poznavanje higijene namirnica.",
    ],
  },
  {
    slug: "magacioner-halilovici",
    title: "Magacioner/ka",
    storeSlug: "cash-and-carry",
    type: "Puno radno vrijeme",
    posted: "2026-09-15",
    summary: "Skladište Cash & Carry u Halilovićima. Istovar, slaganje, komisija.",
    description: [
      "Rad u skladištu veleprodaje: prijem robe, slaganje i priprema narudžbi.",
      "Mjesto je u Halilovićima.",
    ],
    requirements: [
      "Fizička spremnost za rad u skladištu.",
      "Iskustvo s paletama je prednost.",
      "Tačnost i red u dokumentaciji prijema.",
    ],
  },
  {
    slug: "vozac-distribucija",
    title: "Vozač/ica dostave",
    storeSlug: "cash-and-carry",
    type: "Puno radno vrijeme",
    posted: "2026-09-08",
    summary: "Dostava iz Halilovića prema sarajevskim marketima i kupcima veleprodaje.",
    description: [
      "Vožnja dostavnog vozila između Cash & Carry i poslovnica, te prema B2B kupcima.",
      "Polazak je iz Halilovića.",
    ],
    requirements: [
      "Vozačka dozvola B kategorije. C kategorija je prednost.",
      "Poznavanje Sarajeva.",
      "Uredan vozni dosije.",
    ],
  },
];

export function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug);
}
