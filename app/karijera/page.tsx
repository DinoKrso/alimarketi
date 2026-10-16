import { Icon } from "@/components/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { PageIntro } from "@/components/PageIntro";
import { jobs } from "@/data/jobs";
import { getStore } from "@/data/stores";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Karijera",
  description: "Otvorene pozicije u marketima Ali Marketi i na Cash & Carry u Halilovićima.",
  path: "/karijera",
});

export default function KarijeraPage() {
  return (
    <>
      <PageIntro
        eyebrow="Posao"
        title="Zapošljavamo"
        lede="Oglasi ispod su uzorak dok ne uđu stvarne pozicije. Prijava i CV idu direktno na e-poštu firme."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Karijera", path: "/karijera" },
        ]}
      >
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-paper">
          <span aria-hidden className="open-pulse h-2 w-2 rounded-full bg-fresh" />
          {jobs.length} otvorenih pozicija
        </p>
      </PageIntro>
      <section className="ground-paper-sand">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-20">
          <Stagger className="space-y-3">
            {jobs.map((job) => {
              const store = getStore(job.storeSlug);
              return (
                <StaggerItem key={job.slug}>
                  <Link
                    href={`/karijera/${job.slug}`}
                    className="group flex flex-wrap items-center gap-5 rounded-[28px] border border-line bg-white p-5 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper md:flex-nowrap md:p-7"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-paper text-ink transition-colors duration-300 group-hover:bg-brand">
                      <Icon name="briefcase" className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-2xl leading-tight font-bold md:text-3xl">{job.title}</span>
                      <span className="mt-1 block text-muted transition-colors group-hover:text-paper/70">{job.summary}</span>
                    </span>
                    <span className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-paper px-3 py-1 font-semibold text-ink">{store?.neighbourhood}</span>
                      <span className="rounded-full border border-line px-3 py-1 transition-colors group-hover:border-white/20">
                        {job.type}
                      </span>
                    </span>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line transition-all duration-300 group-hover:-rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal className="mt-10">
            <p className="text-center text-muted">
              Ne vidiš svoju poziciju? Pošalji otvorenu prijavu na{" "}
              <Link href="/kontakt" className="font-semibold text-ink underline decoration-brand underline-offset-4">
                kontakt stranici
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
