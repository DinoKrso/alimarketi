"use client";

import type { Store } from "@/data/types";
import dynamic from "next/dynamic";

const StoreMap = dynamic(() => import("@/components/StoreMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-[#e7efe6] text-base text-muted">Učitavam mapu…</div>
  ),
});

export function SingleMap({ store }: { store: Store }) {
  return (
    <div className="h-[360px] overflow-hidden rounded-[24px] border border-line">
      <StoreMap stores={[store]} activeSlug={store.slug} focusSlug={store.slug} />
    </div>
  );
}
