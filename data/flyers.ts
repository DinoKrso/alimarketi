/**
 * Catalog pages. The current catalog is the October 2026 PDF in public/letci.
 * Page images are rendered from that file so the viewer can flip them.
 */
import type { Flyer, FlyerPage } from "@/data/types";

const october = { width: 1157, height: 1638 };

function octoberPage(n: number, alt: string): FlyerPage {
  return { src: `/letci/oktobar-2026/strana-${n}.jpg`, alt, ...october };
}

const older = { width: 1448, height: 2048 };

function olderPage(file: string, alt: string): FlyerPage {
  return { src: `/letci/${file}`, alt, ...older };
}

export const flyers: Flyer[] = [
  {
    id: "2026-oktobar",
    title: "Jesenska ponuda · Oktobar",
    validFrom: "2026-10-01",
    validUntil: "2026-10-31",
    pdf: "/letci/Ali_Marketi_Katalog_Oktobar_2026_FINAL.pdf",
    current: true,
    pages: [
      octoberPage(1, "Naslovnica oktobarske ponude: Karlovačko, madeleines, Tide, Mokate i Elseve."),
      octoberPage(2, "Namirnice: jaja, margarin, kečap, majoneza, brašno i riža."),
      octoberPage(3, "Slatko i grickalice: madeleines, čokolada, čips i sokovi za djecu."),
      octoberPage(4, "Pića: voćni napitak, energetska pića, sokovi i pivo."),
      octoberPage(5, "Kozmetika i dom: deterdžent, šampon, sapun, toalet papir i ubrusi."),
    ],
  },
  {
    id: "2025-maj-juni",
    title: "Ponuda Maj i Juni",
    validFrom: "2025-05-01",
    validUntil: "2025-07-01",
    pdf: "",
    pages: [
      olderPage("katalog1.jpg", "Ponuda za maj, prva strana: pića, grickalice i kućna hemija."),
      olderPage("katalog2.jpg", "Ponuda za maj, druga strana: mliječni proizvodi, grickalice i slatkiši."),
      olderPage("katalog3.jpg", "Ponuda za juni: mliječni proizvodi, namirnice i kućna hemija."),
    ],
  },
];

export const currentFlyer = flyers.find((flyer) => flyer.current) ?? flyers[0];

export function getFlyer(id: string) {
  return flyers.find((flyer) => flyer.id === id);
}
