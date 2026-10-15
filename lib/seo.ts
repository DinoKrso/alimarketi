import { site } from "@/data/site";
import type { Metadata } from "next";

type PageSeo = {
  /** Short page name. The layout adds " - Ali Marketi", except on the homepage. */
  title: string;
  description: string;
  path: `/${string}` | "/";
};

const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Ali Marketi - Vaša dnevna rutina",
};

export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  const alreadyBranded = path === "/" || title.startsWith(site.name);
  const fullTitle = alreadyBranded ? title : `${title} - ${site.name}`;

  return {
    title: alreadyBranded ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.name,
      locale: "bs_BA",
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage.url],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? site.url : `${site.url}${item.path}`,
    })),
  };
}
