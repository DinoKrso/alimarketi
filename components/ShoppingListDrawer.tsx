"use client";

import { listAsText, useShoppingList } from "@/lib/shopping-list";
import { formatKm } from "@/lib/format";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function ShoppingListDrawer() {
  const { items, open, setOpen, setQty, remove, clear } = useShoppingList();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const text = listAsText(items);

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
            transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <h2 id="lista-naslov" className="font-display text-3xl font-bold">
                Moja lista
              </h2>
              <button
                type="button"
                className="press min-h-11 rounded-full border border-line bg-white px-3 font-semibold"
                onClick={() => setOpen(false)}
              >
                Zatvori
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <p>Lista je prazna. Dodaj nešto iz akcija, dugmetom +.</p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 border-b border-line pb-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line">
                        <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-base text-muted">
                          {item.unit} · {formatKm(item.price)} KM
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            className="press grid h-11 w-11 place-items-center rounded-full border border-line bg-white"
                            aria-label={`Smanji količinu: ${item.name}`}
                            onClick={() => setQty(item.id, item.qty - 1)}
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center font-semibold">{item.qty}</span>
                          <button
                            type="button"
                            className="press grid h-11 w-11 place-items-center rounded-full border border-line bg-white"
                            aria-label={`Povećaj količinu: ${item.name}`}
                            onClick={() => setQty(item.id, item.qty + 1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="ml-auto text-base font-semibold underline"
                            onClick={() => remove(item.id)}
                          >
                            Ukloni
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-2 border-t border-line px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a
                className="press flex min-h-12 items-center justify-center rounded-full bg-brand px-4 font-semibold text-ink aria-disabled:opacity-50"
                href={items.length ? `viber://forward?text=${encodeURIComponent(text)}` : undefined}
                aria-disabled={items.length === 0}
                onClick={(event) => {
                  if (!items.length) event.preventDefault();
                }}
              >
                Pošalji na Viber
              </a>
              <button
                type="button"
                className="press min-h-12 w-full rounded-full border border-line bg-white font-semibold"
                onClick={copy}
                disabled={items.length === 0}
              >
                {copied ? "Kopirano" : "Kopiraj listu"}
              </button>
              {items.length > 0 ? (
                <button type="button" className="w-full py-2 text-base text-muted underline" onClick={clear}>
                  Isprazni listu
                </button>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
