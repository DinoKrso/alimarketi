"use server";

import { site } from "@/data/site";
import { CV_MAX_BYTES, type FormState } from "@/lib/form-types";

type Mail = {
  subject: string;
  replyTo?: string;
  lines: string[];
  attachment?: { filename: string; content: string };
};

const fallback = `Slanje e-poštom još nije uključeno. Nazovi ${site.phoneDisplay} ili piši na ${site.email}.`;
const failed = `Slanje nije uspjelo. Pokušaj ponovo za minutu ili nazovi ${site.phoneDisplay}.`;

function text(data: FormData, name: string, max = 2000) {
  return String(data.get(name) ?? "")
    .trim()
    .slice(0, max);
}

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 120);
}

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneOk = (value: string) => value.replace(/\D/g, "").length >= 8;

function isBot(data: FormData) {
  return text(data, "web_stranica").length > 0;
}

async function send(mail: Mail): Promise<"sent" | "offline" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FORMS_FROM_EMAIL;
  const to = process.env.FORMS_TO_EMAIL || site.email;

  if (process.env.NODE_ENV !== "production") {
    console.info(`[obrazac] ${mail.subject}\n${mail.lines.join("\n")}${mail.attachment ? `\n(prilog: ${mail.attachment.filename})` : ""}`);
  }
  if (!key || !from) return "offline";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: mail.replyTo,
        subject: mail.subject,
        text: [...mail.lines, "", `Poslano sa ${site.url}`].join("\n"),
        attachments: mail.attachment ? [mail.attachment] : undefined,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      console.error(`[obrazac] Resend ${response.status}: ${await response.text()}`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[obrazac] slanje nije uspjelo", error);
    return "failed";
  }
}

function outcome(result: Awaited<ReturnType<typeof send>>, sentText: string): FormState {
  if (result === "sent") return { kind: "sent", text: sentText };
  if (result === "offline") return { kind: "offline", text: fallback };
  return { kind: "error", text: failed, fields: [] };
}

export async function sendContact(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { kind: "sent", text: "Hvala, poruka je poslana." };
  const name = text(data, "ime", 120);
  const email = text(data, "email", 200);
  const phone = text(data, "telefon", 40);
  const message = text(data, "poruka", 4000);

  const fields = [
    name.length < 2 && "ime",
    !emailOk(email) && "email",
    message.length < 8 && "poruka",
  ].filter(Boolean) as string[];
  if (fields.length) return { kind: "error", text: "Upiši ime, ispravnu e-poštu i poruku.", fields };

  const result = await send({
    subject: oneLine(`Kontakt: ${name}`),
    replyTo: email,
    lines: [`Ime: ${name}`, `E-pošta: ${email}`, `Telefon: ${phone || "-"}`, "", message],
  });
  return outcome(result, "Hvala! Poruka je poslana. Javit ćemo ti se na e-poštu.");
}

export async function sendEnquiry(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { kind: "sent", text: "Hvala, upit je poslan." };
  const company = text(data, "firma", 160);
  const person = text(data, "osoba", 120);
  const phone = text(data, "telefon", 40);
  const email = text(data, "email", 200);
  const message = text(data, "poruka", 4000);

  const fields = [
    company.length < 2 && "firma",
    person.length < 2 && "osoba",
    !phoneOk(phone) && "telefon",
    !emailOk(email) && "email",
    message.length < 8 && "poruka",
  ].filter(Boolean) as string[];
  if (fields.length) return { kind: "error", text: "Popuni firmu, kontakt osobu, telefon, e-poštu i kratku poruku.", fields };

  const result = await send({
    subject: oneLine(`Veleprodaja: ${company}`),
    replyTo: email,
    lines: [`Firma: ${company}`, `Kontakt osoba: ${person}`, `Telefon: ${phone}`, `E-pošta: ${email}`, "", message],
  });
  return outcome(result, "Upit je poslan. Komercijala se javlja u toku radnog dana.");
}

export async function sendApplication(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { kind: "sent", text: "Hvala, prijava je poslana." };
  const position = text(data, "pozicija", 160);
  const name = text(data, "ime", 120);
  const phone = text(data, "telefon", 40);
  const email = text(data, "email", 200);
  const message = text(data, "poruka", 4000);
  const cv = data.get("cv");
  const file = cv instanceof File && cv.size > 0 ? cv : null;

  const fields = [name.length < 2 && "ime", !phoneOk(phone) && "telefon", !emailOk(email) && "email"].filter(Boolean) as string[];
  if (fields.length) return { kind: "error", text: "Upiši ime, telefon i e-poštu.", fields };
  if (file && file.size > CV_MAX_BYTES) return { kind: "error", text: "CV je veći od 4 MB. Pošalji manji PDF.", fields: ["cv"] };
  if (file && !/\.(pdf|docx?)$/i.test(file.name)) return { kind: "error", text: "CV može biti PDF ili Word dokument.", fields: ["cv"] };

  const attachment = file
    ? { filename: file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 100), content: Buffer.from(await file.arrayBuffer()).toString("base64") }
    : undefined;

  const result = await send({
    subject: oneLine(`Prijava: ${position} - ${name}`),
    replyTo: email,
    lines: [`Pozicija: ${position}`, `Ime i prezime: ${name}`, `Telefon: ${phone}`, `E-pošta: ${email}`, `CV: ${file ? file.name : "nije priložen"}`, "", message || "(bez poruke)"],
    attachment,
  });
  return outcome(result, "Prijava je poslana. Javljamo se kandidatima koji uđu u uži izbor.");
}

export async function subscribeViber(_: FormState, data: FormData): Promise<FormState> {
  if (isBot(data)) return { kind: "sent", text: "Prijavljen si." };
  const phone = text(data, "viber", 40);
  const consent = data.get("saglasnost") === "da";

  const fields = [!phoneOk(phone) && "viber", !consent && "saglasnost"].filter(Boolean) as string[];
  if (fields.length) {
    return {
      kind: "error",
      text: !phoneOk(phone) ? "Upiši broj na kojem koristiš Viber." : "Potvrdi da smijemo slati katalog na taj broj.",
      fields,
    };
  }

  const result = await send({
    subject: oneLine(`Viber katalog: ${phone}`),
    lines: [`Broj za Viber: ${phone}`, "Saglasnost: da, katalog i akcije jednom mjesečno.", "", "Dodati u Viber listu za katalog."],
  });
  return outcome(result, "Prijavljen si! Novi katalog stiže na Viber čim izađe.");
}
