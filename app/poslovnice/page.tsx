import { PageIntro } from "@/components/PageIntro";
import { StoreFinder } from "@/components/StoreFinder";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Poslovnice",
  description:
    "12 marketa Ali Marketi u Sarajevu i Cash & Carry u Halilovićima. Radno vrijeme, telefon i put do poslovnice.",
  path: "/poslovnice",
});

export default async function PoslovnicePage({
  searchParams,
}: {
  searchParams: Promise<{ najblizi?: string }>;
}) {
  const query = await searchParams;
  return (
    <>
      <PageIntro
        eyebrow="Sarajevo"
        title="Naše poslovnice"
        accent={["poslovnice"]}
        lede="Mapa i lista. Uključi samo one koje su otvorene sada, ili nađi najbližu po svojoj lokaciji."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Poslovnice", path: "/poslovnice" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <StoreFinder variant="full" autoLocate={query.najblizi === "1"} />
      </div>
    </>
  );
}
