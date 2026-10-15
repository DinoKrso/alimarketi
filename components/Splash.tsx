"use client";

import { motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Intro splash shown every time the home page is loaded in full (first
 * visit, refresh, opening the link). Client-side navigation back to "/"
 * does not replay it, and inner pages never show it.
 *
 * `<html data-splash>` carries the state:
 *  - "off"  set by the inline script in layout.tsx before paint (not the home
 *           page, or reduced motion), so the server-rendered splash is hidden
 *           by CSS and never flashes;
 *  - "done" set here the moment the curtain starts to lift, so the hero can
 *           start its own entrance underneath.
 */

/** Runs in <head> before first paint. */
export const splashBootScript = `try{if(location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.splash="off"}catch(e){document.documentElement.dataset.splash="off"}`;

function readDone() {
  const state = document.documentElement.dataset.splash;
  return state === "off" || state === "done";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-splash"] });
  return () => observer.disconnect();
}

/** True once the splash is out of the way (or was never shown). */
export function useSplashDone() {
  return useSyncExternalStore(subscribe, readDone, () => false);
}

function useSkipped() {
  return useSyncExternalStore(
    () => () => {},
    () => document.documentElement.dataset.splash === "off",
    () => false,
  );
}

const curtain = [0.76, 0, 0.24, 1] as const;
const ease = [0.16, 1, 0.3, 1] as const;

/** How long the logo stays on screen before the curtain lifts. */
const HOLD_MS = 1500;

export function Splash() {
  const skipped = useSkipped();
  const [phase, setPhase] = useState<"play" | "exit" | "gone">("play");

  useEffect(() => {
    const root = document.documentElement;
    // Read the attribute itself: during hydration `skipped` still holds the
    // server value. "done" covers a dev hot reload remounting us after the intro.
    const state = root.dataset.splash;
    if (state === "off" || state === "done") return;
    root.dataset.splash = "on";
    const previous = root.style.overflow;
    root.style.overflow = "hidden";

    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      setPhase("exit");
      root.style.overflow = previous;
      root.dataset.splash = "done";
    };

    // Wait for the fonts (capped) so the page underneath is settled when revealed.
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const hold = new Promise((resolve) => setTimeout(resolve, HOLD_MS));
    const cap = new Promise((resolve) => setTimeout(resolve, 3000));
    Promise.race([Promise.all([fonts, hold]), cap]).then(finish);

    return () => {
      cancelled = true;
      root.style.overflow = previous;
    };
  }, [skipped]);

  if (skipped || phase === "gone") return null;
  const exiting = phase === "exit";
  const lift = { y: "-100%", borderBottomLeftRadius: "50% 12%", borderBottomRightRadius: "50% 12%" };

  return (
    <div className="splash-root pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      {/* Orange under-layer: trails the green curtain on the way out. */}
      <motion.div
        className="absolute inset-0 bg-brand"
        initial={{ y: "0%" }}
        animate={exiting ? lift : undefined}
        transition={{ duration: 0.9, ease: curtain, delay: 0.14 }}
        onAnimationComplete={() => exiting && setPhase("gone")}
      />

      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ y: "0%" }}
        animate={exiting ? lift : undefined}
        transition={{ duration: 0.85, ease: curtain }}
      >
        <div className="panel-ink pointer-events-auto grid h-full w-full place-items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={
              exiting
                ? { opacity: 0, y: -30, scale: 0.96, filter: "blur(0px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            transition={exiting ? { duration: 0.4, ease: [0.4, 0, 1, 1] } : { duration: 0.8, ease }}
          >
            <img src="/logo-ali.svg" alt="" width={161} height={100} className="h-auto w-[min(82vw,34rem)]" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
