import { writeWord } from "./hand";
import { COMPASS, DOODLE_STROKES, ENVELOPE, FACE, ROBOT_ARM } from "./doodles";

export const TITLE_SLOTS = 12;
export const ICON_SLOTS = DOODLE_STROKES;
const TITLE_SAMPLES = 56;
const ICON_SAMPLES = 88;
const TAU = Math.PI * 2;

/** Fixed unit height for the stage; width is derived from the viewport aspect
 *  so the drawing reaches the real edges instead of letterboxing. */
export const STAGE_H = 900;

export type Pts = Float32Array;
export type Place = { x: number; y: number; s: number };

export type InkState = {
  title: Pts[];
  titleCentroids: Float32Array;
  titleWidth: number;
  icon: Pts[];
  iconCentroids: Float32Array;
};

export const SECTIONS = [
  { id: "hero", label: "Arav Jaiman", doodle: FACE },
  { id: "work", label: "Work", doodle: COMPASS },
  { id: "projects", label: "Projects", doodle: ROBOT_ARM },
  { id: "contact", label: "Contact", doodle: ENVELOPE },
] as const;

function sampler() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.opacity = "0";
  svg.style.pointerEvents = "none";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.appendChild(path);
  document.body.appendChild(svg);

  const take = (d: string, n: number): Pts => {
    path.setAttribute("d", d);
    const total = path.getTotalLength();
    const out = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const p = path.getPointAtLength((i / (n - 1)) * total);
      out[i * 2] = p.x;
      out[i * 2 + 1] = p.y;
    }
    return out;
  };

  return { take, dispose: () => svg.remove() };
}

function centroid(pts: Pts): [number, number] {
  let x = 0;
  let y = 0;
  const n = pts.length / 2;
  for (let i = 0; i < n; i++) {
    x += pts[i * 2];
    y += pts[i * 2 + 1];
  }
  return [x / n, y / n];
}

/** Collapses a slot to a single point so unused strokes have somewhere to hide.
 *  They sink into a real stroke's midpoint rather than parking off-canvas, so a
 *  morph reads as ink being absorbed instead of ink disappearing. */
function collapsed(host: Pts, n: number): Pts {
  const mid = Math.floor(host.length / 4) * 2;
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    out[i * 2] = host[mid];
    out[i * 2 + 1] = host[mid + 1];
  }
  return out;
}

function pad(real: Pts[], slots: number, samples: number): Pts[] {
  const out = real.slice(0, slots);
  for (let i = real.length; i < slots; i++) {
    out.push(collapsed(real[i % real.length], samples));
  }
  return out;
}

function centroidsOf(strokes: Pts[]): Float32Array {
  const out = new Float32Array(strokes.length * 2);
  strokes.forEach((s, i) => {
    const [x, y] = centroid(s);
    out[i * 2] = x;
    out[i * 2 + 1] = y;
  });
  return out;
}

export function buildStates(): InkState[] {
  const { take, dispose } = sampler();

  const states = SECTIONS.map(({ label, doodle }) => {
    const word = writeWord(label);
    const letters = word.paths.slice(0, -1).map((d) => take(d, TITLE_SAMPLES));
    const swash = take(word.paths[word.paths.length - 1], TITLE_SAMPLES);

    // The flourish is pinned to the final slot in every state so the underline
    // stays an underline across the whole page instead of becoming a letter.
    const title = [...pad(letters, TITLE_SLOTS - 1, TITLE_SAMPLES), swash];
    const icon = pad(
      doodle.map((d) => take(d, ICON_SAMPLES)),
      ICON_SLOTS,
      ICON_SAMPLES
    );

    return {
      title,
      titleCentroids: centroidsOf(title),
      titleWidth: word.width,
      icon,
      iconCentroids: centroidsOf(icon),
    };
  });

  dispose();
  return states;
}

/** Off-stage entry geometry: every stroke flung outward on its own bearing with
 *  a curl in it, so the opening reads as lines swinging in from beyond the page. */
export function buildEntry(state: InkState): InkState {
  const fling = (strokes: Pts[], seedOffset: number): Pts[] =>
    strokes.map((pts, slot) => {
      const n = pts.length / 2;
      const angle = ((slot + seedOffset) / (strokes.length + 2)) * TAU + 0.7;
      const dist = 620 + 220 * (((slot * 13) % 7) / 7);
      const ox = Math.cos(angle) * dist;
      const oy = Math.sin(angle) * dist * 0.8;
      const px = Math.cos(angle + Math.PI / 2);
      const py = Math.sin(angle + Math.PI / 2);
      const out = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        const curl = 120 * Math.sin(u * Math.PI * 1.6 + slot);
        out[i * 2] = pts[i * 2] + ox + curl * px;
        out[i * 2 + 1] = pts[i * 2 + 1] + oy + curl * py;
      }
      return out;
    });

  const title = fling(state.title, 0);
  const icon = fling(state.icon, 3);
  return {
    title,
    titleCentroids: centroidsOf(title),
    titleWidth: state.titleWidth,
    icon,
    iconCentroids: centroidsOf(icon),
  };
}

/* ---- placement ---- */

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export function titlePlace(index: number, W: number, titleWidth: number): Place {
  if (index === 0) {
    const s = Math.min(1.42, (W * 0.66) / titleWidth);
    return { x: (W - titleWidth * s) / 2, y: 405, s };
  }
  const margin = Math.max(54, W * 0.065);
  const s = Math.min(0.72, (W * 0.37) / titleWidth);
  return { x: margin, y: 122, s };
}

