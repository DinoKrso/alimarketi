"use client";

import { Icon } from "@/components/Icon";
import type { Flyer, FlyerPage } from "@/data/types";
import { cn } from "@/lib/cn";
import { btn } from "@/lib/ui";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type Flip = { dir: 1 | -1; to: number; phase: "drag" | "anim" };

/**
 * One sheet at a time, hinged on the left like a book.
 * The page underneath is already the one being revealed, and the top
 * sheet turns off to the left. Drag the page, or use the arrows.
 */
export function FlyerViewer({ flyer }: { flyer: Flyer }) {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const leaf = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const drag = useRef<{ x: number; y: number; dir: 1 | -1; to: number } | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const angle = useRef(0);

  const page = flyer.pages[index];
  const front = flip && flip.dir === -1 ? flyer.pages[flip.to] : page;
  const under = flip && flip.dir === 1 ? flyer.pages[flip.to] : page;

  useEffect(() => {
    return () => {
      timeline.current?.kill();
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") turn(1);
      if (event.key === "ArrowLeft") turn(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useLayoutEffect(() => {
    if (flip) return;
    applyAngle(0);
    if (shade.current) gsap.set(shade.current, { opacity: 0 });
  }, [flip]);

  function settle(next: number) {
    lock.current = false;
    setIndex(next);
    setFlip(null);
  }

  function applyAngle(deg: number) {
    angle.current = deg;
    const node = leaf.current;
    if (!node) return;
    node.style.translate = "none";
    node.style.rotate = "none";
    node.style.scale = "none";
    node.style.transform = `rotateY(${deg}deg)`;
  }

  function play(from: number, to: number, done: () => void) {
    const node = leaf.current;
    if (!node) {
      done();
      return;
    }
    timeline.current?.kill();
    const state = { deg: from };
    applyAngle(from);
    const tl = gsap.timeline({ onComplete: done });
    tl.to(state, {
      deg: to,
      duration: 0.78,
      ease: "power2.inOut",
      onUpdate: () => applyAngle(state.deg),
    }, 0);
    if (shade.current) {
      tl.fromTo(
        shade.current,
        { opacity: 0.08 },
        { opacity: 0.45, duration: 0.39, yoyo: true, repeat: 1, ease: "power1.inOut" },
        0,
      );
    }
    timeline.current = tl;
  }

  function turn(dir: 1 | -1) {
    const to = index + dir;
    if (to < 0 || to >= flyer.pages.length || lock.current || flip || zoomed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(to);
      return;
    }
    lock.current = true;
    flushSync(() => setFlip({ dir, to, phase: "anim" }));
    play(dir === 1 ? 0 : -180, dir === 1 ? -180 : 0, () => settle(to));
  }

  function rotationFor(dir: 1 | -1, dx: number) {
    const width = book.current?.offsetWidth || 1;
    const raw = dir === 1 ? (dx / width) * 180 : -180 + (dx / width) * 180;
    return Math.max(-180, Math.min(0, raw));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (zoomed || lock.current || flip?.phase === "anim") return;
    pointer.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointer.current || !leaf.current) return;
    const dx = event.clientX - pointer.current.x;
    const dy = event.clientY - pointer.current.y;
    if (!drag.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        pointer.current = null;
        return;
      }
      const dir: 1 | -1 = dx < 0 ? 1 : -1;
      const to = index + dir;
      if (to < 0 || to >= flyer.pages.length) {
        pointer.current = null;
        return;
      }
      drag.current = { x: pointer.current.x, y: pointer.current.y, dir, to };
      lock.current = true;
      if (dir === -1) applyAngle(-180);
      setFlip({ dir, to, phase: "drag" });
    }
    const rot = rotationFor(drag.current.dir, event.clientX - drag.current.x);
    applyAngle(rot);
    if (shade.current) {
      const progress = drag.current.dir === 1 ? Math.abs(rot) / 180 : (180 - Math.abs(rot)) / 180;
      gsap.set(shade.current, { opacity: Math.sin(progress * Math.PI) * 0.45 });
    }
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = pointer.current;
    const active = drag.current;
    pointer.current = null;
    drag.current = null;
    if (!start) return;

    if (!active) {
      if (zoomed || lock.current) return;
      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      if (moved > 10 || !book.current) return;
      const rect = book.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      if (x > rect.width * 0.62) turn(1);
      else if (x < rect.width * 0.38) turn(-1);
      return;
    }

    const rot = angle.current;
    const progress = active.dir === 1 ? Math.abs(rot) / 180 : (180 - Math.abs(rot)) / 180;
    const commit = progress > 0.28;
    if (commit) {
      play(rot, active.dir === 1 ? -180 : 0, () => settle(active.to));
      return;
    }
    play(rot, active.dir === 1 ? 0 : -180, () => {
      flushSync(() => setFlip(null));
      applyAngle(0);
      if (shade.current) gsap.set(shade.current, { opacity: 0 });
      lock.current = false;
    });
  }

  return (
    <div>
      <div className={cn("overflow-auto rounded-[20px]", zoomed && "max-h-[80vh]")}>
        <div className={cn("mx-auto max-w-[460px] px-3 pt-1 pb-4", zoomed && "max-w-none origin-top scale-150 px-0")}>
          <div className="relative">
            <div aria-hidden className="absolute top-3 left-3 -z-20 h-full w-full rounded-[18px] border border-line bg-[#e5d9c6]" />
            <div aria-hidden className="absolute top-1.5 left-1.5 -z-10 h-full w-full rounded-[18px] border border-line bg-[#efe6d6]" />
            <div
              ref={book}
              className="relative cursor-grab touch-pan-y active:cursor-grabbing"
              style={{ perspective: 2200, aspectRatio: `${page.width} / ${page.height}` }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_28px_50px_-32px_rgb(15_43_33/0.65)]">
                <Sheet page={under} alt="" />
                <div
                  ref={leaf}
                  className="absolute inset-0 [transform-style:preserve-3d]"
                  style={{ transformOrigin: "left center" }}
                >
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <Sheet page={front} alt={front.alt} priority />
                    <div
                      ref={shade}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent opacity-0"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#e7dccb,#f7f1e6_16%,#f7f1e6)] [transform:rotateY(180deg)] [backface-visibility:hidden]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-[560px] flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1">
          <button
            type="button"
            className="press grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30"
            onClick={() => turn(-1)}
            disabled={index === 0 || flip != null}
            aria-label="Prethodna strana"
          >
            <Icon name="arrowLeft" />
          </button>
          <p className="min-w-16 text-center font-semibold tabular-nums">
            {index + 1} / {flyer.pages.length}
          </p>
          <button
            type="button"
            className="press grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30"
            onClick={() => turn(1)}
            disabled={index === flyer.pages.length - 1 || flip != null}
            aria-label="Sljedeća strana"
          >
            <Icon name="arrow" />
          </button>
        </div>
        <button
          type="button"
          className={`${btn.small} min-h-12 border border-line bg-white hover:border-ink/40`}
          onClick={() => setZoomed((value) => !value)}
          aria-pressed={zoomed}
        >
          <Icon name="zoom" className="h-4 w-4" />
          {zoomed ? "Umanji" : "Uvećaj"}
        </button>
        {flyer.pdf ? (
          <a href={flyer.pdf} download className={`${btn.primary} min-h-12`}>
            <Icon name="download" className="h-4 w-4" />
            Preuzmi PDF
          </a>
        ) : null}
      </div>
      <p className="mt-3 text-center text-sm text-muted">
        Prevuci stranicu kao u knjizi, ili klikni lijevu i desnu ivicu.
      </p>
    </div>
  );
}

function Sheet({ page, alt, priority = false }: { page: FlyerPage; alt: string; priority?: boolean }) {
  return (
    <Image
      src={page.src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 92vw, 460px"
      priority={priority}
      draggable={false}
      className="pointer-events-none bg-white object-cover select-none"
    />
  );
}
