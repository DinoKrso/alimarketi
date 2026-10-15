"use client";

import { FlyerViewer } from "@/components/FlyerViewer";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { currentFlyer, flyers, getFlyer } from "@/data/flyers";
import { cn } from "@/lib/cn";
import { formatRange } from "@/lib/format";
import Image from "next/image";
import { useState } from "react";

export function LetakBrowser() {
  const [id, setId] = useState(currentFlyer.id);
  const flyer = getFlyer(id) ?? currentFlyer;

  return (
    <>
      <section className="ground-paper-sand">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-wide text-muted uppercase">
                {flyer.id === currentFlyer.id ? "Aktuelni katalog" : "Arhiva"}
              </p>
              <h2 className="mt-1 font-display text-[clamp(1.8rem,3.5vw,2.75rem)] leading-tight font-bold">{flyer.title}</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[32px] border border-line bg-white/70 p-4 backdrop-blur lift sm:p-8">
              <FlyerViewer key={flyer.id} flyer={flyer} />
            </div>
          </Reveal>
        </div>
      </section>
      <section className="ground-sand-white">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.75rem)] font-bold">Arhiva kataloga</h2>
            <p className="mt-2 text-muted">Prethodni mjeseci - klikni za pregled.</p>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {flyers.map((item) => {
              const selected = item.id === flyer.id;
              return (
                <StaggerItem key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setId(item.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    aria-pressed={selected}
                    className={cn(
                      "group lift-hover w-full rounded-[24px] border bg-white p-2 text-left",
                      selected ? "border-brand shadow-[0_0_0_4px_rgb(241_94_25/0.15)]" : "border-line",
                    )}
                  >
                    <span
                      className="img-zoom relative block overflow-hidden rounded-[18px]"
                      style={{ aspectRatio: `${item.pages[0].width} / ${item.pages[0].height}` }}
                    >
                      <Image src={item.pages[0].src} alt={item.pages[0].alt} fill sizes="300px" className="object-cover" />
                      {item.current ? (
                        <span className="absolute top-2 left-2 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-ink">
                          Aktuelno
                        </span>
                      ) : null}
                    </span>
                    <span className="block px-2 pt-3 pb-1 font-display text-lg font-bold">
                      {formatRange(item.validFrom, item.validUntil)}
                    </span>
                    <span className="block px-2 pb-2 text-sm text-muted">{item.pages.length} strana</span>
                  </button>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
