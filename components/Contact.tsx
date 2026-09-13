import Reveal from "./Reveal";

const EMAIL = "aravjaiman1@gmail.com";

const SOCIALS = [
  { label: "GitHub", handle: "@aravjaiman", href: "https://github.com/aravjaiman" },
  { label: "LinkedIn", handle: "in/aravjaiman", href: "https://linkedin.com/in/aravjaiman" },
  { label: "X", handle: "@aravjaiman", href: "https://x.com/aravjaiman" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 min-h-[105vh] pt-[42vh] pb-[14vh]">
      <div className="gutter">
        <Reveal>
          <p className="max-w-[34rem] text-[1.0625rem] leading-[1.75] text-ink-soft">
            Open to internships, collaborations, and anyone who wants to argue about
            pencils.
          </p>
        </Reveal>

        <Reveal delay={90}>
          <a
            href={`mailto:${EMAIL}`}
            className="link-underline mt-14 inline-block text-[clamp(1.5rem,5vw,2.75rem)] leading-tight text-ink"
          >
            {EMAIL}
          </a>
        </Reveal>

        <Reveal delay={160}>
          <ul className="mt-16 flex flex-wrap gap-x-14 gap-y-8 border-t border-ink/12 pt-10">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <span className="label block">{social.label}</span>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline mt-2 inline-block text-[1.0625rem] text-ink-soft"
                >
                  {social.handle}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={220}>
          <p className="label mt-24">Drawn and built by hand — Arav Jaiman</p>
        </Reveal>
      </div>
    </section>
  );
}
