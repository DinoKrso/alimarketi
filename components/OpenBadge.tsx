"use client";

import { isStoreOpen } from "@/lib/hours";
import type { WeekHours } from "@/data/types";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

export function useOpenFlag(hours: WeekHours) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isStoreOpen(hours));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [hours]);

  return open;
}

export function OpenBadge({ hours, className }: { hours: WeekHours; className?: string }) {
  const open = useOpenFlag(hours);
  const label = open === null ? "Provjera radnog vremena" : open ? "Otvoreno sada" : "Zatvoreno";

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-2 rounded-full border border-line bg-white px-2.5 text-xs font-semibold text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative h-2.5 w-2.5 rounded-full",
          open ? "bg-fresh" : "bg-muted",
          open ? "open-pulse" : "",
        )}
      />
      {label}
    </span>
  );
}
