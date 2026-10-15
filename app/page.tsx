import { CountUp } from "@/components/CountUp";
import { DealExplorer } from "@/components/DealExplorer";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { Parallax, Reveal, Stagger, StaggerItem, TiltIn } from "@/components/Motion";
import { SectionHeading } from "@/components/SectionHeading";
import { StoreFinder } from "@/components/StoreFinder";
import { currentFlyer } from "@/data/flyers";
import { jobs } from "@/data/jobs";
import { site } from "@/data/site";
import { getStore } from "@/data/stores";
import { formatRange } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { btn, eyebrow } from "@/lib/ui";
import Image from "next/image";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Ali Marketi - Vaša dnevna rutina",
  description:
    "12 marketa u Sarajevu i Cash & Carry u Halilovićima. Akcije, mjesečni katalog i najbliža poslovnica.",
  path: "/",
});

const stats = [
  { value: new Date().getFullYear() - site.founded, label: "godina u Sarajevu", note: `od ${site.founded}.` },
  { value: 12, label: "marketa u Sarajevu", note: "Pon–sub 07–22 h" },
  { value: 1, label: "Cash & Carry", note: "Halilovići" },
];

export default function HomePage() {
  const [cover, second, third] = currentFlyer.pages;

  return (
    <>
      <Hero />

      {/* Akcije */}
      <section id="akcije" className="ground-paper">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 md:pt-32 md:pb-20">
          <SectionHeading
            eyebrow="Ove sedmice"
            title="Akcije sedmice"
            accent={["sedmice"]}
            lede="Najbolje cijene ove sedmice na jednom mjestu. Dodaj na listu i pošalji je sebi na Viber."
            action={
              <Link href="/akcije" className={btn.dark}>
                Sve akcije
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            }
          />
          <DealExplorer variant="home" />
        </div>
      </section>

      {/* Letak */}
      <section className="ground-paper-sand overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:gap-14 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal y={12} blur={false}>
              <p className={eyebrow}>Mjesečni katalog</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-bold tracking-[-0.035em]">
                Cijeli katalog,
                <br />
                <span className="text-brand">strana po strana.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                Listaj na telefonu kao papirni i uvećaj ono što te zanima.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-6 inline-flex items-center gap-4 rounded-3xl md:mt-8 border border-line bg-white/80 p-4 pr-6 backdrop-blur">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon name="clock" />
                </span>
                <span>
                  <span className="block text-sm text-muted">Važi</span>
                  <span className="block font-display text-2xl leading-none font-bold">
                    {formatRange(currentFlyer.validFrom, currentFlyer.validUntil)}
                  </span>
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/letak" className={btn.primary}>
                  <Icon name="book" className="h-4 w-4" />
                  Listaj katalog
                </Link>
                {currentFlyer.pdf ? (
                  <a href={currentFlyer.pdf} download className={btn.light}>
                    <Icon name="download" className="h-4 w-4" />
                    Preuzmi PDF
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:col-span-6 lg:col-start-7">
            {third ? (
              <Parallax speed={40} className="absolute top-10 -right-10 hidden w-[62%] sm:block">
                <div className="rotate-[9deg] overflow-hidden rounded-2xl border border-line bg-white opacity-90 shadow-xl">
                  <Image src={third.src} alt="" width={third.width} height={third.height} sizes="300px" className="h-auto w-full" />
                </div>
              </Parallax>
            ) : null}
            {second ? (
              <Parallax speed={70} className="absolute top-4 -left-10 hidden w-[62%] sm:block">
                <div className="-rotate-[8deg] overflow-hidden rounded-2xl border border-line bg-white opacity-90 shadow-xl">
                  <Image src={second.src} alt="" width={second.width} height={second.height} sizes="300px" className="h-auto w-full" />
                </div>
              </Parallax>
            ) : null}
            <TiltIn className="relative mx-auto w-[82%] sm:w-[78%]">
              <Link href="/letak" className="group block overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_90px_-30px_rgb(15_43_33/0.55)]">
                <div className="img-zoom overflow-hidden">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    width={cover.width}
                    height={cover.height}
                    className="h-auto w-full"
                    sizes="(max-width: 768px) 80vw, 420px"
                  />
                </div>
              </Link>
            </TiltIn>
          </div>
        </div>
      </section>

      {/* Poslovnice */}
      <section id="pronadji" className="ground-sand-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-32">
          <SectionHeading
            eyebrow="Poslovnice"
            title="Market blizu tebe"
            accent={["tebe"]}
            lede="Dvanaest marketa i Cash & Carry. Otvoreno ili zatvoreno računa se po sarajevskom satu."
            action={
              <Link href="/poslovnice" className={btn.light}>
                Sve poslovnice
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            }
          />
          <StoreFinder variant="preview" />
        </div>
      </section>

      {/* Kuća iza marketa + veleprodaja */}
      <section className="ground-white px-2 pb-3 sm:px-3">
        <div className="panel-ink mx-auto max-w-[1600px] rounded-[28px] sm:rounded-[36px]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-28">
            <SectionHeading
              tone="light"
              eyebrow="Kuća iza marketa"
              title="Porodična firma iz Sarajeva"
              accent={["Sarajeva"]}
              lede="Počeli smo kao veleprodaja. Danas radimo uvoz, distribuciju i markete po Sarajevu."
              action={
                <Link href="/o-nama" className={btn.ghostOnDark}>
                  O nama
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              }
            />
            <Stagger as="dl" className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
              {stats.map((stat) => (
                <StaggerItem as="div" key={stat.label} className="bg-ink/90 p-4 sm:p-7 md:p-9">
                  <dd className="font-display text-[clamp(2.6rem,9vw,7rem)] leading-[0.85] font-bold tracking-[-0.05em] text-paper">
                    <CountUp value={stat.value} />
                    <span className="sr-only">{stat.value}</span>
                    <span className="text-brand">.</span>
                  </dd>
                  <dt className="mt-3 text-sm leading-tight font-semibold text-paper sm:mt-4 sm:text-lg">{stat.label}</dt>
                  <p className="mt-1 hidden text-sm text-paper/55 sm:block">{stat.note}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal className="mt-6">
              <div className="relative grid gap-6 overflow-hidden rounded-3xl bg-brand p-6 text-ink sm:gap-8 sm:p-7 md:grid-cols-12 md:items-center md:p-10">
                <div
                  aria-hidden
                  className="absolute -top-24 -right-16 h-72 w-72 rounded-full border-[40px] border-white/15"
                />
                <div className="relative md:col-span-8">
                  <p className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
                    <Icon name="truck" className="h-4 w-4" />
                    Veleprodaja · Cash & Carry
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.02] font-bold tracking-[-0.03em]">
                    Za dućane, kafiće i kuhinje.
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
                    Nabavka na veliko u Halilovićima - iz iste kuće koja drži markete.
                  </p>
                </div>
                <div className="relative flex flex-wrap gap-3 md:col-span-4 md:justify-end">
                  <Link href="/veleprodaja#upit" className={btn.dark}>
                    Pošalji upit
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Karijera */}
      <section className="ground-paper">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-4 pb-20 sm:px-6 md:pt-10 md:pb-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Karijera"
              title="Zapošljavamo"
              lede="Otvorene pozicije u marketima i na Cash & Carry. Javi se - prijava traje dvije minute."
              className="mb-0 md:mb-0"
            />
            <Reveal delay={0.2}>
              <Link href="/karijera" className={`${btn.light} mt-8`}>
                Sve pozicije
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="space-y-3 lg:col-span-7 lg:pt-14">
            {jobs.slice(0, 3).map((job) => {
              const store = getStore(job.storeSlug);
              return (
                <StaggerItem key={job.slug}>
                  <Link
                    href={`/karijera/${job.slug}`}
                    className="group flex items-center gap-5 rounded-3xl border border-line bg-white p-5 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper md:p-6"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-paper text-ink transition-colors duration-300 group-hover:bg-brand">
                      <Icon name="briefcase" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-2xl leading-tight font-bold">{job.title}</span>
                      <span className="mt-0.5 block text-sm text-muted transition-colors group-hover:text-paper/70">
                        {store?.neighbourhood} · {job.type}
                      </span>
                    </span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-300 group-hover:-rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
