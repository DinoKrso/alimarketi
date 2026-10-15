"use client";

import { btn } from "@/lib/ui";
import { useState, type FormEvent } from "react";

type Status = { kind: "idle" } | { kind: "error"; text: string } | { kind: "saved"; text: string };

function useFormStatus() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  return { status, setStatus };
}

function Note({ status }: { status: Status }) {
  if (status.kind === "idle") return null;
  return (
    <p
      className={
        status.kind === "error"
          ? "rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger"
          : "rounded-2xl bg-fresh/15 px-4 py-3 text-sm text-ink"
      }
      role={status.kind === "error" ? "alert" : "status"}
    >
      {status.text}
    </p>
  );
}

export function ContactForm() {
  const { status, setStatus } = useFormStatus();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("ime") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("poruka") ?? "").trim();
    if (name.length < 2 || !email.includes("@") || message.length < 8) {
      setStatus({ kind: "error", text: "Upiši ime, ispravnu e-poštu i poruku." });
      return;
    }
    setStatus({
      kind: "saved",
      text: "Poruka je zabilježena u pregledniku. Slanje na e-poštu još nije spojeno - nazovi 062 340 206 ili piši na ali.doo@alimarketi.ba.",
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <label className="block text-sm font-semibold">
        Ime
        <input name="ime" className="field mt-1.5" autoComplete="name" required />
      </label>
      <label className="block text-sm font-semibold">
        E-pošta
        <input name="email" type="email" className="field mt-1.5" autoComplete="email" required />
      </label>
      <label className="block text-sm font-semibold">
        Telefon
        <input name="telefon" type="tel" className="field mt-1.5" autoComplete="tel" />
      </label>
      <label className="block text-sm font-semibold">
        Poruka
        <textarea name="poruka" className="field mt-1.5" required />
      </label>
      <button type="submit" className={`${btn.primary} w-full sm:w-auto`}>
        Pošalji
      </button>
      <Note status={status} />
    </form>
  );
}

export function EnquiryForm() {
  const { status, setStatus } = useFormStatus();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("firma") ?? "").trim();
    const person = String(data.get("osoba") ?? "").trim();
    const phone = String(data.get("telefon") ?? "").replace(/\D/g, "");
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("poruka") ?? "").trim();
    if (company.length < 2 || person.length < 2 || phone.length < 8 || !email.includes("@") || message.length < 8) {
      setStatus({ kind: "error", text: "Popuni firmu, kontakt osobu, telefon, e-poštu i kratku poruku." });
      return;
    }
    setStatus({
      kind: "saved",
      text: "Upit je sačuvan na ovom uređaju. Backend za e-poštu još nije spojen. Za sada nazovi 062 340 206.",
    });
  }

  return (
    <form id="upit" onSubmit={submit} className="space-y-4" noValidate>
      <label className="block text-sm font-semibold">
        Firma
        <input name="firma" className="field mt-1.5" autoComplete="organization" required />
      </label>
      <label className="block text-sm font-semibold">
        Kontakt osoba
        <input name="osoba" className="field mt-1.5" autoComplete="name" required />
      </label>
      <label className="block text-sm font-semibold">
        Telefon
        <input name="telefon" type="tel" className="field mt-1.5" autoComplete="tel" required />
      </label>
      <label className="block text-sm font-semibold">
        E-pošta
        <input name="email" type="email" className="field mt-1.5" autoComplete="email" required />
      </label>
      <label className="block text-sm font-semibold">
        Poruka
        <textarea name="poruka" className="field mt-1.5" required />
      </label>
      <button type="submit" className={`${btn.primary} w-full sm:w-auto`}>
        Pošalji upit
      </button>
      <Note status={status} />
    </form>
  );
}

export function JobApplicationForm({ position }: { position: string }) {
  const { status, setStatus } = useFormStatus();
  const [fileName, setFileName] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("ime") ?? "").trim();
    const phone = String(data.get("telefon") ?? "").replace(/\D/g, "");
    const email = String(data.get("email") ?? "").trim();
    if (name.length < 2 || phone.length < 8 || !email.includes("@")) {
      setStatus({ kind: "error", text: "Upiši ime, telefon i e-poštu." });
      return;
    }
    setStatus({
      kind: "saved",
      text: fileName
        ? `Prijava je spremna u pregledniku, uz datoteku „${fileName}”. Slanje i upload još nisu spojeni.`
        : "Prijava je spremna u pregledniku. Slanje još nije spojeno - možeš i nazvati 062 340 206.",
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input type="hidden" name="pozicija" value={position} />
      <p className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold">Pozicija: {position}</p>
      <label className="block text-sm font-semibold">
        Ime i prezime
        <input name="ime" className="field mt-1.5" autoComplete="name" required />
      </label>
      <label className="block text-sm font-semibold">
        Telefon
        <input name="telefon" type="tel" className="field mt-1.5" autoComplete="tel" required />
      </label>
      <label className="block text-sm font-semibold">
        E-pošta
        <input name="email" type="email" className="field mt-1.5" autoComplete="email" required />
      </label>
      <label className="block text-sm font-semibold">
        Poruka
        <textarea name="poruka" className="field mt-1.5" />
      </label>
      <label className="block text-sm font-semibold">
        Priloži CV
        <input
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf"
          className="mt-1.5 block w-full rounded-xl border border-dashed border-line bg-paper p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-paper"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
      </label>
      {fileName ? <p className="text-base">Odabrano: {fileName}</p> : null}
      <button type="submit" className={`${btn.primary} w-full sm:w-auto`}>
        Pošalji prijavu
      </button>
      <Note status={status} />
    </form>
  );
}
