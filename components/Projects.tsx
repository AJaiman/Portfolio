"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/projects";
import Reveal from "./Reveal";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function Projects() {
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      const vh = window.innerHeight;
      cards.current.forEach((el, i) => {
        if (!el) return;
        if (calm) {
          el.style.opacity = "1";
          el.style.transform = "none";
          return;
        }
        // Rises as its own top crosses the fold, so the pair in each row lift
        // together and the second column trails the first by a beat.
        const top = el.getBoundingClientRect().top + (i % 2) * 46;
        const p = clamp01((vh - top) / (vh * 0.44));
        const eased = 1 - Math.pow(1 - p, 3);
        el.style.opacity = eased.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - eased) * 96).toFixed(1)}px, 0)`;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

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
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              ref={(el) => {
                cards.current[i] = el;
              }}
              style={{ opacity: 0, transform: "translate3d(0, 96px, 0)" }}
              className="sketch group flex h-full flex-col p-8"
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
          ))}
        </div>
      </div>
    </section>
  );
}
