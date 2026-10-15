import { site } from "@/data/site";
import type { Store } from "@/data/types";
import { dayOrder, schemaDays } from "@/lib/hours";

export function storeJsonLd(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": store.kind === "wholesale" ? "WholesaleStore" : "GroceryStore",
    name: store.name,
    image: `${site.url}${store.image}`,
    telephone: store.phoneTel,
    url: `${site.url}/poslovnice/${store.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      postalCode: store.postalCode,
      addressCountry: "BA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.lat,
      longitude: store.lng,
    },
    openingHoursSpecification: dayOrder.flatMap((day) => {
      const slot = store.hours[day];
      if (!slot) return [];
      return [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: schemaDays[day],
          opens: slot.open,
          closes: slot.close,
        },
      ];
    }),
    parentOrganization: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
  };
}
