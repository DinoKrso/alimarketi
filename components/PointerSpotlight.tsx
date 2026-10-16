"use client";

import { useEffect } from "react";

export function PointerSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let lit: HTMLElement | null = null;
    let frame = 0;

    const dim = (panel: HTMLElement | null) => panel?.style.setProperty("--spot-o", "0");

    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".panel-ink") : null;
      if (target !== lit) {
        dim(lit);
        lit = target;
      }
      if (!target) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--spot-x", `${Math.round(event.clientX - rect.left)}px`);
        target.style.setProperty("--spot-y", `${Math.round(event.clientY - rect.top)}px`);
        target.style.setProperty("--spot-o", "1");
      });
    };
    const leave = () => {
      dim(lit);
      lit = null;
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return null;
}
