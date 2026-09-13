"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildEntry,
  buildStates,
  ICON_SLOTS,
  iconPlace,
  matchDirections,
  morphStroke,
  SECTIONS,
  STAGE_H,
  TITLE_SLOTS,
  titlePlace,
  type InkState,
  type Place,
} from "@/lib/ink";

const INTRO_MS = 1900;
const TITLE_STAGGER = 0.035;
const ICON_STAGGER = 0.05;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Slot = { ink: SVGPathElement | null; ghost: SVGPathElement | null };
type SlotStore = { current: Slot[] };

const blankSlot = (): Slot => ({ ink: null, ghost: null });

export default function InkStage() {
  const [stageW, setStageW] = useState(1440);
  const titleSlots = useRef<Slot[]>([]);
  const iconSlots = useRef<Slot[]>([]);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const states: InkState[] = buildStates();
    const entry = calm ? states[0] : buildEntry(states[0]);

    let W = 1440;
    let titleFlags: Uint8Array[] = [];
    let iconFlags: Uint8Array[] = [];
    let tops: number[] = SECTIONS.map(() => 0);

    const measure = () => {
      W = Math.round(STAGE_H * (window.innerWidth / window.innerHeight));
      setStageW(W);

      tops = SECTIONS.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });

      const tp = (i: number) => titlePlace(i, W, states[i].titleWidth);
      titleFlags = [matchDirections(entry.title, states[0].title, tp(0), tp(0))];
      iconFlags = [
        matchDirections(entry.icon, states[0].icon, iconPlace(0, W), iconPlace(0, W)),
      ];
      for (let i = 0; i < states.length - 1; i++) {
        titleFlags.push(
          matchDirections(states[i].title, states[i + 1].title, tp(i), tp(i + 1))
        );
        iconFlags.push(
          matchDirections(
            states[i].icon,
            states[i + 1].icon,
            iconPlace(i, W),
            iconPlace(i + 1, W)
          )
        );
      }
    };

    measure();

    const root = document.documentElement;
    const started = performance.now();
    let smoothed = 0;
    let revealed = false;

    const paint = (
      slots: Slot[],
      av: InkState,
      bv: InkState,
      which: "title" | "icon",
      placeA: Place,
      placeB: Place,
      flags: Uint8Array,
      count: number,
      stagger: number,
      t: number,
      now: number,
      intro: number,
      drift: number
    ) => {
      const as = which === "title" ? av.title : av.icon;
      const bs = which === "title" ? bv.title : bv.icon;
      const ac = which === "title" ? av.titleCentroids : av.iconCentroids;
      const bc = which === "title" ? bv.titleCentroids : bv.iconCentroids;

      for (let k = 0; k < count; k++) {
        const slot = slots[k];
        if (!slot?.ink) continue;
        const shared = {
          slot: k,
          slotCount: count,
          stagger,
          reverse: flags[k] === 1,
          calm,
        };

        const main = morphStroke(as[k], bs[k], placeA, placeB, ac, bc, {
          ...shared,
          t,
          time: now,
          drift,
        });
        slot.ink.setAttribute("d", main.d);
        slot.ink.setAttribute("opacity", main.opacity.toFixed(3));

        if (slot.ghost) {
          // The searching line only runs ahead while the ink is actually
          // travelling; at rest it settles back onto its committed line.
          const lead = morphStroke(as[k], bs[k], placeA, placeB, ac, bc, {
            ...shared,
            t: clamp01(t + 0.07 * Math.sin(Math.PI * t)),
            time: now + 900,
            drift: drift * 1.6,
          });
          slot.ghost.setAttribute("d", lead.d);
          slot.ghost.setAttribute("opacity", (lead.opacity * 0.55).toFixed(3));
        }

        if (!revealed) {
          const off = (1 - clamp01((intro - k * 0.02) / 0.5)).toFixed(3);
          slot.ink.setAttribute("stroke-dashoffset", off);
          slot.ghost?.setAttribute("stroke-dashoffset", off);
        }
      }
    };

    const draw = (now: number) => {
      const vh = window.innerHeight;
      const y = window.scrollY;

      const intro = calm ? 1 : clamp01((now - started) / INTRO_MS);
      const introEase = 1 - Math.pow(1 - intro, 3);

      let target = 0;
      for (let i = 1; i < tops.length; i++) {
        const start = tops[i] - vh * 1.15;
        const end = tops[i] - vh * 0.35;
        target += clamp01((y - start) / (end - start));
      }
      // Scroll is held until the opening lands; the lerp then carries the ink
      // across instead of snapping it to wherever the reader already scrolled.
      if (intro < 1) target = 0;
      smoothed += (target - smoothed) * (calm ? 1 : 0.1);

      const h = y / vh;
      const copy = smoothstep(0.22, 0.72, h) * (1 - smoothstep(1.3, 1.62, h));
      root.style.setProperty("--copy-in", copy.toFixed(3));
      root.style.setProperty("--copy-y", `${((1 - copy) * 20).toFixed(1)}px`);
      root.style.setProperty("--hint", (1 - smoothstep(0.02, 0.2, h)).toFixed(3));
      root.style.setProperty("--head-fade", clamp01(smoothed * 2.2).toFixed(3));

      let A: InkState;
      let B: InkState;
      let t: number;
      let pair: number;
      let ia: number;
      let ib: number;

      if (intro < 1) {
        A = entry;
        B = states[0];
        t = introEase;
        pair = 0;
        ia = 0;
        ib = 0;
      } else {
        const idx = Math.min(Math.floor(smoothed), states.length - 2);
        A = states[idx];
        B = states[idx + 1];
        t = clamp01(smoothed - idx);
        pair = idx + 1;
        ia = idx;
        ib = idx + 1;
      }

      const drift = calm ? 0 : 1.1;

      paint(
        titleSlots.current, A, B, "title",
        titlePlace(ia, W, A.titleWidth), titlePlace(ib, W, B.titleWidth),
        titleFlags[pair], TITLE_SLOTS, TITLE_STAGGER, t, now, intro, drift
      );
      paint(
        iconSlots.current, A, B, "icon",
        iconPlace(ia, W), iconPlace(ib, W),
        iconFlags[pair], ICON_SLOTS, ICON_STAGGER, t, now, intro, drift
      );

      if (!revealed && intro >= 1) {
        revealed = true;
        for (const s of [...titleSlots.current, ...iconSlots.current]) {
          s?.ink?.setAttribute("stroke-dashoffset", "0");
          s?.ghost?.setAttribute("stroke-dashoffset", "0");
        }
      }

      raf = requestAnimationFrame(draw);
    };

    let raf = requestAnimationFrame(draw);

    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const slotPaths = (count: number, store: SlotStore, kind: "ghost" | "ink") =>
    Array.from({ length: count }, (_, i) => (
      <path
        key={`${kind}-${i}`}
        ref={(el) => {
          const slot = (store.current[i] ??= blankSlot());
          slot[kind] = el;
        }}
        d=""
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1}
        opacity={0}
        className={kind === "ghost" ? "ink-ghost" : "ink-line"}
      />
    ));

  return (
    <>
      <div className="head-fade" aria-hidden />
      <svg
        className="ink-stage"
        viewBox={`0 0 ${stageW} ${STAGE_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <g transform="translate(2.5 -2)">
          {slotPaths(TITLE_SLOTS, titleSlots, "ghost")}
          {slotPaths(ICON_SLOTS, iconSlots, "ghost")}
        </g>
        <g>
          {slotPaths(TITLE_SLOTS, titleSlots, "ink")}
          {slotPaths(ICON_SLOTS, iconSlots, "ink")}
        </g>
      </svg>
    </>
  );
}
