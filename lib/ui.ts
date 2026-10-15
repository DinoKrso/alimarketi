/** Shared class strings for buttons and surfaces so every page uses one vocabulary. */

const base =
  "press inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold";

export const btn = {
  primary: `${base} bg-brand text-ink shadow-[0_10px_30px_-12px_rgb(241_94_25/0.8)] hover:bg-brand-dark hover:shadow-[0_14px_34px_-12px_rgb(241_94_25/0.9)]`,
  dark: `${base} bg-ink text-paper hover:bg-ink-2`,
  light: `${base} border border-line bg-white text-ink hover:border-ink/40`,
  ghostOnDark: `${base} border border-white/25 bg-white/5 text-paper backdrop-blur hover:bg-white/15`,
  small: "press inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold",
};

export const card = "rounded-3xl border border-line bg-white";

export function offerBadgeClass(oznaka: string) {
  if (oznaka === "SUPER CIJENA") return "bg-[#C8102E] text-white";
  if (oznaka === "ZA NAJMLAĐE") return "bg-[#FFD100] text-[#0f2b21]";
  return "bg-ink text-paper";
}

export function offerLabel(oznaka: string) {
  return oznaka === "SUPER CIJENA" ? "SUPER CIJENE" : oznaka;
}

export const eyebrow =
  "inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-[13px] font-semibold tracking-wide text-ink uppercase backdrop-blur";

export const eyebrowDark =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[13px] font-semibold tracking-wide text-paper/90 uppercase backdrop-blur";