export function iconPlace(index: number, W: number): Place {
  if (index === 0) {
    return { x: W / 2, y: 190, s: clamp(W * 0.00145, 0.92, 1.55) };
  }
  const margin = Math.max(54, W * 0.065);
  const s = clamp(W * 0.00066, 0.44, 0.84);
  return { x: W - margin - 56 * s, y: 114, s };
}

/* ---- morphing ---- */

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Points run in whichever direction the pen drew them. Where two strokes were
 *  drawn in opposing directions the naive pairing turns the shape inside out, so
 *  the shorter of the two pairings wins. */
export function matchDirections(a: Pts[], b: Pts[], pa: Place, pb: Place): Uint8Array {
  const flags = new Uint8Array(a.length);
  for (let k = 0; k < a.length; k++) {
    const A = a[k];
    const B = b[k];
    const n = A.length / 2;
    const last = (n - 1) * 2;
    const ax0 = pa.x + A[0] * pa.s;
    const ay0 = pa.y + A[1] * pa.s;
    const ax1 = pa.x + A[last] * pa.s;
    const ay1 = pa.y + A[last + 1] * pa.s;
    const bx0 = pb.x + B[0] * pb.s;
    const by0 = pb.y + B[1] * pb.s;
    const bx1 = pb.x + B[last] * pb.s;
    const by1 = pb.y + B[last + 1] * pb.s;

    const fwd = (ax0 - bx0) ** 2 + (ay0 - by0) ** 2 + (ax1 - bx1) ** 2 + (ay1 - by1) ** 2;
    const rev = (ax0 - bx1) ** 2 + (ay0 - by1) ** 2 + (ax1 - bx0) ** 2 + (ay1 - by0) ** 2;
    flags[k] = rev < fwd ? 1 : 0;
  }
  return flags;
}

export type MorphOpts = {
  t: number;
  slot: number;
  slotCount: number;
  stagger: number;
  reverse: boolean;
  time: number;
  drift: number;
  calm: boolean;
};

export type MorphResult = { d: string; opacity: number };

const swirlFor = (slot: number) =>
  (slot % 2 ? 1 : -1) * (0.34 + 0.2 * ((slot * 7) % 5));

export function morphStroke(
  A: Pts,
  B: Pts,
  pa: Place,
  pb: Place,
  ca: Float32Array,
  cb: Float32Array,
  o: MorphOpts
): MorphResult {
  const n = A.length / 2;
  const span = 1 - o.slotCount * o.stagger;
  const tk = clamp((o.t - o.slot * o.stagger) / span, 0, 1);
  const e = easeInOut(tk);
  const f = Math.sin(Math.PI * tk);

  const acx = pa.x + ca[o.slot * 2] * pa.s;
  const acy = pa.y + ca[o.slot * 2 + 1] * pa.s;
  const bcx = pb.x + cb[o.slot * 2] * pb.s;
  const bcy = pb.y + cb[o.slot * 2 + 1] * pb.s;
  const cx = acx + (bcx - acx) * e;
  const cy = acy + (bcy - acy) * e;

  const travel = Math.hypot(bcx - acx, bcy - acy);
  const amp = o.calm ? 0 : Math.min(115, travel * 0.22);
  const ang = o.calm ? 0 : f * swirlFor(o.slot);
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const fa = 1 + (o.slot % 3);
  const fb = 1 + (o.slot % 2);
  const phase = o.slot * 1.9;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let d = "";

  for (let i = 0; i < n; i++) {
    const j = o.reverse ? n - 1 - i : i;
    const ax = pa.x + A[i * 2] * pa.s;
    const ay = pa.y + A[i * 2 + 1] * pa.s;
    const bx = pb.x + B[j * 2] * pb.s;
    const by = pb.y + B[j * 2 + 1] * pb.s;

    let x = ax + (bx - ax) * e;
    let y = ay + (by - ay) * e;

    if (ang !== 0) {
      const dx = x - cx;
      const dy = y - cy;
      x = cx + dx * cos - dy * sin;
      y = cy + dx * sin + dy * cos;
    }

    const u = i / (n - 1);
    if (amp !== 0) {
      const w = 0.45 + 0.55 * Math.sin(u * Math.PI);
      x += f * amp * w * Math.sin(u * TAU * fa + phase);
      y += f * amp * w * Math.cos(u * TAU * fb + phase * 1.3);
    }
    if (o.drift !== 0) {
      x += o.drift * Math.sin(u * 9 + o.time * 0.0011 + o.slot);
      y += o.drift * Math.cos(u * 7 - o.time * 0.0009 + o.slot * 1.7);
    }

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;

    const rx = ((x * 10) | 0) / 10;
    const ry = ((y * 10) | 0) / 10;
    d += i === 0 ? `M${rx} ${ry}` : `L${rx} ${ry}`;
  }

  // A collapsed slot is a single repeated point; round caps would draw it as a
  // visible dot, so extent decides whether the slot is inked at all. The floor
  // clears the idle drift, which otherwise smears a collapsed point into a speck.
  const extent = Math.hypot(maxX - minX, maxY - minY);
  const opacity = clamp((extent - 3.5) / 6, 0, 1);

  return { d, opacity };
}
