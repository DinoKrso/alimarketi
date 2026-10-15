import { Icon, type IconName } from "@/components/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { PageIntro } from "@/components/PageIntro";
import { ContactForm } from "@/components/SiteForms";
import { SingleMap } from "@/components/SingleMap";
import { site } from "@/data/site";
import { getStore } from "@/data/stores";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt",
  description: "ALI d.o.o., Sarajevo. Telefon 062 340 206, e-pošta ali.doo@alimarketi.ba. Cash & Carry, Halilovići bb.",
  path: "/kontakt",
});

export default function KontaktPage() {
  const store = getStore("cash-and-carry");

  const channels: { icon: IconName; label: string; value: string; href?: string; note: string }[] = [
    { icon: "phone", label: "Telefon", value: site.phoneDisplay, href: `tel:${site.phoneTel}`, note: "Poziv ili Viber" },
    { icon: "mail", label: "E-pošta", value: site.email, href: `mailto:${site.email}`, note: "Za upite i saradnju" },
    { icon: "pin", label: site.visitLabel, value: "Halilovići bb, 71000 Sarajevo", note: "Novi Grad" },
  ];

  return (
    <>
      <PageIntro
        eyebrow={site.legalName}
        title="Tu smo za tebe"
        accent={["tebe"]}
        lede="Pitanje o akciji, poslovnici ili saradnji? Nazovi, piši ili svrati u Cash & Carry u Halilovićima."
        crumbs={[
          { name: "Početna", path: "/" },
          { name: "Kontakt", path: "/kontakt" },
        ]}
      />

      <section className="ground-paper">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <Stagger className="grid gap-4 md:grid-cols-3">
            {channels.map((item) => {
              const body = (
                <>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-ink">
                    <Icon name={item.icon} />
                  </span>
                  <span className="mt-6 block text-sm font-semibold tracking-wide text-muted uppercase">{item.label}</span>
                  <span className="mt-1 block font-display text-xl font-bold break-words md:text-2xl">{item.value}</span>
                  <span className="mt-1 block text-sm text-muted">{item.note}</span>
                </>
              );
              return (
                <StaggerItem key={item.label}>
                  {item.href ? (
                    <a href={item.href} className="group lift lift-hover block h-full rounded-[28px] border border-line bg-white p-6 md:p-7">
                      {body}
                    </a>
                  ) : (
                    <div className="group lift h-full rounded-[28px] border border-line bg-white p-6 md:p-7">{body}</div>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="ground-paper-sand">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="h-full rounded-[28px] border border-line bg-white p-6 lift md:p-10">
              <h2 className="font-display text-3xl font-bold md:text-4xl">Piši nam</h2>
              <p className="mt-2 mb-8 text-muted">Ostavi poruku i javit ćemo ti se.</p>
              <ContactForm />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white p-2 lift">
              <div className="flex-1 [&>div]:h-full [&>div]:min-h-[360px]">{store ? <SingleMap store={store} /> : null}</div>
              <p className="flex items-center gap-2 px-4 py-4 text-sm text-muted">
                <Icon name="pin" className="h-4 w-4" />
                Sjedište firme i Cash & Carry su na istoj adresi, Halilovići bb.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
