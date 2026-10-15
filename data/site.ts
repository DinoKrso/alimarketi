/**
 * Facts confirmed for the site. Do not add statistics, awards or customer counts.
 * Founded 2001. Twelve Sarajevo stores. One Cash & Carry.
 */

export const site = {
  name: "Ali Marketi",
  legalName: "ALI d.o.o.",
  url: "https://alimarketi.ba",
  city: "Sarajevo",
  founded: 2001,
  phoneDisplay: "062 340 206",
  phoneTel: "+38762340206",
  email: "ali.doo@alimarketi.ba",
  facebook: "https://www.facebook.com/alimarketisarajevo",
  instagram: "https://www.instagram.com/ali_marketi",
  viberChat: "viber://chat?number=%2B38762340206",
  /**
   * Visit address used on the contact page.
   * alimarketi.ba lists the company seat at the same address (Halilovići bb, 71000 Sarajevo).
   */
  visitLabel: "Cash & Carry, Halilovići",
  /**
   * Flip to false once live prices replace /data/deals.ts.
   * Shows a short sample-data note next to deals.
   */
  showSampleNotice: true,
} as const;

export const nav = [
  { href: "/akcije", label: "Akcije" },
  { href: "/letak", label: "Katalog" },
  { href: "/poslovnice", label: "Poslovnice" },
  { href: "/veleprodaja", label: "Veleprodaja" },
  { href: "/karijera", label: "Karijera" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
