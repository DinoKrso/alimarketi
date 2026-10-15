import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kolačići",
  description: "Sajt Ali Marketi ne postavlja marketinške kolačiće. Lista za kupovinu ostaje samo na tvom uređaju.",
  path: "/kolacici",
});

export default function CookiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pravno"
        title="Kolačići"
        lede="Nema oglasnih ni analitičkih kolačića. Tekst treba pravnu provjeru prije objave."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Kolačići", path: "/kolacici" },
        ]}
      />
      <div className="mx-auto my-14 w-[calc(100%-2rem)] max-w-3xl space-y-4 rounded-[28px] border border-line bg-white p-6 text-lg leading-relaxed lift sm:p-10 md:my-20">
        <p>Ovaj sajt ne postavlja kolačiće za praćenje, oglase ili statistiku.</p>
        <p>
          Lista za kupovinu i broj ostavljen za Viber čuvaju se u localStorage preglednika. To nije kolačić i ne ide na server. Možeš ih obrisati čišćenjem podataka stranice.
        </p>
        <p>Ako kasnije uključimo mjerenje posjete ili slanje obrazaca, ova stranica se ažurira prije toga.</p>
      </div>
    </>
  );
}
