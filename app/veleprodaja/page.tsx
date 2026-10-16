import { Icon, type IconName } from "@/components/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { PageIntro } from "@/components/PageIntro";
import { EnquiryForm } from "@/components/SiteForms";
import { SingleMap } from "@/components/SingleMap";
import { getStore } from "@/data/stores";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { btn } from "@/lib/ui";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Veleprodaja",
  description: "Cash & Carry Ali Marketi u Halilovićima za trgovine, restorane i ugostiteljstvo. Pošalji upit.",
  path: "/veleprodaja",
});

const offer: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "store",
    title: "Za trgovine",
    text: "Roba široke potrošnje za preprodaju: namirnice, pića i hemija iz našeg uvoza i distribucije.",
  },
  {
    icon: "users",
    title: "Za ugostiteljstvo",
    text: "Kafići, restorani i kuhinje - sve za svakodnevnu nabavku na jednom mjestu u Halilovićima.",
  },
];

export default function VeleprodajaPage() {
  const store = getStore("cash-and-carry");
  if (!store) return null;

  return (
    <>
      <PageIntro
        eyebrow="Cash & Carry"
        title="Veleprodaja za biznis"
        accent={["biznis"]}
        lede="Za dućane, kafiće i kuhinje. Isti uvoz i distribucija iza marketa, na veliko u Halilovićima."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Veleprodaja", path: "/veleprodaja" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#upit" className={btn.primary}>
            Pošalji upit
            <Icon name="arrow" className="h-4 w-4" />
          </a>
          <a href={`tel:${site.phoneTel}`} className={btn.ghostOnDark}>
            <Icon name="phone" className="h-4 w-4" />
            {site.phoneDisplay}
          </a>
        </div>
      </PageIntro>

      <section className="ground-paper">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-bold">
              Šta možeš nabaviti
            </h2>
            <p className="mt-3 max-w-xl text-lg text-muted">
              Asortiman prati ono što ide kroz uvoz i distribuciju {site.legalName}. Na sajtu ne navodimo minimum koji nije potvrđen.
            </p>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-2">
            {offer.map((item, index) => (
              <StaggerItem key={item.title}>
                <div className="group lift lift-hover h-full rounded-[28px] border border-line bg-white p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-ink">
                      <Icon name={item.icon} className="h-6 w-6" />
                    </span>
                    <span className="font-display text-5xl font-bold text-ink/10">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="ground-paper-sand">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="h-full rounded-[28px] border border-line bg-white p-6 lift md:p-8">
              <h2 className="font-display text-3xl font-bold">Gdje smo</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper">
                    <Icon name="pin" />
                  </span>
                  <span>
                    <span className="block font-semibold">{store.name}</span>
                    <span className="text-muted">
                      {store.address}, {store.postalCode} {store.city}
                    </span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper">
                    <Icon name="clock" />
                  </span>
                  <span>
                    <span className="block font-semibold">Radno vrijeme</span>
                    <span className="text-muted">{store.hoursSummary}</span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper">
                    <Icon name="phone" />
                  </span>
                  <span>
                    <a className="block font-semibold hover:text-brand" href={`tel:${site.phoneTel}`}>
                      {site.phoneDisplay}
                    </a>
                    <a className="text-muted hover:text-brand" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <SingleMap store={store} />
              </div>
              <Link href={`/poslovnice/${store.slug}`} className={`${btn.light} mt-6`}>
                Detalji poslovnice
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <div className="h-full rounded-[28px] bg-ink p-6 text-paper md:p-8">
              <h2 className="font-display text-3xl font-bold">Pošalji upit</h2>
              <p className="mt-2 mb-6 text-paper/65">Vaše informacije i CV pošaljite na email.</p>
              <div className="rounded-[22px] bg-paper p-5 text-ink md:p-6">
                <EnquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
