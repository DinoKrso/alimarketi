import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { cashCarryHoursSummary, retailHoursSummary } from "@/data/stores";
import { nav, site } from "@/data/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="panel-ink mx-auto max-w-[1600px] rounded-[28px] sm:rounded-[36px]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-16 pb-10 sm:px-8 md:grid-cols-12 md:pt-20">
          <div className="md:col-span-4">
            <Logo className="w-fit [&_svg]:h-14" />
            <p className="mt-3 max-w-xs text-base text-paper/65">
              Vaša dnevna rutina. {site.legalName}, {site.city}, od {site.founded}.
            </p>
            <div className="mt-6 space-y-2">
              <a
                className="flex items-center gap-3 text-base text-paper hover:text-brand"
                href={`tel:${site.phoneTel}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                  <Icon name="phone" className="h-4 w-4" />
                </span>
                {site.phoneDisplay}
              </a>
              <a className="flex items-center gap-3 text-base text-paper hover:text-brand" href={`mailto:${site.email}`}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                  <Icon name="mail" className="h-4 w-4" />
                </span>
                {site.email}
              </a>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm font-semibold tracking-wide text-paper/50 uppercase">Radno vrijeme</p>
            <p className="mt-4 text-base">
              <span className="font-semibold">Marketi</span>
              <br />
              <span className="text-paper/70">{retailHoursSummary}</span>
            </p>
            <p className="mt-4 text-base">
              <span className="font-semibold">Cash & Carry</span>
              <br />
              <span className="text-paper/70">{cashCarryHoursSummary}</span>
            </p>
            <p className="mt-4 text-xs text-paper/45">Sati su uzorak dok klijent ne potvrdi raspored.</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm font-semibold tracking-wide text-paper/50 uppercase">Stranice</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/80 transition-colors hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-semibold tracking-wide text-paper/50 uppercase">Pratite nas</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="text-paper/80 hover:text-brand" href={site.facebook} rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a className="text-paper/80 hover:text-brand" href={site.instagram} rel="noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm font-semibold tracking-wide text-paper/50 uppercase">Pravno</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/politika-privatnosti" className="text-paper/80 hover:text-brand">
                  Privatnost
                </Link>
              </li>
              <li>
                <Link href="/kolacici" className="text-paper/80 hover:text-brand">
                  Kolačići
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div aria-hidden className="overflow-hidden px-4 pt-6 select-none">
          <p className="wordmark text-center font-display text-[clamp(4rem,17vw,16rem)] leading-[0.8] font-extrabold tracking-[-0.06em] text-white/[0.05]">
            {Array.from("ali marketi").map((char, index) =>
              char === " " ? (
                <span key={index} className="inline-block w-[0.25em]" />
              ) : (
                <span key={index} className="inline-block">
                  {char}
                </span>
              ),
            )}
          </p>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-7xl px-5 py-5 text-sm text-paper/50 sm:px-8">
            © {new Date().getFullYear()} {site.legalName} · Vaša dnevna rutina.
          </p>
        </div>
      </div>
    </footer>
  );
}
