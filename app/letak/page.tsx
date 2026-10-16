import { LetakBrowser } from "@/components/LetakBrowser";
import { PageIntro } from "@/components/PageIntro";
import { ViberSignup } from "@/components/SiteForms";
import { currentFlyer } from "@/data/flyers";
import { formatRange } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Katalog",
  description: "Mjesečni katalog Ali Marketi. Listaj strane, uvećaj ponudu i preuzmi PDF.",
  path: "/letak",
});

export default function LetakPage() {
  return (
    <>
      <PageIntro
        eyebrow={formatRange(currentFlyer.validFrom, currentFlyer.validUntil)}
        title="Mjesečni katalog"
        accent={["katalog"]}
        lede="Listaj strane i uvećaj dodirom. Raniji mjeseci ostaju u arhivi ispod."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Katalog", path: "/letak" },
        ]}
      >
        <ViberSignup tone="dark" />
      </PageIntro>
      <LetakBrowser />
    </>
  );
}
