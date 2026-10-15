import { jobs } from "@/data/jobs";
import { site } from "@/data/site";
import { stores } from "@/data/stores";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ): MetadataRoute.Sitemap[number] => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/akcije", 0.9, "weekly"),
    page("/letak", 0.9, "weekly"),
    page("/poslovnice", 0.8, "monthly"),
    page("/veleprodaja", 0.7, "monthly"),
    page("/karijera", 0.6, "weekly"),
    page("/o-nama", 0.5, "yearly"),
    page("/kontakt", 0.5, "yearly"),
    page("/politika-privatnosti", 0.2, "yearly"),
    page("/kolacici", 0.2, "yearly"),
    ...stores.map((store) => page(`/poslovnice/${store.slug}`, 0.6, "monthly")),
    ...jobs.map((job) => page(`/karijera/${job.slug}`, 0.4, "weekly")),
  ];
}
