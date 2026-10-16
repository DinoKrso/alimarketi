import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { PageIntro } from "@/components/PageIntro";
import { JobApplicationForm } from "@/components/SiteForms";
import { getJob, jobs } from "@/data/jobs";
import { getStore } from "@/data/stores";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return { title: "Oglas" };
  const store = getStore(job.storeSlug);
  return pageMetadata({
    title: store ? `${job.title}, ${store.neighbourhood}` : job.title,
    description: job.summary,
    path: `/karijera/${job.slug}`,
  });
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();
  const store = getStore(job.storeSlug);

  return (
    <article>
      <PageIntro
        eyebrow={job.type}
        title={job.title}
        lede={job.summary}
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Karijera", path: "/karijera" },
          { name: job.title, path: `/karijera/${job.slug}` },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          <Link
            href="/karijera"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold text-paper hover:bg-white/10"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
            Sve pozicije
          </Link>
          {store ? (
            <Link
              href={`/poslovnice/${store.slug}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-paper hover:bg-white/15"
            >
              <Icon name="pin" className="h-4 w-4" />
              {store.name}
            </Link>
          ) : null}
        </div>
      </PageIntro>

      <section className="ground-paper-sand">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-[28px] border border-line bg-white p-6 lift md:p-10">
              <h2 className="font-display text-3xl font-bold">O poslu</h2>
              <div className="mt-4 space-y-3 text-lg leading-relaxed text-ink/85">
                {job.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <h2 className="mt-10 font-display text-2xl font-bold">Tražimo</h2>
              <ul className="mt-4 space-y-3">
                {job.requirements.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fresh/20 text-ink">
                      <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              {store ? (
                <p className="mt-10 flex items-center gap-2 rounded-2xl bg-paper px-4 py-3 text-sm">
                  <Icon name="pin" className="h-4 w-4 text-muted" />
                  {store.address}, {store.city}
                </p>
              ) : null}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="rounded-[28px] bg-ink p-6 text-paper lg:sticky lg:top-24 md:p-8">
              <h2 className="font-display text-3xl font-bold">Prijava</h2>
              <p className="mt-2 mb-6 text-paper/65">Vaše informacije i CV pošaljite na email.</p>
              <div className="rounded-[22px] bg-paper p-5 text-ink md:p-6">
                <JobApplicationForm position={job.title} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
