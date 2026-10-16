"use client";

import { Burst } from "@/components/Burst";
import { Icon } from "@/components/Icon";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { sendApplication, sendContact, sendEnquiry, subscribeViber } from "@/lib/form-actions";
import { CV_MAX_BYTES, idleForm, type FormState } from "@/lib/form-types";
import { btn } from "@/lib/ui";
import { AnimatePresence, motion } from "motion/react";
import {
  startTransition,
  useActionState,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

type Action = (state: FormState, data: FormData) => Promise<FormState>;

function useServerForm(action: Action) {
  const [state, run, pending] = useActionState(action, idleForm);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => run(data));
  };
  return { state, pending, onSubmit };
}

function invalid(state: FormState, name: string) {
  return state.kind === "error" && state.fields.includes(name);
}

function Field({
  label,
  name,
  state,
  optional = false,
  ...props
}: { label: string; name: string; state: FormState; optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {optional ? <span className="ml-1.5 font-normal text-muted">(nije obavezno)</span> : null}
      <input name={name} aria-invalid={invalid(state, name) || undefined} className="field mt-1.5" {...props} />
    </label>
  );
}

function Area({
  label,
  name,
  state,
  optional = false,
  ...props
}: { label: string; name: string; state: FormState; optional?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {optional ? <span className="ml-1.5 font-normal text-muted">(nije obavezno)</span> : null}
      <textarea name={name} aria-invalid={invalid(state, name) || undefined} className="field mt-1.5" {...props} />
    </label>
  );
}

function Honeypot() {
  return (
    <label aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      Web stranica
      <input name="web_stranica" tabIndex={-1} autoComplete="off" />
    </label>
  );
}

