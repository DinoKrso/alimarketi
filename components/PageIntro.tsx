import { Reveal, SplitTitle } from "@/components/Motion";
import { breadcrumbJsonLd } from "@/lib/seo";
import { eyebrowDark } from "@/lib/ui";
import type { ReactNode } from "react";

/** Inner-page header: a compact ink panel that echoes the homepage hero. */
export function PageIntro({
  eyebrow,
  title,
  lede,
  accent,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  accent?: string[];
  crumbs?: { name: string; path: string }[];
  /** Optional row under the lede (quick facts, buttons). */
  children?: ReactNode;
}) {
  return (
    <header className="px-2 pt-2 sm:px-3">
      {crumbs ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      ) : null}
      <div className="panel-ink mx-auto max-w-[1600px] rounded-[28px] sm:rounded-[36px]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 pt-10 pb-10 sm:px-8 md:grid-cols-12 md:gap-6 md:items-end md:pt-20 md:pb-16">
          <div className="md:col-span-7">
            <Reveal y={12} blur={false}>
              <p className={eyebrowDark}>{eyebrow}</p>
            </Reveal>
            <SplitTitle
              as="h1"
              immediate
              delay={0.05}
              text={title}
              accent={accent}
              className="mt-5 font-display text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[0.92] font-bold tracking-[-0.04em] text-paper"
            />
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.25} y={16}>
              <p className="text-base leading-relaxed text-paper/70 sm:text-lg">{lede}</p>
            </Reveal>
            {children ? (
              <Reveal delay={0.35} y={16} className="mt-6">
                {children}
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
