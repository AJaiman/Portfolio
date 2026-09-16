"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildEntry,
  buildStates,
  ICON_SLOTS,
  fallbackInset,
  iconPlace,
  matchDirections,
  morphStroke,
  SECTIONS,
  STAGE_H,
  TITLE_SLOTS,
  titlePlace,
  toStageX,
  type InkState,
  type Place,
} from "@/lib/ink";

const INTRO_MS = 1900;
/** How long after mount a jump still counts as arrival rather than reading. */
const SETTLE_MS = 700;
/** How long a deep arrival holds the stage blank waiting for the scroll to land. */
const ARRIVE_HOLD_MS = 250;

/** Set once the opening has actually run to its end in this document, which is
 *  what makes a later mount a reader returning from a project page. React's
 *  development double-invoke remounts before the opening has played, so it
 *  leaves this unset and the opening still runs — no timing window needed. */
let introPlayed = false;
const TITLE_STAGGER = 0.035;
const ICON_STAGGER = 0.028;

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
    let inset = fallbackInset(W);

    // The content column's left edge, read off a real .gutter so the drawn
    // titles sit on the same line as the text however the CSS centres it.
    const measureInset = () => {
      const el = document.querySelector(".gutter");
      const stageCssW = document.documentElement.clientWidth;
      if (!el) return fallbackInset(W);
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      return toStageX(el.getBoundingClientRect().left + pad, W, stageCssW);
    };
    let titleFlags: Uint8Array[] = [];
    let iconFlags: Uint8Array[] = [];
    let tops: number[] = SECTIONS.map(() => 0);

    const measure = () => {
      W = Math.round(STAGE_H * (window.innerWidth / window.innerHeight));
      inset = measureInset();
      setStageW(W);

      tops = SECTIONS.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });

      const tp = (i: number) => titlePlace(i, W, states[i].titleWidth, inset);
      const ip = (i: number) => iconPlace(i, W, inset);
      titleFlags = [matchDirections(entry.title, states[0].title, tp(0), tp(0))];
      iconFlags = [matchDirections(entry.icon, states[0].icon, ip(0), ip(0))];
      for (let i = 0; i < states.length - 1; i++) {
        titleFlags.push(
          matchDirections(states[i].title, states[i + 1].title, tp(i), tp(i + 1))
        );
        iconFlags.push(
          matchDirections(states[i].icon, states[i + 1].icon, ip(i), ip(i + 1))
        );
      }
    };

    measure();

    const root = document.documentElement;

    // Coming back from a project page, or following a #hash link, drops the
    // reader mid-document with a freshly mounted stage. Replaying the opening
    // there would show the face and name for a beat before the ink scrambled
    // into the section they actually landed on, so the stage arrives already
    // settled instead.
    //
    // An opening that already played in this document is the one case scrollY
    // cannot report: on a client-side return the router restores the position a
    // frame or two after this effect runs, so the stage waits for it rather than
    // reading a position that is still zero.
    const returning = introPlayed;

    const landedDeep =
      returning ||
      window.scrollY > 4 ||
      SECTIONS.findIndex(({ id }) => id === window.location.hash.slice(1)) > 0;

    const mounted = performance.now();
    let started = mounted - (landedDeep ? INTRO_MS : 0);
    let settling = true;
    let smoothed = 0;
    let revealed = false;

    // Any real input means the reader is driving, so a later jump is theirs to
    // watch travel rather than something to snap past.
    const endSettle = () => {
      settling = false;
    };
    const settleEvents = ["wheel", "touchstart", "keydown"] as const;
    for (const type of settleEvents) {
      window.addEventListener(type, endSettle, { once: true, passive: true });
    }

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

      let target = 0;
      for (let i = 1; i < tops.length; i++) {
        const start = tops[i] - vh * 1.15;
        const end = tops[i] - vh * 0.35;
        target += clamp01((y - start) / (end - start));
      }

      if (settling) {
        if (target > 0.002) {
          started = now - INTRO_MS;
          smoothed = target;
          settling = false;
        } else if (now - mounted > SETTLE_MS) {
          settling = false;
        }
      }

      const intro = calm ? 1 : clamp01((now - started) / INTRO_MS);
      const introEase = 1 - Math.pow(1 - intro, 3);

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

      // A blank frame or two beats a flash of the wrong section while a
      // restored scroll position lands.
      if (landedDeep && settling && now - mounted < ARRIVE_HOLD_MS) {
        raf = requestAnimationFrame(draw);
        return;
      }

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
        titlePlace(ia, W, A.titleWidth, inset), titlePlace(ib, W, B.titleWidth, inset),
        titleFlags[pair], TITLE_SLOTS, TITLE_STAGGER, t, now, intro, drift
      );
      paint(
        iconSlots.current, A, B, "icon",
        iconPlace(ia, W, inset), iconPlace(ib, W, inset),
        iconFlags[pair], ICON_SLOTS, ICON_STAGGER, t, now, intro, drift
      );

      if (!revealed && intro >= 1) {
        revealed = true;
        introPlayed = true;
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
      for (const type of settleEvents) {
        window.removeEventListener(type, endSettle);
      }
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
