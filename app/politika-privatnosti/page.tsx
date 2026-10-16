import { PageIntro } from "@/components/PageIntro";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Politika privatnosti",
  description: "Šta sajt Ali Marketi čuva na tvom uređaju i kako nas možeš kontaktirati.",
  path: "/politika-privatnosti",
});

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pravno"
        title="Politika privatnosti"
        lede="Tekst opisuje ovaj sajt onakav kakav jeste danas. Prije objave treba pravnu provjeru."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Politika privatnosti", path: "/politika-privatnosti" },
        ]}
      />
      <div className="mx-auto my-14 w-[calc(100%-2rem)] max-w-3xl space-y-4 rounded-[28px] border border-line bg-white p-6 text-lg leading-relaxed lift sm:p-10 md:my-20">
        <p>
          {site.legalName}, {site.city}, vodi sajt {site.url}. Kontakt: {site.email}, telefon {site.phoneDisplay}.
        </p>
        <h2 className="pt-6 font-display text-2xl font-bold">Šta se čuva na uređaju</h2>
        <p>Lista za kupovinu stoji u localStorage preglednika, pod ključem alimarketi-lista. Ne šalje se na server.</p>
        <h2 className="pt-6 font-display text-2xl font-bold">Obrasci</h2>
        <p>
          Obrasci za kontakt, veleprodaju i prijavu na posao šalju upisane podatke kao e-poštu na {site.email}. Za slanje koristimo servis
          Resend. Sajt ne čuva poruke u svojoj bazi.
        </p>
        <p>
          Ako ostaviš broj za Viber, on stiže na istu adresu da te dodamo na listu za mjesečni katalog. Odjava: napiši nam na Viber ili
          e-poštu i broj se briše.
        </p>
        <h2 className="pt-6 font-display text-2xl font-bold">Lokacija</h2>
        <p>
          Najbliži market traži dozvolu preglednika. Koordinate se koriste samo da se izračuna udaljenost do poslovnica i ne snimaju se kod nas.
        </p>
        <h2 className="pt-6 font-display text-2xl font-bold">CV</h2>
        <p>Životopis se šalje kao prilog uz prijavu na posao, najviše 4 MB. Čuva se samo u poštanskom sandučetu firme.</p>
        <p>Za pitanja o podacima piši na {site.email}.</p>
      </div>
    </>
  );
}
