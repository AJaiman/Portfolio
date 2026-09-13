export type Seg =
  | ["M", number, number]
  | ["L", number, number]
  | ["C", number, number, number, number, number, number];

export type Stroke = Seg[];

const M = (x: number, y: number): Seg => ["M", x, y];
const L = (x: number, y: number): Seg => ["L", x, y];
const C = (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
): Seg => ["C", a, b, c, d, e, f];

type Glyph = { adv: number; strokes: Stroke[] };

/* Baseline sits at y=0, x-height at -35, cap height at -60, descenders to +7.
   Letters are monoline and allow retraces — the pen doubling back over its own
   line is what keeps them reading as drawn rather than typeset. */
const GLYPHS: Record<string, Glyph> = {
  A: {
    adv: 42,
    strokes: [
      [
        M(4, -2),
        C(9, -24, 15, -46, 19, -60),
        C(24, -44, 30, -22, 35, -2),
        L(30, -22),
        L(9, -21),
      ],
    ],
  },
  C: {
    adv: 46,
    strokes: [
      [
        M(41, -49),
        C(34, -60, 18, -62, 10, -51),
        C(2, -40, 3, -17, 13, -7),
        C(21, 1, 34, -1, 40, -10),
      ],
    ],
  },
  J: {
    adv: 38,
    strokes: [
      [M(31, -59), C(30, -40, 29, -20, 29, -13), C(29, -3, 21, 3, 13, 1), C(7, 0, 4, -5, 4, -10)],
    ],
  },
  P: {
    adv: 40,
    strokes: [
      [M(8, -2), C(8, -22, 8, -44, 8, -60), C(21, -60, 31, -56, 32, -46), C(33, -36, 22, -31, 8, -31)],
    ],
  },
  W: {
    adv: 54,
    strokes: [
      [
        M(3, -60),
        C(6, -42, 10, -16, 13, -2),
        C(17, -17, 21, -36, 24, -46),
        C(27, -36, 31, -17, 35, -2),
        C(38, -16, 42, -42, 45, -60),
      ],
    ],
  },
  a: {
    adv: 42,
    strokes: [
      [
        M(32, -24),
        C(29, -34, 14, -39, 6, -30),
        C(-1, -21, 1, -4, 13, -2),
        C(23, -1, 31, -11, 32, -22),
        L(32, -8),
        C(32, -4, 34, -2, 37, -2),
      ],
    ],
  },
  c: {
    adv: 34,
    strokes: [
      [M(29, -29), C(25, -35, 15, -38, 8, -31), C(1, -23, 3, -7, 12, -2), C(19, 1, 27, -3, 30, -9)],
    ],
  },
  e: {
    adv: 36,
    strokes: [
      [
        M(4, -19),
        C(13, -21, 23, -24, 29, -26),
        C(31, -33, 25, -38, 18, -37),
        C(8, -36, 2, -27, 3, -16),
        C(4, -6, 13, 0, 23, -4),
      ],
    ],
  },
  i: {
    adv: 18,
    strokes: [
      [M(8, -36), C(8, -26, 7, -12, 7, -2)],
      [M(6, -48), C(7, -51, 12, -50, 11, -47), C(10, -45, 6, -45, 6, -47)],
    ],
  },
  j: {
    adv: 22,
    strokes: [
      [M(15, -36), C(15, -22, 14, -12, 13, -6), C(12, 3, 7, 7, 1, 5)],
      [M(13, -48), C(14, -51, 19, -50, 18, -47), C(17, -45, 13, -45, 13, -47)],
    ],
  },
  k: {
    adv: 34,
    strokes: [
      [M(7, -60), C(7, -40, 6, -18, 6, -2)],
      [M(26, -35), C(20, -29, 14, -21, 7, -16), C(14, -13, 22, -7, 28, -2)],
    ],
  },
  m: {
    adv: 46,
    strokes: [
      [
        M(5, -35),
        L(5, -2),
        L(5, -25),
        C(8, -33, 15, -37, 19, -33),
        C(21, -31, 21, -20, 21, -2),
        L(21, -25),
        C(24, -33, 31, -37, 35, -33),
        C(37, -31, 37, -20, 37, -2),
      ],
    ],
  },
  n: {
    adv: 30,
    strokes: [
      [M(5, -35), L(5, -2), L(5, -25), C(8, -33, 16, -37, 20, -33), C(22, -31, 22, -20, 22, -2)],
    ],
  },
  o: {
    adv: 38,
    strokes: [
      [
        M(19, -36),
        C(9, -36, 3, -27, 3, -18),
        C(3, -7, 12, -1, 20, -3),
        C(28, -5, 33, -14, 32, -23),
        C(31, -31, 26, -36, 19, -36),
      ],
    ],
  },
  r: {
    adv: 30,
    strokes: [[M(6, -36), L(5, -2), L(6, -22), C(9, -31, 17, -38, 27, -34)]],
  },
  s: {
    adv: 32,
    strokes: [
      [
        M(27, -31),
        C(23, -36, 12, -38, 8, -33),
        C(4, -28, 12, -23, 19, -20),
        C(26, -17, 28, -9, 23, -4),
        C(18, 0, 8, -1, 5, -7),
      ],
    ],
  },
  t: {
    adv: 28,
    strokes: [
      [M(15, -50), C(15, -36, 14, -20, 14, -11), C(14, -4, 18, -1, 24, -3)],
      [M(4, -34), C(11, -35, 19, -36, 26, -36)],
    ],
  },
  v: {
    adv: 34,
    strokes: [[M(3, -36), C(5, -24, 11, -9, 16, -2), C(21, -10, 27, -25, 30, -36)]],
  },
};

const LETTER_GAP = 4;
const SPACE_ADV = 22;
const SLANT = 0.07;

function translate(stroke: Stroke, dx: number): Stroke {
  return stroke.map((seg) => {
    if (seg[0] === "C") {
      return C(seg[1] + dx, seg[2], seg[3] + dx, seg[4], seg[5] + dx, seg[6]);
    }
    return [seg[0], seg[1] + dx, seg[2]] as Seg;
  });
}

/** A loose swoosh beneath the word — the one stroke every title shares. */
function flourish(width: number): Stroke {
  return [
    M(-8, 16),
    C(width * 0.18, 25, width * 0.46, 9, width * 0.68, 18),
    C(width * 0.84, 24, width * 0.93, 15, width + 10, 11),
  ];
}

export function strokeToPath(stroke: Stroke): string {
  const shear = (x: number, y: number) => `${(x - y * SLANT).toFixed(2)} ${y.toFixed(2)}`;
  return stroke
    .map((seg) => {
      if (seg[0] === "C") {
        return `C${shear(seg[1], seg[2])} ${shear(seg[3], seg[4])} ${shear(seg[5], seg[6])}`;
      }
      return `${seg[0]}${shear(seg[1], seg[2])}`;
    })
    .join(" ");
}

export type Word = { paths: string[]; width: number };

/** Lays a string out left-to-right in the handwriting, origin at the baseline's
 *  left end, and appends the flourish as the final stroke. */
export function writeWord(text: string): Word {
  const strokes: Stroke[] = [];
  let pen = 0;

  for (const ch of text) {
    if (ch === " ") {
      pen += SPACE_ADV;
      continue;
    }
    const glyph = GLYPHS[ch];
    if (!glyph) continue;
    for (const stroke of glyph.strokes) strokes.push(translate(stroke, pen));
    pen += glyph.adv + LETTER_GAP;
  }

  const width = Math.max(0, pen - LETTER_GAP);
  strokes.push(flourish(width));

  return { paths: strokes.map(strokeToPath), width };
}
