import { site } from "@/data/site";
import { btn } from "@/lib/ui";

function MailInvite({ subject }: { subject: string }) {
  const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="space-y-5">
      <p className="text-base leading-relaxed text-ink/80">
        Vaše informacije i CV pošaljite na{" "}
        <a href={href} className="font-semibold text-ink underline-offset-2 hover:text-brand hover:underline">
          {site.email}
        </a>
        .
      </p>
      <a href={href} className={`${btn.primary} w-full sm:w-auto`}>
        Pošalji email
      </a>
    </div>
  );
}

export function ContactForm() {
  return <MailInvite subject="Kontakt - Ali Marketi" />;
}

export function EnquiryForm() {
  return <MailInvite subject="Veleprodaja - upit" />;
}

export function JobApplicationForm({ position }: { position: string }) {
  return (
    <div className="space-y-5">
      <p className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold">Pozicija: {position}</p>
      <MailInvite subject={`Prijava - ${position}`} />
    </div>
  );
}
