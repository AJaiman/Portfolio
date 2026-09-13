import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Figure from "@/components/Figure";
import Reveal from "@/components/Reveal";
import { getProject, PROJECTS } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getProject(slug);
  if (!found) return {};
  return {
    title: `${found.project.name} — Arav Jaiman`,
    description: found.project.blurb,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const found = getProject(slug);
  if (!found) notFound();

  const { project, index, next } = found;

  return (
    <main className="relative z-10 pt-[12vh] pb-[14vh]">
      <div className="gutter">
        <Link
          href="/#projects"
          className="label link-underline inline-block hover:text-ink"
        >
          ← Projects
        </Link>

        <Reveal>
          <header className="mt-14 max-w-[46rem]">
            <p className="label">
              <span className="text-mark">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-3 text-ink-faint/50">/</span>
              {project.year}
            </p>

            <h1 className="mt-6 text-[clamp(2rem,6vw,3.4rem)] leading-[1.1] tracking-tight text-ink">
              {project.name}
            </h1>

            <p className="mt-7 text-[1.125rem] leading-[1.7] text-ink-soft">
              {project.summary}
            </p>

            {project.links.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-5">
                {project.links.map((link, i) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn ${i === 0 ? "btn-solid" : ""}`}
                  >
                    {link.label}
                    <span aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            )}
          </header>
        </Reveal>

        {project.cover && (
          <Reveal delay={80}>
            <div className="mt-20 max-w-[62rem]">
              <Figure media={project.cover} />
            </div>
          </Reveal>
        )}

        {(project.facts.length > 0 || project.stack.length > 0) && (
          <Reveal delay={80}>
            <dl className="mt-20 grid max-w-[62rem] grid-cols-2 gap-x-10 gap-y-9 border-t border-ink/12 pt-10 sm:grid-cols-4">
              {project.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="label">{fact.label}</dt>
                  <dd className="mt-2 text-[1.0625rem] text-ink">{fact.value}</dd>
                </div>
              ))}
              {project.stack.length > 0 && (
                <div className="col-span-2 sm:col-span-1">
                  <dt className="label">Built with</dt>
                  <dd className="mt-2 text-[1.0625rem] leading-[1.6] text-ink">
                    {project.stack.join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        )}

        {project.sections.map((section, i) => (
          <Reveal key={section.heading} delay={i === 0 ? 0 : 60}>
            <section className="mt-24 max-w-[62rem]">
              <h2 className="text-[1.5rem] leading-snug text-ink">{section.heading}</h2>

              <div className="mt-5 max-w-[34rem] space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-[1.0625rem] leading-[1.75] text-ink-soft">
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.media && section.media.length > 0 && (
                <div
                  className={`mt-12 grid gap-8 ${
                    section.media.length > 1 ? "sm:grid-cols-2" : ""
                  }`}
                >
                  {section.media.map((media) => (
                    <Figure key={media.src} media={media} />
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        ))}

        <nav className="mt-28 flex flex-wrap items-end justify-between gap-8 border-t border-ink/12 pt-10">
          <Link href="/#projects" className="label link-underline hover:text-ink">
            ← All projects
          </Link>

          {next.slug !== project.slug && (
            <Link href={`/projects/${next.slug}`} className="group text-right">
              <span className="label block">Next</span>
              <span className="link-underline mt-2 inline-block text-[1.25rem] text-ink">
                {next.name} →
              </span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
