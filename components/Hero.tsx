export default function Hero() {
  return (
    <section id="hero" className="relative h-[280vh]">
      <div className="sticky top-0 h-screen">
        <div
          className="absolute left-1/2 top-[63%] w-full max-w-[36rem] px-7 text-center"
          style={{
            opacity: "var(--copy-in)",
            transform: "translate(-50%, var(--copy-y))",
          }}
        >
          <p className="text-[1.0625rem] leading-[1.75] text-ink-soft">
            Hi, I&apos;m a computer science student at the University of
            Washington. I love writing code for physical platforms, things I can
            touch and can affect the real world. I consider myself a creative
            who loves to bring things off the page and into real life.
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
