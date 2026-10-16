"use client";

import { formatKm } from "@/lib/format";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const KEY = "alimarketi-lista";
const CHANGE = "alimarketi-lista-change";
const EMPTY: ListItem[] = [];

let cachedRaw = "";
let cachedItems: ListItem[] = EMPTY;

export type ListItem = {
  id: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
  image: string;
};

type Flying = {
  id: string;
  src: string;
  from: { left: number; top: number };
  to: { left: number; top: number; width: number; height: number };
};

type ShoppingListValue = {
  items: ListItem[];
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<ListItem, "qty">, source?: HTMLElement | null) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const ShoppingListContext = createContext<ShoppingListValue | null>(null);

function isListItem(value: unknown): value is ListItem {
  if (!value || typeof value !== "object") return false;
  const item = value as ListItem;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.unit === "string" &&
    typeof item.price === "number" &&
    typeof item.qty === "number" &&
    typeof item.image === "string"
  );
}

function readItems() {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(KEY) ?? "[]";
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw) as unknown;
    cachedItems = Array.isArray(parsed) ? parsed.filter(isListItem) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function writeItems(next: ListItem[]) {
  const raw = JSON.stringify(next);
  cachedRaw = raw;
  cachedItems = next;
  localStorage.setItem(KEY, raw);
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function listTargetRect() {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-list-target]"));
  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return rect;
  }
  return null;
}

export function listAsText(items: ListItem[]) {
  const lines = ["Moja lista - Ali Marketi", ""];
  for (const item of items) {
    lines.push(`• ${item.name} (${item.unit}) × ${item.qty} - ${formatKm(item.price)} KM`);
  }
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  lines.push("", `Okvirno ukupno: ${formatKm(total)} KM`, "", "alimarketi.ba/akcije");
  return lines.join("\n");
}

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readItems, () => EMPTY);
  const [open, setOpen] = useState(false);
  const [flying, setFlying] = useState<Flying[]>([]);
  const reduce = useReducedMotion();
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  const value = useMemo<ShoppingListValue>(() => {
    return {
      items,
      count,
      open,
      setOpen,
      add: (item, source) => {
        const current = readItems();
        const existing = current.find((entry) => entry.id === item.id);
        writeItems(
          existing
            ? current.map((entry) =>
                entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry,
              )
            : [...current, { ...item, qty: 1 }],
        );
        if (reduce) return;
        const from = source?.getBoundingClientRect();
        const to = listTargetRect();
        if (!from || !to || from.width === 0) return;
        setFlying((current) => [
          ...current,
          {
            id: `${item.id}-${Date.now()}`,
            src: item.image,
            from: { left: from.left, top: from.top },
            to: { left: to.left, top: to.top, width: to.width, height: to.height },
          },
        ]);
      },
      setQty: (id, qty) => {
        const current = readItems();
        writeItems(
          qty <= 0
            ? current.filter((item) => item.id !== id)
            : current.map((item) => (item.id === id ? { ...item, qty } : item)),
        );
      },
      remove: (id) => writeItems(readItems().filter((item) => item.id !== id)),
      clear: () => writeItems([]),
    };
  }, [items, count, open, reduce]);

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
      <div aria-hidden className="pointer-events-none">
        <AnimatePresence>
          {flying.map((item) => (
            <motion.img
              key={item.id}
              src={item.src}
              alt=""
              className="pointer-events-none fixed z-[80] h-14 w-14 rounded-xl border border-line bg-white object-contain p-1 shadow-lg"
              style={{ left: item.from.left, top: item.from.top }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: [
                  0,
                  (item.to.left - item.from.left) * 0.45,
                  item.to.left + item.to.width / 2 - item.from.left - 28,
                ],
                y: [
                  0,
                  -72,
                  item.to.top + item.to.height / 2 - item.from.top - 28,
                ],
                scale: [1, 0.62, 0.22],
                opacity: [1, 1, 0.35],
              }}
              transition={{ duration: 0.32, times: [0, 0.42, 1], ease: "easeInOut" }}
              onAnimationComplete={() =>
                setFlying((current) => current.filter((entry) => entry.id !== item.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const value = useContext(ShoppingListContext);
  if (!value) throw new Error("useShoppingList must be used within ShoppingListProvider");
  return value;
}
