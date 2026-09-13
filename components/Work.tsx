import Reveal from "./Reveal";

const TIMELINE = [
  {
    span: "2026",
    kind: "work",
    role: "Software Engineering Intern",
    org: "Company",
    note: "Placeholder — swap in what you actually did, in one plain sentence.",
  },
  {
    span: "2025",
    kind: "work",
    role: "Undergraduate Researcher",
    org: "Lab or group",
    note: "Placeholder — the problem you were poking at and what came of it.",
  },
  {
    span: "2024 — 2027",
    kind: "education",
    role: "B.S. Computer Science",
    org: "University",
    note: "Placeholder — coursework, focus, anything you'd actually want read.",
  },
];

export default function Work() {
  return (
    <section id="work" className="relative z-10 min-h-[130vh] pt-[42vh] pb-[16vh]">
      <div className="gutter">
        <Reveal>
          <p className="max-w-[34rem] text-[1.0625rem] leading-[1.75] text-ink-soft">
            Where I&apos;ve been, most recent first.
          </p>
        </Reveal>

        <ol className="mt-16 max-w-[52rem]">
          {TIMELINE.map((item, i) => (
            <Reveal key={item.role} delay={i * 90}>
              <li className="group relative grid grid-cols-[auto_1fr] gap-x-7 gap-y-2 border-t border-ink/12 py-9 sm:grid-cols-[8.5rem_1fr]">
                <span
                  className="absolute -left-[4.5px] top-[-4.5px] h-[9px] w-[9px] rounded-full border border-mark bg-paper transition-colors duration-300 group-hover:bg-mark"
                  aria-hidden
                />
                <div className="pt-1">
                  <span className="label block text-mark">{item.span}</span>
                  <span className="label mt-1.5 block">{item.kind}</span>
                </div>
                <div>
                  <h3 className="text-[1.3rem] leading-snug text-ink">{item.role}</h3>
                  <p className="mt-1 text-[0.95rem] text-ink-faint">{item.org}</p>
                  <p className="mt-3 max-w-[34rem] text-[0.975rem] leading-[1.7] text-ink-soft">
                    {item.note}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
