import { CountUp } from "@/components/CountUp";
import { Icon, type IconName } from "@/components/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { btn } from "@/lib/ui";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "O nama",
  description: "ALI d.o.o. od 2001. godine. Uvoz, distribucija, veleprodaja i 12 marketa u Sarajevu.",
  path: "/o-nama",
});

const principles: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "store",
    title: "Blizu, ne lanac",
    text: "Svaki market stoji blizu kuće. To je razlika u odnosu na velike lance koji pokrivaju cijelu državu iz jednog kalupa.",
  },
  {
    icon: "tag",
    title: "Cijena na polici",
    text: "Akcija ima rok. Na sajtu, kao i na polici, piše do kada važi.",
  },
  {
    icon: "leaf",
    title: "Blizu, pa svježe",
    text: "Kratak put od skladišta do marketa. Svježe dolazi iz te blizine, ne iz slogana.",
  },
];

const timeline = [
  { year: String(site.founded), title: "Veleprodaja", text: "ALI d.o.o. počinje kao veleprodaja u Sarajevu." },
  { year: "Zatim", title: "Uvoz i distribucija", text: "Firma širi posao na uvoz i distribuciju robe široke potrošnje." },
  { year: "Danas", title: "12 marketa i Cash & Carry", text: "Marketi po Sarajevu i Cash & Carry u Halilovićima." },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow={`Od ${site.founded}.`}
        title="Kuća iza marketa"
        accent={["marketa"]}
        lede="Porodična firma. Prvo veleprodaja, zatim uvoz, distribucija i marketi po Sarajevu."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "O nama", path: "/o-nama" },
        ]}
      />

      <section className="ground-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.2] font-semibold tracking-[-0.02em]">
                ALI d.o.o. počinje {site.founded}. kao veleprodaja. Danas radimo{" "}
                <span className="text-brand">uvoz, distribuciju, veleprodaju i maloprodaju.</span>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                U Sarajevu je dvanaest marketa. Cash & Carry je u Halilovićima, za trgovine i ugostiteljstvo.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className={btn.dark} href={`tel:${site.phoneTel}`}>
                  <Icon name="phone" className="h-4 w-4" />
                  {site.phoneDisplay}
                </a>
                <a className={btn.light} href={`mailto:${site.email}`}>
                  <Icon name="mail" className="h-4 w-4" />
                  {site.email}
                </a>
              </div>
            </Reveal>
          </div>
          <Stagger as="dl" className="grid grid-cols-2 gap-4 lg:col-span-5 lg:col-start-8">
            <StaggerItem as="div" className="col-span-2 rounded-[28px] bg-ink p-7 text-paper">
              <dt className="text-sm font-semibold tracking-wide text-paper/60 uppercase">Osnovano</dt>
              <dd className="mt-2 font-display text-7xl leading-none font-bold tracking-[-0.04em]">
                {site.founded}
                <span className="text-brand">.</span>
              </dd>
            </StaggerItem>
            <StaggerItem as="div" className="rounded-[28px] border border-line bg-white p-6 lift">
              <dt className="text-sm font-semibold tracking-wide text-muted uppercase">Marketi</dt>
              <dd className="mt-2 font-display text-6xl leading-none font-bold tracking-[-0.04em]">
                <CountUp value={12} />
                <span className="sr-only">12</span>
              </dd>
              <dd className="mt-1 text-sm text-muted">u Sarajevu</dd>
            </StaggerItem>
            <StaggerItem as="div" className="rounded-[28px] bg-brand p-6 text-ink">
              <dt className="text-sm font-semibold tracking-wide uppercase">Veleprodaja</dt>
              <dd className="mt-2 font-display text-6xl leading-none font-bold tracking-[-0.04em]">
                <CountUp value={1} />
                <span className="sr-only">1</span>
              </dd>
              <dd className="mt-1 text-sm">Cash & Carry</dd>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="ground-paper-sand">
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold">Kako radimo</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {principles.map((item, index) => (
              <StaggerItem key={item.title}>
                <div className="group lift lift-hover h-full rounded-[28px] border border-line bg-white p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mist text-ink transition-colors duration-300 group-hover:bg-brand">
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

      <section className="ground-sand-white">
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold">Naš put</h2>
          </Reveal>
          <Stagger as="ol" className="relative mt-10 grid gap-4 md:grid-cols-3">
            {timeline.map((step) => (
              <StaggerItem key={step.title} className="relative rounded-[28px] border border-line bg-white p-7">
                <span className="inline-flex rounded-full bg-ink px-3 py-1 text-sm font-bold text-paper">{step.year}</span>
                <h3 className="mt-5 font-display text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 text-muted">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-16">
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-mist p-7 md:p-10">
              <p className="max-w-xl font-display text-2xl leading-tight font-bold md:text-3xl">
                Želiš raditi s nama? Pogledaj otvorene pozicije.
              </p>
              <Link href="/karijera" className={btn.dark}>
                Karijera
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
