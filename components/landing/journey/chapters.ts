export type JourneyChapter = {
  id: string;
  progress: number;
  eyebrow: string;
  title: string;
  body: string;
};

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: "awaken",
    progress: 0.04,
    eyebrow: "Chapter 01",
    title: "Awaken Potential",
    body: "Change often starts with a small idea. Coaching helps you turn it into action.",
  },
  {
    id: "grow",
    progress: 0.2,
    eyebrow: "Chapter 02",
    title: "Grow With Wisdom",
    body: "Montessori principles create room for curiosity, confidence, and independent thinking.",
  },
  {
    id: "align",
    progress: 0.38,
    eyebrow: "Chapter 03",
    title: "Align Your Approach",
    body: "Your goals shape the plan. We bring together personal coaching, immersive learning, and useful technology.",
  },
  {
    id: "flow",
    progress: 0.56,
    eyebrow: "Chapter 04",
    title: "Enter the Infinite",
    body: "Learning works best when technology supports human curiosity instead of replacing it.",
  },
  {
    id: "ascend",
    progress: 0.74,
    eyebrow: "Chapter 05",
    title: "Ascend Through Method",
    body: "AI and immersive tools help you practise, reflect, and see your progress.",
  },
  {
    id: "begin",
    progress: 0.9,
    eyebrow: "Chapter 06",
    title: "Begin Your Journey",
    body: "Start with one goal. We will help you build from there.",
  },
];

/**
 * Cinematic camera — orbits, rises, banks, and approaches.
 * Not a straight Z push. Each beat has a hero shot + transition arc.
 *
 * Station Z anchors: logo 0 | lantern -22 | helmet -44 | dragon -66 | figure -88 | portal -110
 */
export const CAMERA_PATH = [
  // Ch1 — orbit in on logo (start wide right, sweep left, push in)
  { pos: [6.5, 2.4, 11], look: [0, 0.4, 0] },
  { pos: [3.2, 1.6, 8], look: [0, 0.3, 0] },
  { pos: [0.2, 0.9, 5.2], look: [0, 0.2, 0] },
  { pos: [-2.8, 1.4, 4.5], look: [0, 0.25, 0] },

  // Transit — whip through void, rise
  { pos: [-1.5, 3.5, -6], look: [0, 1, -16] },
  { pos: [2.5, 4.2, -12], look: [0, 1.5, -22] },

  // Ch2 — lantern: low approach then orbit up
  { pos: [4.5, 0.4, -18], look: [0, 1.2, -22] },
  { pos: [0.5, 1.8, -17], look: [0, 2.0, -22] },
  { pos: [-3.8, 3.2, -19], look: [0, 2.2, -22] },

  // Transit — dive and bank
  { pos: [-2, 5, -30], look: [1, 1, -40] },
  { pos: [3.5, 2.2, -36], look: [0, 1, -44] },

  // Ch3 — helmet: dramatic low angle + side glide
  { pos: [0.8, 0.2, -39], look: [0, 0.8, -44] },
  { pos: [3.5, 1.5, -41], look: [0, 0.9, -44] },
  { pos: [-2.5, 2.4, -42], look: [0, 1.0, -44] },

  // Transit — curve out
  { pos: [-4, 3, -52], look: [0, 1.5, -64] },
  { pos: [1, 4.5, -58], look: [0, 1.2, -66] },

  // Ch4 — dragon: circling reveal
  { pos: [5, 2, -62], look: [0, 1.0, -66] },
  { pos: [0, 3.5, -60], look: [0, 1.2, -66] },
  { pos: [-4.5, 1.8, -64], look: [0, 1.0, -66] },

  // Transit — climb
  { pos: [-1, 6, -74], look: [0, 3, -88] },
  { pos: [2.5, 5, -80], look: [0, 2.5, -88] },

  // Ch5 — figure: rise from below then pull back high
  { pos: [0, 0.5, -84], look: [0, 2, -88] },
  { pos: [3, 3.5, -85], look: [0, 2.5, -88] },
  { pos: [0, 6.5, -82], look: [0, 3, -88] },

  // Transit — drop toward portal
  { pos: [-2, 4, -96], look: [0, 1.5, -110] },
  { pos: [0, 2.2, -102], look: [0, 1.2, -110] },

  // Ch6 — portal: push through the rings
  { pos: [0, 1.5, -106], look: [0, 1.2, -112] },
  { pos: [0, 1.2, -109], look: [0, 1.2, -116] },
] as const;

export const STATION_BEATS = [
  { name: "logo", at: 0.0, radius: 0.14 },
  { name: "tree", at: 0.22, radius: 0.145 },
  { name: "trinity", at: 0.4, radius: 0.14 },
  { name: "infinity", at: 0.58, radius: 0.14 },
  { name: "helix", at: 0.76, radius: 0.14 },
  { name: "portal", at: 0.92, radius: 0.15 },
] as const;
