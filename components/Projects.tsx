import Reveal from "./Reveal";

const PROJECTS = [
  {
    name: "Project one",
    year: "2026",
    blurb:
      "Placeholder — what it does and the one decision you'd defend in an interview.",
    stack: ["TypeScript", "React"],
    href: "#",
  },
  {
    name: "Project two",
    year: "2025",
    blurb: "Placeholder — the thing that broke, and what you built to stop it breaking.",
    stack: ["Python", "PostgreSQL"],
    href: "#",
  },
  {
    name: "Project three",
    year: "2025",
    blurb: "Placeholder — the one you made purely because it sounded fun.",
    stack: ["C", "Make"],
    href: "#",
  },
  {
    name: "Project four",
    year: "2024",
    blurb: "Placeholder — small, finished, still proud of it.",
    stack: ["Go"],
    href: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 min-h-[140vh] pt-[42vh] pb-[16vh]">
      <div className="gutter">
        <Reveal>
          <p className="max-w-[34rem] text-[1.0625rem] leading-[1.75] text-ink-soft">
            Things I built because I wanted to see if they would work.
          </p>
        </Reveal>

        <div className="mt-16 grid max-w-[62rem] gap-7 sm:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.name} delay={(i % 2) * 90}>
              <a
                href={project.href}
                className="sketch group flex h-full flex-col p-8 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-baseline justify-between">
                  <span className="label text-mark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label">{project.year}</span>
                </div>

                <h3 className="mt-7 text-[1.35rem] leading-snug text-ink">
                  {project.name}
                </h3>
                <p className="mt-3 text-[0.975rem] leading-[1.7] text-ink-soft">
                  {project.blurb}
                </p>

                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-8">
                  {project.stack.map((tag) => (
                    <span key={tag} className="label">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
