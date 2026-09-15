export type Project = {
  /** Unique. Used as the React key. */
  slug: string;
  name: string;
  year: string;
  /** One line. This is the whole pitch — the card is all there is. */
  blurb: string;
  /** Where the card goes. The repo, normally. */
  href: string;
  /** The card's thumbnail. Leave it off and the card renders without one. */
  cover?: { src: string; alt: string };
  /** First three show on the card. */
  stack: string[];
};

/* Copy this object, give it a real slug, and add it to PROJECTS below.
   `cover` and `stack` both degrade on their own if you leave them out. */
const TEMPLATE = {
  blurb: "One line on what it is. This is the whole pitch.",
  href: "https://github.com/aravjaiman",
  stack: ["TypeScript", "React", "Node.js"],
  cover: {
    src: "/projects/placeholder-wide.svg",
    alt: "Placeholder cover image",
  },
} satisfies Omit<Project, "slug" | "name" | "year">;

export const PROJECTS: Project[] = [
  {
    ...TEMPLATE,
    slug: "autonomous-car",
    name: "Autonomous Car",
    year: "2026",
    blurb:
      "Augmented an RC car chassis with my Jetson Nano running ROS2 to navigate the sidewalk.",
    // TODO: swap in the repo URL
    href: "https://github.com/aravjaiman",
    cover: {
      src: "/projects/autonomous-car.jpg",
      alt: "The Autonomous Car, an RC car chassis augmented with a Jetson Nano",
    },
  },
  {
    ...TEMPLATE,
    slug: "overwatch-controller",
    name: "Overwatch Controller",
    year: "2025",
    blurb: "Point and shoot like you're actually in the game",
    // TODO: swap in the repo URL
    href: "https://github.com/aravjaiman",
    cover: {
      src: "/projects/overwatch-controller.jpg",
      alt: "The Overwatch Controller, a blue and orange 3D-printed motion controller shaped like a gun",
    },
  },
  {
    ...TEMPLATE,
    slug: "cost-based-path-planner",
    name: "Cost based Path-Planner",
    year: "2025",
    blurb:
      "A monocular camera based approach to rover localization and path planning.",
    // TODO: swap in the repo URL
    href: "https://github.com/aravjaiman",
    cover: {
      src: "/projects/path-planner.jpg",
      alt: "The Cost Based Path Planner rover navigating terrain",
    },
  },
  {
    ...TEMPLATE,
    slug: "internia",
    name: "Internia",
    year: "2024",
    blurb:
      "A web app that helps users find research papers with a like/dislike reccommendation system.",
    // TODO: swap in the repo URL
    href: "https://github.com/aravjaiman",
    cover: {
      src: "/projects/internia.jpg",
      alt: "Internia landing page",
    },
  },
];
