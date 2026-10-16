import { DealExplorer } from "@/components/DealExplorer";
import { PageIntro } from "@/components/PageIntro";
import { oktobarDeals } from "@/data/oktobar-akcija";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Akcije",
  description: "Sve akcije iz oktobarskog kataloga Ali Marketi: namirnice, slatko i grickalice, pića, kozmetika i dom. Dodaj na listu i pošalji je na Viber.",
  path: "/akcije",
});

export default function AkcijePage() {
  return (
    <>
      <PageIntro
        eyebrow="Ove sedmice"
        title="Akcije sedmice"
        accent={["sedmice"]}
        lede={`${oktobarDeals.length} proizvoda iz oktobarskog kataloga. Traži, filtriraj i dodaj na listu, pa je pošalji sebi na Viber.`}
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
