/* Each doodle is exactly six strokes, drawn centred on the origin in a roughly
   -55..55 box. The count is fixed so stroke N of one doodle always has a
   counterpart to travel to in the next — nothing appears or vanishes, it moves. */

export const DOODLE_STROKES = 6;

export const FACE: string[] = [
  // jaw + skull
  "M-34 -8 C-37 -28 -28 -45 -9 -48 C11 -51 32 -41 34 -21 C35 -6 33 6 30 16 C26 33 12 45 -2 43 C-16 41 -28 27 -32 11 C-33 5 -34 2 -34 -8",
  // fringe
  "M-36 -14 C-37 -36 -23 -52 -5 -52 C13 -52 30 -42 35 -23 C28 -35 14 -41 2 -37 C-6 -34 -11 -27 -16 -35 C-20 -28 -29 -23 -36 -14",
  // left eye
  "M-21 -15 C-18 -21 -10 -21 -8 -15 C-10 -9 -18 -9 -21 -15",
  // right eye
  "M8 -15 C11 -21 19 -21 21 -15 C19 -9 11 -9 8 -15",
  // nose
  "M-1 -11 C-2 -3 -4 3 -8 6 C-5 9 -1 9 3 7",
  // mouth
  "M-15 19 C-8 27 7 28 15 19",
];

export const COMPASS: string[] = [
  // needle leg
  "M-2 -38 C-8 -18 -16 6 -24 28 C-26 34 -27 40 -28 45",
  // pencil leg
  "M2 -38 C8 -18 16 6 24 28 C26 33 27 38 28 43",
  // hinge
  "M-7 -40 C-5 -49 5 -49 7 -40 C8 -36 4 -33 0 -34 C-4 -35 -8 -36 -7 -40",
  // pencil collar
  "M14 14 C18 12 22 11 26 10",
  // the arc it is drawing
  "M-45 21 C-35 46 14 55 43 29",
  // pivot hole
  "M-32 40 C-28 38 -25 42 -27 45 C-30 48 -34 45 -32 40",
];

export const ROBOT_ARM: string[] = [
  // base
  "M-40 46 L-8 46 L-12 29 L-36 29 L-40 46",
  // lower segment
  "M-24 29 C-22 14 -16 -1 -5 -11",
  // upper segment
  "M-5 -11 C6 -23 20 -30 33 -28",
  // elbow joint
  "M-5 -18 C1 -18 4 -14 3 -10 C2 -6 -3 -4 -7 -7 C-10 -10 -9 -17 -5 -18",
  // gripper, upper jaw
  "M31 -32 C39 -34 45 -38 48 -45",
  // gripper, lower jaw
  "M33 -22 C41 -22 48 -25 52 -31",
];

export const ENVELOPE: string[] = [
  // body
  "M-44 -20 L44 -20 L44 27 L-44 27 L-44 -20",
  // flap
  "M-44 -20 C-30 -8 -14 4 0 12 C14 4 30 -8 44 -20",
  // left fold
  "M-44 27 C-34 19 -22 9 -13 2",
  // right fold
  "M44 27 C34 19 22 9 13 2",
  // flight line, long
  "M-60 -38 C-44 -47 -18 -49 1 -43",
  // flight line, short
  "M-58 -28 C-49 -32 -39 -34 -31 -33",
];
