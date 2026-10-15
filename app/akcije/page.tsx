import { DealExplorer } from "@/components/DealExplorer";
import { PageIntro } from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Akcije",
  description: "Namirnice iz oktobarske akcije u marketima Ali Marketi. Dodaj na listu i pošalji je na Viber.",
  path: "/akcije",
});

export default function AkcijePage() {
  return (
    <>
      <PageIntro
        eyebrow="Ove sedmice"
        title="Akcije sedmice"
        accent={["sedmice"]}
        lede="Filtriraj po kategoriji i poslovnici. Dodaj na listu i pošalji je na Viber."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Akcije", path: "/akcije" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        <DealExplorer variant="full" />
      </div>
    </>
  );
}
