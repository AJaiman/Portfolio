import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import Reveal from "./Reveal";

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
            <Reveal key={project.slug} delay={(i % 2) * 90}>
              <Link
                href={`/projects/${project.slug}`}
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

                <div className="mt-auto flex items-end justify-between gap-6 pt-8">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {project.stack.slice(0, 3).map((tag) => (
                      <span key={tag} className="label">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    aria-hidden
                    className="text-ink-faint transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-mark"
                  >
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
