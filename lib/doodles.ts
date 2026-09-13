/* Every doodle draws into a shared budget of stroke slots, centred on the origin
   in a roughly -55..55 box. The face spends all of them; the objects use fewer
   and the remainder collapse into a neighbouring stroke, so a morph reads as ink
   being absorbed rather than ink blinking out. Slot order matters — stroke N
   travels to stroke N of the next doodle. */

export const DOODLE_STROKES = 16;

export const FACE: string[] = [
  // face, temple to temple — the hairline closes the top, so no skull line
  // crosses the forehead and doubles it
  "M-32 -10 C-35 3, -31 21, -21 31 C-15 38, -6 43, 0 43 C6 43, 15 38, 21 31 C31 21, 35 3, 32 -10",
  // hair: sits on the head rather than haloing it — only a little wider than
  // the face and stopping at the temples. Many small bumps, not a few big
  // lobes, is what keeps it reading as wave rather than as smooth volume.
  "M-34 2 C-40 2, -43 -3, -41 -8 C-46 -12, -46 -16, -43 -20 C-47 -25, -45 -30, -40 -32 C-43 -38, -39 -43, -33 -42 C-31 -48, -28 -52, -22 -50 C-19 -55, -15 -58, -10 -55 C-6 -59, -1 -60, 2 -56 C7 -60, 12 -58, 14 -52 C19 -55, 24 -50, 25 -45 C30 -47, 35 -42, 34 -35 C39 -32, 42 -28, 40 -22 C44 -18, 44 -13, 41 -8 C42 -3, 40 2, 34 2",
  // hairline, broken up so it doesn't read as a band against the curls
  "M-32 -10 C-31 -17, -26 -20, -21 -21 C-17 -22, -15 -26, -10 -26 C-6 -26, -3 -23, 1 -24 C5 -25, 8 -28, 13 -27 C18 -26, 21 -21, 25 -19 C28 -17, 30 -13, 32 -10",
  // coil, crown left
  "M-30 -44 C-25 -49, -18 -46, -21 -40 C-24 -36, -30 -38, -28 -42",
  // coil, crown high
  "M-8 -50 C-2 -55, 5 -52, 2 -46 C-1 -42, -7 -44, -5 -48",
  // coil, crown right
  "M14 -44 C19 -49, 26 -46, 23 -40 C20 -36, 14 -38, 16 -42",
  // coil, left temple
  "M-40 -24 C-35 -29, -29 -26, -32 -21 C-35 -17, -40 -19, -38 -23",
  // coil, right temple
  "M28 -24 C33 -29, 39 -26, 36 -21 C33 -17, 28 -19, 30 -23",
  // left brow
  "M-26 -11 C-22 -16, -14 -17, -9 -13",
  // right brow
  "M9 -13 C14 -17, 22 -16, 26 -11",
  // left eye
  "M-24 0 C-22 -6, -12 -6, -10 0 C-12 6, -22 6, -24 0",
  // right eye
  "M10 0 C12 -6, 22 -6, 24 0 C22 6, 12 6, 10 0",
  // left pupil
  "M-17 -3 C-14.5 -3, -14.5 3, -17 3 C-19.5 3, -19.5 -3, -17 -3",
  // right pupil
  "M17 -3 C19.5 -3, 19.5 3, 17 3 C14.5 3, 14.5 -3, 17 -3",
  // nose
  "M1 8 C0 13, -2 17, -5 20 C-2 23, 1 23, 4 21",
  // open smile
  "M-17 27 C-10 25, 10 25, 17 27 C15 34, 8 39, 0 39 C-8 39, -15 34, -17 27",
];

/* The legs are outlined rather than single lines, and the arc sits only under
   the pencil tip — an arc spanning both tips closes the legs into a cone and
   the whole thing reads as a party hat. */
export const COMPASS: string[] = [
  // hinge knuckle
  "M-9 -39 C-11 -47, -5 -54, 2 -53 C9 -52, 12 -45, 9 -39 C4 -37, -4 -37, -9 -39",
  // needle leg
  "M-7 -38 C-10 -14, -14 14, -17 40 C-16 41, -14 41, -13 40 C-10 14, -3 -14, -1 -38 C-3 -39, -5 -39, -7 -38",
  // pencil leg
  "M1 -38 C6 -14, 17 14, 27 37 C29 38, 31 37, 32 36 C23 13, 10 -14, 7 -38 C5 -39, 3 -39, 1 -38",
  // needle point
  "M-17 40 C-18 45, -19 50, -20 55",
  // pencil point
  "M28 37 C30 42, 32 47, 34 52 C35 47, 35 42, 33 37",
  // ferrule, upper band
  "M14 17 C17 16, 21 15, 24 13",
  // ferrule, lower band
  "M17 25 C20 24, 24 23, 27 21",
  // the arc it is drawing
  "M22 54 C28 59, 36 57, 42 51",
  // adjustment bar
  "M-11 -4 C-5 0, 6 0, 13 -4",
];

export const ROBOT_ARM: string[] = [
  // bench line
  "M-58 47 C-44 48, -14 48, 2 47",
  // base
  "M-48 46 C-38 46, -18 46, -8 46 C-11 40, -13 35, -15 31 C-25 31, -33 31, -40 31 C-43 36, -46 41, -48 46",
  // shoulder joint
  "M-27 32 C-22 32, -19 28, -19 24 C-19 20, -22 16, -27 16 C-32 16, -35 20, -35 24 C-35 28, -32 32, -27 32",
  // upper arm
  "M-33 21 C-26 8, -19 -4, -12 -15 C-8 -13, -4 -11, 0 -9 C-7 3, -14 16, -21 28 C-25 25, -29 23, -33 21",
  // elbow joint
  "M-6 -4 C-2 -4, 2 -8, 2 -12 C2 -16, -2 -20, -6 -20 C-10 -20, -14 -16, -14 -12 C-14 -8, -10 -4, -6 -4",
  // forearm
  "M-9 -18 C1 -24, 13 -30, 23 -36 C25 -32, 27 -28, 29 -24 C19 -19, 7 -12, -3 -6 C-5 -10, -7 -14, -9 -18",
  // wrist joint
  "M26 -23 C30 -23, 33 -26, 33 -30 C33 -34, 30 -37, 26 -37 C22 -37, 19 -34, 19 -30 C19 -26, 22 -23, 26 -23",
  // gripper, upper finger — splayed well off the forearm axis, otherwise the
  // pair just continues the tube and the claw disappears
  "M23 -36 C27 -42, 31 -49, 36 -55 C38 -54, 40 -53, 41 -51",
  // gripper, lower finger
  "M29 -24 C36 -25, 45 -25, 53 -26 C53 -28, 53 -30, 52 -32",
];

export const ENVELOPE: string[] = [
  // body
  "M-42 -18 C-28 -18, 28 -18, 42 -18 C42 -4, 42 12, 42 26 C28 26, -28 26, -42 26 C-42 12, -42 -4, -42 -18",
  // flap
  "M-42 -18 C-28 -8, -14 2, 0 11 C14 2, 28 -8, 42 -18",
  // flap thickness
  "M-42 -12 C-29 -3, -14 7, 0 16 C14 7, 29 -3, 42 -12",
  // left fold
  "M-42 26 C-32 18, -22 10, -14 3",
  // right fold
  "M42 26 C32 18, 22 10, 14 3",
  // flight line, long
  "M-64 -32 C-48 -42, -22 -44, -4 -38",
  // flight line, medium
  "M-62 -22 C-52 -27, -40 -29, -30 -28",
  // flight line, short
  "M-58 -12 C-52 -15, -46 -16, -41 -16",
];
