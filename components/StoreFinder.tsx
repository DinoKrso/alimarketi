"use client";

import { Icon } from "@/components/Icon";
import { OpenBadge } from "@/components/OpenBadge";
import { stores as allStores } from "@/data/stores";
import { cn } from "@/lib/cn";
import { distanceKm, mapsDirectionsUrl } from "@/lib/geo";
import { isStoreOpen } from "@/lib/hours";
import { btn } from "@/lib/ui";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const StoreMap = dynamic(() => import("@/components/StoreMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-[#eef1ea] text-sm text-muted">Učitavam mapu…</div>
  ),
});

type Loc = { lat: number; lng: number };
type Status = "idle" | "loading" | "ok" | "denied";

const ease = [0.16, 1, 0.3, 1] as const;

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

/** Case- and diacritic-insensitive text for the store search (č → c, đ → d …). */
function fold(text: string) {
  return text.toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function nearest(loc: Loc) {
  return [...allStores].sort((a, b) => distanceKm(loc, a) - distanceKm(loc, b))[0];
}

export function StoreFinder({
  variant = "preview",
  autoLocate = false,
}: {
  variant?: "preview" | "full";
  autoLocate?: boolean;
}) {
  const [loc, setLoc] = useState<Loc | null>(null);
  const [status, setStatus] = useState<Status>(autoLocate ? "loading" : "idle");
  const [openOnly, setOpenOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  function locate() {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const here = { lat: position.coords.latitude, lng: position.coords.longitude };
        const closest = nearest(here);
        setLoc(here);
        setStatus("ok");
        setPicked(closest.slug);
        setFocus(closest.slug);
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }

  useEffect(() => {
    if (!autoLocate) return;
    if (!navigator.geolocation) {
      const id = window.setTimeout(() => setStatus("denied"), 0);
      return () => window.clearTimeout(id);
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const here = { lat: position.coords.latitude, lng: position.coords.longitude };
        const closest = nearest(here);
        setLoc(here);
        setStatus("ok");
        setPicked(closest.slug);
        setFocus(closest.slug);
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }, [autoLocate]);

  const ranked = useMemo(() => {
    const rows = allStores.map((store) => ({
      store,
      km: loc ? distanceKm(loc, store) : null,
      open: now ? isStoreOpen(store.hours, now) : null,
    }));
    if (loc) rows.sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
    return rows;
  }, [loc, now]);

  const needle = fold(query.trim());
  const visible = ranked.filter((row) => {
    if (openOnly && !row.open) return false;
    if (!needle) return true;
    return fold(`${row.store.neighbourhood} ${row.store.address} ${row.store.city}`).includes(needle);
  });
  const openCount = ranked.filter((row) => row.open).length;
  const selected =
    ranked.find((row) => row.store.slug === picked) ?? visible[0] ?? ranked[0];

  function choose(slug: string) {
    setPicked(slug);
    setFocus(slug);
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-white lift sm:rounded-[32px]">
      <div
        className={cn(
          "grid lg:grid-cols-[400px_minmax(0,1fr)]",
          variant === "full" ? "lg:h-[calc(100dvh-8rem)] lg:min-h-[560px]" : "lg:h-[640px]",
        )}
      >
        {/* List panel */}
        <aside className="order-2 flex min-h-0 min-w-0 flex-col lg:order-1 lg:border-r lg:border-line">
          <div className="space-y-3 border-b border-line p-3 sm:p-4">
            <div className="flex gap-2">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Pretraži naselje ili ulicu</span>
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">
                  <Icon name="zoom" className="h-4 w-4" />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Naselje ili ulica…"
                  className="h-11 w-full rounded-full border border-line bg-paper pr-4 pl-10 text-[15px] text-ink transition-[border-color,box-shadow] outline-none placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/20"
                />
              </label>
              <button
                type="button"
                onClick={locate}
                className={cn(
                  "press inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold",
                  status === "ok" ? "bg-brand text-ink" : "bg-ink text-paper hover:bg-ink-2",
                )}
              >
                <Icon name="navigate" className={cn("h-4 w-4", status === "loading" && "animate-pulse")} />
                <span className="hidden sm:inline">{status === "loading" ? "Tražim…" : "Najbliži"}</span>
                <span className="sr-only sm:hidden">Pronađi najbliži market</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex rounded-full bg-paper p-1" role="group" aria-label="Filter poslovnica">
                {[
                  { value: false, label: "Sve" },
                  { value: true, label: "Otvoreno sada" },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    aria-pressed={openOnly === option.value}
                    onClick={() => setOpenOnly(option.value)}
                    className={cn(
                      "relative h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors",
                      openOnly === option.value ? "text-paper" : "text-ink hover:text-ink/70",
                    )}
                  >
                    {openOnly === option.value ? (
                      <motion.span
                        layoutId={`store-filter-${variant}`}
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative">{option.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-right text-xs leading-tight text-muted">
                <span className="font-semibold text-ink">{allStores.length}</span> lokacija
                {now ? (
                  <>
                    <br />
                    <span className="font-semibold text-fresh">{openCount}</span> otvoreno sada
                  </>
                ) : null}
              </p>
            </div>

            {status === "denied" ? (
              <p className="rounded-2xl bg-brand-soft px-3 py-2 text-xs text-ink">
                Lokacija nije dozvoljena. Izaberi market sa liste ili na mapi.
              </p>
            ) : null}
            {status === "ok" ? (
              <p className="rounded-2xl bg-mist px-3 py-2 text-xs text-ink">Poredano od najbližeg prema tebi.</p>
            ) : null}
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 max-lg:max-h-[440px]">
            {visible.map((row) => {
              const active = row.store.slug === selected?.store.slug;
              return (
                <li key={row.store.slug}>
                  <button
                    type="button"
                    onClick={() => choose(row.store.slug)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "group relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-2.5 text-left transition-colors duration-200",
                      active ? "bg-paper" : "hover:bg-paper/60",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId={`store-row-${variant}`}
                        aria-hidden
                        className="absolute top-3 bottom-3 left-0 w-1 rounded-full bg-brand"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    ) : null}
                    <span className="relative h-12 w-12 overflow-hidden rounded-xl">
                      <Image src={row.store.image} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-display text-[17px] leading-tight font-bold">
                          {row.store.neighbourhood}
                        </span>
                        {row.store.kind === "wholesale" ? (
                          <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold tracking-wide text-paper uppercase">
                            Veleprodaja
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] text-muted">{row.store.address}</span>
                    </span>
                    <span className="flex flex-col items-end gap-1 text-right">
                      {row.open === null ? null : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
                          <span
                            aria-hidden
                            className={cn("h-2 w-2 rounded-full", row.open ? "bg-fresh" : "bg-ink/25")}
                          />
                          {row.open ? "Otvoreno" : "Zatvoreno"}
                        </span>
                      )}
                      {row.km != null ? (
                        <span className="text-xs font-bold text-ink">{formatDistance(row.km)}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
            {visible.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-muted">
                {openOnly ? "Trenutno nema otvorenih poslovnica za ovaj izbor." : "Nema poslovnice za tu pretragu."}
              </li>
            ) : null}
          </ul>
        </aside>

        {/* Map with the selected store floating on top */}
        <div className="relative order-1 h-[380px] min-w-0 sm:h-[460px] lg:order-2 lg:h-auto">
          <StoreMap
            stores={allStores}
            activeSlug={selected?.store.slug ?? null}
            focusSlug={focus}
            onSelect={choose}
          />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[1000] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[380px]">
            <AnimatePresence mode="wait" initial={false}>
              {selected ? (
                <motion.article
                  key={selected.store.slug}
                  className="pointer-events-auto rounded-[22px] border border-line bg-white/95 p-3 shadow-[0_24px_60px_-20px_rgb(15_43_33/0.45)] backdrop-blur-xl sm:p-4"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="flex gap-3">
                    <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:block">
                      <Image src={selected.store.image} alt={selected.store.imageAlt} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-xl leading-tight font-bold">{selected.store.neighbourhood}</h3>
                        {selected.km != null ? (
                          <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold">
                            {formatDistance(selected.km)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted">
                        {selected.store.address}, {selected.store.city}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <OpenBadge hours={selected.store.hours} />
                        <span className="hidden text-xs text-muted sm:inline">{selected.store.hoursSummary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a
                      className={cn(btn.small, "flex-1 bg-brand text-ink hover:bg-brand-dark")}
                      href={mapsDirectionsUrl(selected.store.lat, selected.store.lng)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name="navigate" className="h-4 w-4" />
                      Navigacija
                    </a>
                    <a
                      className={cn(btn.small, "w-10 border border-line bg-white px-0 hover:border-ink/40")}
                      href={`tel:${selected.store.phoneTel}`}
                      aria-label={`Pozovi ${selected.store.neighbourhood}: ${selected.store.phoneDisplay}`}
                    >
                      <Icon name="phone" className="h-4 w-4" />
                    </a>
                    <Link
                      href={`/poslovnice/${selected.store.slug}`}
                      className={cn(btn.small, "bg-ink text-paper hover:bg-ink-2")}
                    >
                      Detalji
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
