export default function Hero() {
  return (
    <section id="hero" className="relative h-[280vh]">
      <div className="sticky top-0 h-screen">
        <div
          className="absolute left-1/2 top-[63%] w-full max-w-[36rem] px-7 text-center"
          style={{ opacity: "var(--copy-in)", transform: "translate(-50%, var(--copy-y))" }}
        >
          <p className="text-[1.0625rem] leading-[1.75] text-ink-soft">
            Engineer by training, doodler by habit. I build things that work and draw
            things that don&apos;t have to — and I&apos;ve never been convinced those
            are different skills.
          </p>

          <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-5">
            <a className="btn btn-solid" href="/resume.pdf">
              Resume
            </a>
            <a className="btn" href="#contact">
              Contact me
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-9 left-1/2 -translate-x-1/2"
          style={{ opacity: "var(--hint)" }}
        >
          <span className="label">scroll</span>
        </div>
      </div>
    </section>
  );
}