function Submit({ pending, children, className }: { pending: boolean; children: ReactNode; className?: string }) {
  return (
    <button type="submit" disabled={pending} className={cn(btn.primary, "relative w-full overflow-hidden sm:w-auto", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={pending ? "pending" : "idle"}
          className="flex items-center gap-2"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {pending ? (
            <>
              <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink" />
              Šaljem…
            </>
          ) : (
            children
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Note({ state }: { state: FormState }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.kind === "error" || state.kind === "offline" ? (
        <motion.p
          key={state.text}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            "flex gap-2 rounded-2xl px-4 py-3 text-sm",
            state.kind === "error" ? "bg-danger/10 text-danger" : "bg-brand-soft text-ink",
          )}
          role={state.kind === "error" ? "alert" : "status"}
        >
          <Icon name={state.kind === "error" ? "close" : "phone"} className="mt-0.5 h-4 w-4" />
          <span>{state.text}</span>
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function Sent({ text, onAgain, again }: { text: string; onAgain: () => void; again: string }) {
  return (
    <motion.div
      className="flex flex-col items-center py-8 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      role="status"
    >
      <span className="relative grid h-20 w-20 place-items-center rounded-full bg-fresh/15 text-fresh">
        <Burst shot={1} />
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <motion.path d="M20 6 9 17l-5-5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.15 }} />
        </svg>
      </span>
      <p className="mt-5 font-display text-2xl font-bold">Poslano</p>
      <p className="mt-1 max-w-sm text-muted">{text}</p>
      <button type="button" className={cn(btn.light, "mt-6")} onClick={onAgain}>
        {again}
      </button>
    </motion.div>
  );
}

function Rounds({ children }: { children: (next: () => void) => ReactNode }) {
  const [round, setRound] = useState(0);
  return <div key={round}>{children(() => setRound((value) => value + 1))}</div>;
}

export function ContactForm() {
  return <Rounds>{(next) => <ContactFormBody onAgain={next} />}</Rounds>;
}

function ContactFormBody({ onAgain }: { onAgain: () => void }) {
  const { state, pending, onSubmit } = useServerForm(sendContact);
  if (state.kind === "sent") return <Sent text={state.text} onAgain={onAgain} again="Pošalji novu poruku" />;

  return (
    <form onSubmit={onSubmit} className="relative space-y-4" noValidate>
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ime" name="ime" state={state} autoComplete="name" required />
        <Field label="E-pošta" name="email" type="email" state={state} autoComplete="email" required />
      </div>
      <Field label="Telefon" name="telefon" type="tel" state={state} autoComplete="tel" optional />
      <Area label="Poruka" name="poruka" state={state} required />
      <Submit pending={pending}>
        Pošalji
        <Icon name="send" className="h-4 w-4" />
      </Submit>
      <Note state={state} />
    </form>
  );
}

export function EnquiryForm() {
  return <Rounds>{(next) => <EnquiryFormBody onAgain={next} />}</Rounds>;
}

function EnquiryFormBody({ onAgain }: { onAgain: () => void }) {
  const { state, pending, onSubmit } = useServerForm(sendEnquiry);
  if (state.kind === "sent") return <Sent text={state.text} onAgain={onAgain} again="Pošalji novi upit" />;

  return (
    <form id="upit" onSubmit={onSubmit} className="relative space-y-4" noValidate>
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Firma" name="firma" state={state} autoComplete="organization" required />
        <Field label="Kontakt osoba" name="osoba" state={state} autoComplete="name" required />
        <Field label="Telefon" name="telefon" type="tel" state={state} autoComplete="tel" required />
        <Field label="E-pošta" name="email" type="email" state={state} autoComplete="email" required />
      </div>
      <Area label="Poruka" name="poruka" state={state} placeholder="Šta vam treba i otprilike u kojim količinama?" required />
      <Submit pending={pending}>
        Pošalji upit
        <Icon name="send" className="h-4 w-4" />
      </Submit>
      <Note state={state} />
    </form>
  );
}

export function JobApplicationForm({ position }: { position: string }) {
  return <Rounds>{(next) => <JobApplicationBody position={position} onAgain={next} />}</Rounds>;
}

function JobApplicationBody({ position, onAgain }: { position: string; onAgain: () => void }) {
  const { state, pending, onSubmit } = useServerForm(sendApplication);
  const [file, setFile] = useState<File | null>(null);
  const tooBig = Boolean(file && file.size > CV_MAX_BYTES);
  if (state.kind === "sent") return <Sent text={state.text} onAgain={onAgain} again="Pošalji još jednu prijavu" />;

  return (
    <form onSubmit={onSubmit} className="relative space-y-4" noValidate>
      <Honeypot />
      <input type="hidden" name="pozicija" value={position} />
      <p className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold">Pozicija: {position}</p>
      <Field label="Ime i prezime" name="ime" state={state} autoComplete="name" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefon" name="telefon" type="tel" state={state} autoComplete="tel" required />
        <Field label="E-pošta" name="email" type="email" state={state} autoComplete="email" required />
      </div>
      <Area label="Poruka" name="poruka" state={state} optional />
      <label
        className={cn(
          "group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed p-4 transition-colors",
          invalid(state, "cv") || tooBig ? "border-danger/50 bg-danger/5" : file ? "border-fresh/50 bg-fresh/5" : "border-line bg-paper hover:border-brand/50",
        )}
      >
        <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors", file ? "bg-fresh text-white" : "bg-white text-ink group-hover:bg-brand")}>
          <Icon name={file ? "check" : "download"} className={cn("h-5 w-5", !file && "rotate-180")} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{file ? file.name : "Priloži CV"}</span>
          <span className="block text-sm text-muted">
            {file ? (tooBig ? "Fajl je veći od 4 MB." : `${(file.size / 1024 / 1024).toFixed(1)} MB · klikni za drugi fajl`) : "PDF ili Word, do 4 MB. Nije obavezno."}
          </span>
        </span>
        <input
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf"
          className="sr-only"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>
      <Submit pending={pending}>
        Pošalji prijavu
        <Icon name="send" className="h-4 w-4" />
      </Submit>
      <Note state={state} />
    </form>
  );
}

export function ViberSignup({ tone = "light" }: { tone?: "light" | "dark" }) {
  return <Rounds>{(next) => <ViberSignupBody tone={tone} onAgain={next} />}</Rounds>;
}

function ViberSignupBody({ tone, onAgain }: { tone: "light" | "dark"; onAgain: () => void }) {
  const { state, pending, onSubmit } = useServerForm(subscribeViber);
  const dark = tone === "dark";

  if (state.kind === "sent") {
    return (
      <motion.div
        className={cn("flex items-center gap-4 rounded-3xl p-5", dark ? "bg-white/[0.06] text-paper" : "bg-white")}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
      >
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-fresh text-white">
          <Burst shot={1} />
          <Icon name="check" className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{state.text}</span>
          <button type="button" onClick={onAgain} className={cn("text-sm underline", dark ? "text-paper/60" : "text-muted")}>
            Prijavi drugi broj
          </button>
        </span>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("relative rounded-3xl border p-4 sm:p-5", dark ? "border-white/10 bg-white/[0.04] text-paper" : "border-line bg-white/80 backdrop-blur")}
    >
      <Honeypot />
      <p className="flex items-center gap-2 font-display text-lg font-bold">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#7360f2] text-white">
          <Icon name="bell" className="h-4 w-4" />
        </span>
        Novi katalog na Viber
      </p>
      <p className={cn("mt-1 text-sm", dark ? "text-paper/60" : "text-muted")}>Jednom mjesečno, kad izađe nova ponuda. Odjava jednom porukom.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Broj telefona za Viber</span>
          <input
            name="viber"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06x xxx xxx"
            aria-invalid={invalid(state, "viber") || undefined}
            className="field !min-h-12 !rounded-full !px-5"
          />
        </label>
        <Submit pending={pending} className="shrink-0">
          Prijavi me
        </Submit>
      </div>
      <label className={cn("mt-3 flex items-start gap-2.5 text-sm", dark ? "text-paper/70" : "text-muted")}>
        <input
          type="checkbox"
          name="saglasnost"
          value="da"
          aria-invalid={invalid(state, "saglasnost") || undefined}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#f15e19]"
        />
        <span>
          Slažem se da {site.name} šalje katalog i akcije na ovaj broj.
        </span>
      </label>
      <div className="mt-3 empty:hidden">
        <Note state={state} />
      </div>
    </form>
  );
}
