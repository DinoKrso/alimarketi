"use client";

import type { Store } from "@/data/types";
import { isStoreOpen } from "@/lib/hours";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  stores: Store[];
  /** Store drawn as the highlighted (dark) pin. */
  activeSlug?: string | null;
  /** Store the map flies to. Kept separate so a default highlight does not zoom the map in. */
  focusSlug?: string | null;
  onSelect?: (slug: string) => void;
};

function pinIcon(open: boolean | null, active: boolean, delayMs: number) {
  const status = open ? "is-open" : "";
  const shape = active ? "pin-shape is-active" : "pin-shape";
  return L.divIcon({
    className: "store-pin",
    iconSize: [28, 34],
    iconAnchor: [14, 32],
    tooltipAnchor: [0, -30],
    html: `<span class="pin-wrap pin-drop${active ? " pin-active" : ""}" style="animation-delay:${delayMs}ms"><span class="${shape}"></span><span class="pin-dot ${status}"></span></span>`,
  });
}

function FitBounds({ stores }: { stores: Store[] }) {
  const map = useMap();
  const key = stores.map((store) => store.slug).join("|");
  useEffect(() => {
    if (stores.length === 0) return;
    const bounds = L.latLngBounds(stores.map((store) => [store.lat, store.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
    // Refit only when the set of stores changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
  return null;
}

function FocusStore({ slug, stores }: { slug?: string | null; stores: Store[] }) {
  const map = useMap();
  useEffect(() => {
    if (!slug) return;
    const store = stores.find((item) => item.slug === slug);
    if (!store) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const latLng: [number, number] = [store.lat, store.lng];
    if (reduce) map.setView(latLng, 15);
    else map.flyTo(latLng, 15, { duration: 0.6 });
  }, [map, slug, stores]);
  return null;
}

export default function StoreMap({ stores, activeSlug, focusSlug, onSelect }: Props) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const tick = () => {
      const next: Record<string, boolean> = {};
      for (const store of stores) next[store.slug] = isStoreOpen(store.hours);
      setOpenMap(next);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [stores]);

  const icons = useMemo(() => {
    return Object.fromEntries(
      stores.map((store, index) => [
        store.slug,
        pinIcon(openMap[store.slug] ?? null, store.slug === activeSlug, index * 45),
      ]),
    );
  }, [activeSlug, openMap, stores]);

  return (
    <MapContainer
      center={[43.8563, 18.4131]}
      zoom={12}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
      aria-label="Mapa poslovnica Ali Marketi"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ZoomControl position="topright" />
      <FitBounds stores={stores} />
      <FocusStore slug={focusSlug} stores={stores} />
      {stores.map((store) => (
        <Marker
          key={store.slug}
          position={[store.lat, store.lng]}
          icon={icons[store.slug]}
          title={store.name}
          eventHandlers={{ click: () => onSelect?.(store.slug) }}
          zIndexOffset={store.slug === activeSlug ? 400 : 0}
        >
          <Tooltip direction="top" className="store-tip" opacity={1}>
            {store.neighbourhood}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
