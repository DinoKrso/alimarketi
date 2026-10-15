import { Icon } from "@/components/Icon";
import { btn } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stranica nije pronađena",
  description: "Ova adresa ne postoji na sajtu Ali Marketi.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="px-2 pt-2 sm:px-3">
      <div className="panel-ink mx-auto max-w-[1600px] rounded-[28px] sm:rounded-[36px]">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 md:py-32">
          <p className="font-display text-[clamp(6rem,18vw,12rem)] leading-none font-extrabold tracking-[-0.06em] text-brand">404</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight font-bold text-paper">
            Ova strana nije na polici.
          </h1>
          <p className="mt-4 text-lg text-paper/70">Provjeri adresu ili se vrati na početnu.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className={btn.primary}>
              Na početnu
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/akcije" className={btn.ghostOnDark}>
              Akcije sedmice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
