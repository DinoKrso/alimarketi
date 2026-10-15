import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { OpenBadge } from "@/components/OpenBadge";
import { SingleMap } from "@/components/SingleMap";
import { getStore, stores } from "@/data/stores";
import { mapsDirectionsUrl } from "@/lib/geo";
import { dayLabels, dayOrder, formatSlot } from "@/lib/hours";
import { storeJsonLd } from "@/lib/schema";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { btn } from "@/lib/ui";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return stores.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) return { title: "Poslovnica" };
  const hours =
    store.kind === "wholesale"
      ? "Pon-pet 07:00-18:00, subota 07:00-14:00, nedjelja zatvoreno"
      : "Pon-sub 07:00-22:00, nedjelja 08:00-20:00";
  return pageMetadata({
    title: store.name,
    description: `${store.name}, ${store.address}, ${store.city}. ${hours}. Telefon ${store.phoneDisplay}.`,
    path: `/poslovnice/${store.slug}`,
  });
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd(store)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Početna", path: "/" },
              { name: "Poslovnice", path: "/poslovnice" },
              { name: store.name, path: `/poslovnice/${store.slug}` },
            ]),
          ),
        }}
      />
      <header className="px-2 pt-2 sm:px-3">
        <div className="panel-ink mx-auto max-w-[1600px] rounded-[28px] sm:rounded-[36px]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal y={12} blur={false}>
                <Link
                  href="/poslovnice"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold text-paper hover:bg-white/10"
                >
                  <Icon name="arrowLeft" className="h-4 w-4" />
                  Sve poslovnice
                </Link>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-8 text-sm font-semibold tracking-wide text-brand uppercase">
                  {store.kind === "wholesale" ? "Cash & Carry" : "Market"}
                </p>
                <h1 className="mt-2 font-display text-[clamp(2.6rem,5.5vw,4.75rem)] leading-[0.95] font-bold tracking-[-0.04em] text-paper">
                  {store.neighbourhood}
                </h1>
                <p className="mt-4 flex items-start gap-2 text-lg text-paper/75">
                  <Icon name="pin" className="mt-1 h-5 w-5" />
                  <span>
                    {store.address}, {store.postalCode} {store.city}
                  </span>
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-6">
                  <OpenBadge hours={store.hours} />
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a className={btn.primary} href={mapsDirectionsUrl(store.lat, store.lng)} target="_blank" rel="noreferrer">
                    <Icon name="navigate" className="h-4 w-4" />
                    Navigacija
                  </a>
                  <a className={btn.ghostOnDark} href={`tel:${store.phoneTel}`}>
                    <Icon name="phone" className="h-4 w-4" />
                    {store.phoneDisplay}
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-6" delay={0.1}>
              <ViewTransition name={`store-${store.slug}`}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
                  <Image
                    src={store.image}
                    alt={store.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </ViewTransition>
              <p className="mt-2 text-xs text-paper/45">Fotografija poslovnice - placeholder.</p>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="ground-paper-sand">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="h-full rounded-[28px] border border-line bg-white p-6 lift md:p-8">
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon name="clock" />
                </span>
                Radno vrijeme
              </h2>
              <table className="mt-6 w-full text-left text-base">
                <tbody>
                  {dayOrder.map((day) => (
                    <tr key={day} className="border-b border-line last:border-0">
                      <th scope="row" className="py-3 font-medium">
                        {dayLabels[day]}
                      </th>
                      <td className="py-3 text-right font-semibold tabular-nums">{formatSlot(store.hours[day])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-muted">Radno vrijeme je uzorak. Treba ga potvrditi prije objave.</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="h-full overflow-hidden rounded-[28px] border border-line bg-white p-2 lift [&>div]:h-full [&>div]:min-h-[380px]">
              <SingleMap store={store} />
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
