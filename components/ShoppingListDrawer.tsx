"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Icon } from "@/components/Icon";
import { listAsText, useShoppingList, type ListItem } from "@/lib/shopping-list";
import { formatKm, listCountLabel } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const sheet = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;

export function ShoppingListDrawer() {
  const { items, count, open, setOpen, setQty, remove, clear } = useShoppingList();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const text = listAsText(items);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Zatvori listu"
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="lista-naslov"
            className="fixed inset-y-2 right-2 z-50 flex w-[calc(100%-1rem)] max-w-md flex-col overflow-hidden rounded-[28px] border border-line bg-paper shadow-2xl"
            initial={reduce ? { opacity: 0 } : { x: "110%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "110%" }}
            transition={sheet}
          >
            <div className="flex items-center gap-3 px-5 pt-5 pb-4">
              <h2 id="lista-naslov" className="font-display text-3xl font-bold tracking-tight">
                Moja lista
              </h2>
              {count > 0 ? (
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-sm font-semibold text-ink">{listCountLabel(count)}</span>
              ) : null}
              <button
                type="button"
                className="press ml-auto grid h-11 w-11 place-items-center rounded-full border border-line bg-white hover:border-ink/40"
                aria-label="Zatvori"
                onClick={() => setOpen(false)}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto px-3 pb-4">
              {items.length === 0 ? (
                <EmptyList onBrowse={() => setOpen(false)} />
              ) : (
                <>
                  <p className="px-2 pb-3 text-sm text-muted">Povuci stavku ulijevo da je ukloniš.</p>
                  <motion.ul layout className="space-y-2">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <ListRow key={item.id} item={item} onQty={(qty) => setQty(item.id, qty)} onRemove={() => remove(item.id)} />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </>
              )}
            </div>

            <div className="space-y-2 border-t border-line bg-white/70 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
              <div className="flex items-baseline justify-between px-1 pb-2">
                <span className="text-sm font-semibold text-muted">Okvirno ukupno</span>
                <span className="font-display text-3xl font-extrabold tracking-tight tabular-nums">
                  <AnimatedNumber value={total} format={formatKm} />
                  <span className="ml-1 text-base font-bold text-brand">KM</span>
                </span>
              </div>
              <a
                className="press flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-4 font-semibold text-ink shadow-[0_10px_30px_-12px_rgb(241_94_25/0.8)] hover:bg-brand-dark aria-disabled:opacity-50 aria-disabled:shadow-none"
                href={items.length ? `viber://forward?text=${encodeURIComponent(text)}` : undefined}
                aria-disabled={items.length === 0}
                onClick={(event) => {
                  if (!items.length) event.preventDefault();
                }}
              >
                <Icon name="send" className="h-4 w-4" />
                Pošalji na Viber
              </a>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="press flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white font-semibold disabled:opacity-50"
                  onClick={copy}
                  disabled={items.length === 0}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={copied ? "done" : "copy"}
                      className="flex items-center gap-2"
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon name={copied ? "check" : "copy"} className={cn("h-4 w-4", copied && "text-fresh")} />
                      {copied ? "Kopirano" : "Kopiraj"}
                    </motion.span>
                  </AnimatePresence>
                </button>
                {items.length > 0 ? (
                  <button
                    type="button"
                    className="press flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 font-semibold text-danger hover:border-danger/40"
                    onClick={clear}
                  >
                    <Icon name="trash" className="h-4 w-4" />
                    Isprazni
                  </button>
                ) : null}
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function ListRow({ item, onQty, onRemove }: { item: ListItem; onQty: (qty: number) => void; onRemove: () => void }) {
  const x = useMotionValue(0);
  const reveal = useTransform(x, [-110, -30, 0], [1, 0.4, 0]);
  const binScale = useTransform(x, [-110, -40], [1.15, 0.7]);

  return (
    <motion.li
      layout
      className="relative"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80, height: 0, marginTop: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 flex items-center justify-end rounded-[22px] bg-danger pr-6 text-white"
        style={{ opacity: reveal }}
      >
        <motion.span style={{ scale: binScale }}>
          <Icon name="trash" className="h-6 w-6" />
        </motion.span>
      </motion.div>
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -140, right: 0 }}
        dragElastic={{ left: 0.25, right: 0 }}
        dragSnapToOrigin
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -90) onRemove();
        }}
        className="relative flex touch-pan-y items-center gap-3 rounded-[22px] border border-line bg-white p-2.5 pr-3"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white">
          <Image src={item.image} alt="" fill sizes="64px" className="object-contain p-1" draggable={false} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{item.name}</p>
          <p className="text-sm text-muted">
            {item.unit} · {formatKm(item.price)} KM
          </p>
          <p className="mt-0.5 font-display text-lg font-extrabold tabular-nums">
            <AnimatedNumber value={item.price * item.qty} format={formatKm} /> <span className="text-sm text-brand">KM</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-full bg-paper p-1">
          <button
            type="button"
            className="press grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm"
            aria-label={`Povećaj količinu: ${item.name}`}
            onClick={() => onQty(item.qty + 1)}
          >
            <Icon name="plus" className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <span className="relative h-6 w-6 overflow-hidden text-center font-display font-extrabold tabular-nums" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={item.qty}
                className="absolute inset-0"
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 32 }}
              >
                {item.qty}
              </motion.span>
            </AnimatePresence>
          </span>
          <button
            type="button"
            className="press grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm"
            aria-label={item.qty === 1 ? `Ukloni: ${item.name}` : `Smanji količinu: ${item.name}`}
            onClick={() => onQty(item.qty - 1)}
          >
            <Icon name={item.qty === 1 ? "trash" : "minus"} className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </motion.li>
  );
}

function EmptyList({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <svg viewBox="0 0 160 120" className="h-32 w-auto text-ink/15" aria-hidden>
        <motion.path
          d="M20 44h120l-12 60a8 8 0 0 1-8 6H40a8 8 0 0 1-8-6L20 44z"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeDasharray="10 9"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        />
        <path d="M52 44 70 14M108 44 90 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <motion.circle
          cx="80"
          cy="30"
          r="9"
          className="fill-brand"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: [-40, 34, 22, 30], opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <p className="mt-4 font-display text-2xl font-bold">Lista je prazna</p>
      <p className="mt-1 max-w-[26ch] text-muted">Dodaj proizvode iz akcija dugmetom + i pošalji listu sebi na Viber.</p>
      <Link
        href="/akcije"
        onClick={onBrowse}
        className="press mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-paper hover:bg-ink-2"
      >
        Pogledaj akcije
        <Icon name="arrow" className="h-4 w-4" />
      </Link>
    </div>
  );
}
