import type { DayKey, WeekHours } from "@/data/types";

export const dayOrder: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const dayLabels: Record<DayKey, string> = {
  mon: "Ponedjeljak",
  tue: "Utorak",
  wed: "Srijeda",
  thu: "Četvrtak",
  fri: "Petak",
  sat: "Subota",
  sun: "Nedjelja",
};

export const schemaDays: Record<DayKey, string> = {
  mon: "https://schema.org/Monday",
  tue: "https://schema.org/Tuesday",
  wed: "https://schema.org/Wednesday",
  thu: "https://schema.org/Thursday",
  fri: "https://schema.org/Friday",
  sat: "https://schema.org/Saturday",
  sun: "https://schema.org/Sunday",
};

const weekdayToKey: Record<string, DayKey> = {
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
  Sun: "sun",
};

export function sarajevoClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sarajevo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const bag = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const day = weekdayToKey[bag.weekday] ?? "mon";
  const minutes = Number(bag.hour) * 60 + Number(bag.minute);
  return { day, minutes };
}

function toMinutes(hhmm: string) {
  const [hours, mins] = hhmm.split(":").map(Number);
  return hours * 60 + mins;
}

export function isStoreOpen(hours: WeekHours, date = new Date()) {
  const { day, minutes } = sarajevoClock(date);
  const slot = hours[day];
  if (!slot) return false;
  return minutes >= toMinutes(slot.open) && minutes < toMinutes(slot.close);
}

export function openingLine(hours: WeekHours, date = new Date()) {
  const { day, minutes } = sarajevoClock(date);
  const slot = hours[day];
  if (slot && minutes >= toMinutes(slot.open) && minutes < toMinutes(slot.close)) {
    return { open: true, text: `danas do ${slot.close}` };
  }
  if (slot && minutes < toMinutes(slot.open)) return { open: false, text: `otvaramo u ${slot.open}` };
  const index = dayOrder.indexOf(day);
  for (let step = 1; step <= 7; step += 1) {
    const next = dayOrder[(index + step) % 7];
    const nextSlot = hours[next];
    if (nextSlot) {
      const when = step === 1 ? "sutra" : dayLabels[next].toLowerCase();
      return { open: false, text: `${when} od ${nextSlot.open}` };
    }
  }
  return { open: false, text: "" };
}

export function formatSlot(slot: WeekHours[DayKey]) {
  if (!slot) return "Zatvoreno";
  return `${slot.open}–${slot.close}`;
}
