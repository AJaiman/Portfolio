export type Media =
  /** A file in /public, or any absolute image URL. */
  | { kind: "image"; src: string; alt: string; w?: number; h?: number; caption?: string }
  /** A self-hosted clip in /public — .mp4 or .webm. `poster` is the still frame. */
  | { kind: "video"; src: string; poster?: string; caption?: string }
  /** A YouTube/Vimeo *embed* URL, not the page URL: youtube.com/embed/<id>. */
  | { kind: "embed"; src: string; title: string; caption?: string };

export type Project = {
  slug: string;
  name: string;
  year: string;
  /** One line, shown on the card on the home page. */
  blurb: string;
  /** Opening paragraph on the project's own page. */
  summary: string;
  facts: { label: string; value: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  cover?: Media;
  sections: { heading: string; body: string[]; media?: Media[] }[];
};

/* Copy this object, give it a real slug, and add it to PROJECTS below. Anything
   you leave out degrades on its own — no cover, no facts, no links, or no media
   in a section all render fine, so fill it in as you go. */
const TEMPLATE = {
  blurb: "One line on what it is. This is what shows on the card.",
  summary:
    "Two or three sentences on what the project is and why it exists. Lead with the problem, not the stack — the tools are listed further down and nobody decides to keep reading because you used Postgres.",
  facts: [
    { label: "Role", value: "Solo build" },
    { label: "Timeline", value: "6 weeks" },
    { label: "Status", value: "Shipped" },
  ],
  stack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
  links: [
    { label: "GitHub", href: "https://github.com/aravjaiman" },
    { label: "Live site", href: "#" },
  ],
  cover: {
    kind: "image",
    src: "/projects/placeholder-wide.svg",
    alt: "Placeholder cover image",
    w: 1600,
    h: 900,
  },
  sections: [
    {
      heading: "The problem",
      body: [
        "What was actually broken or missing, in plain terms. The best version of this paragraph would make sense to someone outside your field.",
        "If there was a moment where you realised the obvious approach wouldn't work, this is where it goes.",
      ],
    },
    {
      heading: "How it works",
      body: [
        "The shape of the thing: the main pieces and how they fit. Enough that someone could sketch the architecture after reading it.",
        "Pull out the one decision you'd defend in an interview and say why you made it.",
      ],
      media: [
        {
          kind: "image",
          src: "/projects/placeholder-wide.svg",
          alt: "Placeholder screenshot",
          w: 1600,
          h: 900,
          caption: "A caption is optional — use it to say what the reader is looking at.",
        },
        {
          kind: "image",
          src: "/projects/placeholder-square.svg",
          alt: "Placeholder detail shot",
          w: 1000,
          h: 1000,
          caption: "Two or more images in one section lay out side by side.",
        },
      ],
      // To show a clip instead, drop the file in /public/projects and use:
      //   { kind: "video", src: "/projects/demo.mp4", poster: "/projects/demo-poster.png" }
      // Or embed one — note this is the /embed/ URL, not the watch URL:
      //   { kind: "embed", src: "https://www.youtube.com/embed/VIDEO_ID", title: "Demo" }
    },
    {
      heading: "What I'd change",
      body: [
        "What you'd do differently with more time, or what broke in a way you didn't expect. This section is worth more than it looks — it's the one that reads as someone who actually shipped something.",
      ],
    },
  ],
} satisfies Omit<Project, "slug" | "name" | "year">;

export const PROJECTS: Project[] = [
  {
    ...TEMPLATE,
    slug: "autonomous-car",
    name: "Autonomous Car",
    year: "2026",
    blurb:
      "Augmented an RC car chassis with my Jetson Nano running ROS2 to navigate the sidewalk.",
    cover: {
      kind: "image",
      src: "/projects/autonomous-car.jpg",
      alt: "The Autonomous Car, an RC car chassis augmented with a Jetson Nano",
      w: 1600,
      h: 900,
    },
  },
  {
    ...TEMPLATE,
    slug: "overwatch-controller",
    name: "Overwatch Controller",
    year: "2025",
    blurb: "Point and shoot like you're actually in the game",
    cover: {
      kind: "image",
      src: "/projects/overwatch-controller.jpg",
      alt: "The Overwatch Controller, a blue and orange 3D-printed motion controller shaped like a gun",
      w: 1600,
      h: 900,
    },
  },
  {
    ...TEMPLATE,
    slug: "cost-based-path-planner",
    name: "Cost Based Path Planner",
    year: "2025",
    blurb:
      "Turned a single camera into a terrain cost map so a rover could plan its own way across it.",
    cover: {
      kind: "image",
      src: "/projects/path-planner.jpg",
      alt: "The Cost Based Path Planner rover navigating terrain",
      w: 1600,
      h: 900,
    },
  },
  { ...TEMPLATE, slug: "project-four", name: "Project four", year: "2024" },
];

export function getProject(slug: string) {
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    project: PROJECTS[index],
    index,
    next: PROJECTS[(index + 1) % PROJECTS.length],
  };
}
