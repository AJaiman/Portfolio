"use client";

import { useState } from "react";
import Reveal from "./Reveal";

type Entry = {
  id: string;
  span: string;
  kind: "work" | "education";
  role: string;
  org: string;
  where: string;
  note: string;
  points: string[];
};

const TIMELINE: Entry[] = [
  {
    id: "lockheed",
    span: "2026 — Present",
    kind: "work",
    role: "Software Engineering Intern",
    org: "Lockheed Martin — Rotary and Mission Systems, Command IQ",
    where: "Colorado Springs, CO",
    note: "Rust microservices for the Command IQ product line, shipped on Kubernetes.",
    points: [
      "Built REST and gRPC APIs in Rust for microservices that derive and serve protobuf data models for the Command IQ product line.",
      "Developed and deployed services from scratch on Kubernetes using Helm across Unix-based environments, working through configuration and deployment issues in the team's CI/CD pipeline.",
      "Wrote unit tests for every code change and ran integration testing of the core threat evaluation system against a custom in-house simulator, validating end-to-end behavior before release.",
      "Extended a core threat evaluation microservice consumed by five downstream services, working with backend and systems engineers to integrate it into the deployed Command IQ product.",
    ],
  },
  {
    id: "formula",
    span: "2025 — 2026",
    kind: "work",
    role: "Embedded Software Engineer",
    org: "UW Formula Motorsports — Battery Management System firmware",
    where: "Seattle, WA",
    note: "Battery management firmware on an RP2040: SPI drivers, FreeRTOS, cell balancing.",
    points: [
      "Wrote low-level SPI drivers in C++ on an RP2040 straight from datasheet specs to talk to an ADBMS6830 analog front end and an MCP2515 CAN controller, configuring and triggering onboard ADC conversions to read per-cell voltages and GPIO-connected thermistor circuits for temperature.",
      "Engineered real-time voltage, temperature, and current monitoring across seven cells, using FreeRTOS task scheduling to run hardware polling and fault detection concurrently without race conditions over shared SPI and CAN peripherals — guarding against thermal runaway and over/under-voltage.",
      "Developed a passive cell balancing algorithm that holds voltage deltas within 10 mV, extending pack lifespan.",
      "Validated the firmware with hardware-in-the-loop testing on a bench rig: cross-checking voltage and temperature readings against a voltmeter and ground-truth sensors, verifying CAN communication, and injecting faults to confirm the detection logic fired.",
    ],
  },
  {
    id: "nedl",
    span: "2025",
    kind: "work",
    role: "AI Engineering Intern",
    org: "Nēdl Labs — Health policy data extraction",
    where: "Remote",
    note: "An LLM pipeline turning unstructured insurance policy text into structured JSON.",
    points: [
      "Architected a modular Python pipeline that turns unstructured health insurance policy text into structured JSON using large language models, saving $10K in costs.",
      "Integrated LangChain and Pydantic to enforce JSON schema validation, eliminating malformed outputs.",
      "Designed a two-stage compression pipeline that has the model distill long policy documents down to their key information before the main extraction prompt runs — clearing the context-length limits that had kept smaller models from handling files of 50+ pages.",
    ],
  },
  {
    id: "tamu",
    span: "2024",
    kind: "work",
    role: "Research Intern",
    org: "Texas A&M University — AI-powered pathfinding",
    where: "Remote",
    note: "Rover localization and pathfinding from one onboard camera instead of satellite data.",
    points: [
      "Researched and implemented a novel extraterrestrial rover localization method in Python that swaps satellite data for a Hugging Face monocular depth-estimation model and an onboard camera, with no loss in pathfinding accuracy.",
      "Adapted cost calculation functions from the satellite-based pathfinding algorithm and applied A* search to point cloud data generated with Open3D, separating traversable from untraversable zones with 95% accuracy.",
      "Accelerated image-to-map conversion by running PyTorch depth inference on a Jetson Orin Nano GPU with CUDA.",
    ],
  },
  {
    id: "uw",
    span: "2024 — 2027",
    kind: "education",
    role: "B.S. Computer Science",
    org: "University of Washington — Paul G. Allen School",
    where: "Seattle, WA",
    note: "Paul G. Allen School of Computer Science & Engineering. GPA 3.94.",
    points: [
      "Relevant coursework: Discrete Mathematics; Linear Algebra; Computer Architecture and Hardware-Software Systems; Probability, Statistics & Machine Learning Foundations.",
      "Hold an active Secret security clearance.",
    ],
  },
];

/** Drawn rather than set in a font, so it keeps the double-stroke the rest of
 *  the page uses: a committed line with the searching one showing under it. */
function PlusMark({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`plus-mark ${open ? "is-open" : ""}`}
      aria-hidden
    >
      <g className="plus-ghost">
        <path d="M3.5 10.4C7.1 9.9 13.1 10.1 16.7 10.2" />
        <path d="M10.3 3.5C9.9 7.1 10 13.1 10.2 16.7" />
      </g>
      <g className="plus-ink">
        <path d="M3 10C6.6 9.5 12.6 9.7 16.2 9.8" />
        <path d="M9.9 3.1C9.5 6.7 9.6 12.7 9.8 16.3" />
      </g>
    </svg>
  );
}

export default function Work() {
  // The opening entry is expanded on arrival so the section never reads as a
  // wall of shut rows; opening another closes whatever was open.
  const [open, setOpen] = useState<string | null>(TIMELINE[0].id);

  return (
    <section id="work" className="relative z-10 min-h-[130vh] pt-[34vh] pb-[16vh]">
      <div className="gutter">
        <Reveal>
          <p className="max-w-[34rem] text-[1.0625rem] leading-[1.75] text-ink-soft">
            Where I&apos;ve been, most recent first. Open one to read the
            details.
          </p>
        </Reveal>

        <ol className="mt-16 max-w-[52rem]">
          {TIMELINE.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <Reveal key={item.id} delay={i * 90}>
                <li className="group relative border-t border-ink/12">
                  <span
                    className={`absolute -left-[4.5px] top-[-4.5px] h-[9px] w-[9px] rounded-full border border-mark transition-colors duration-300 ${
                      isOpen ? "bg-mark" : "bg-paper group-hover:bg-mark"
                    }`}
                    aria-hidden
                  />

                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`entry-${item.id}`}
                      className="grid w-full cursor-pointer grid-cols-[1fr_auto] items-start gap-x-7 gap-y-4 py-9 text-left sm:grid-cols-[8.5rem_1fr_auto] sm:gap-y-2"
                    >
                      {/* Narrow screens stack the dates above the entry; at sm
                          they step out into their own left-hand column. */}
                      <span className="col-start-1 row-start-1 sm:pt-1">
                        <span className="label block text-mark">{item.span}</span>
                        <span className="label mt-1.5 block">{item.kind}</span>
                      </span>

                      <span className="col-start-1 row-start-2 block sm:col-start-2 sm:row-start-1">
                        <span className="block text-[1.3rem] leading-snug text-ink">
                          {item.role}
                        </span>
                        <span className="mt-1 block text-[0.95rem] text-ink-faint">
                          {item.org} · {item.where}
                        </span>
                        <span className="mt-3 block max-w-[34rem] text-[0.975rem] leading-[1.7] text-ink-soft">
                          {item.note}
                        </span>
                      </span>

                      <span className="col-start-2 row-start-1 row-span-2 sm:col-start-3 sm:row-span-1">
                        <PlusMark open={isOpen} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`entry-${item.id}`}
                    role="region"
                    className={`expando ${isOpen ? "is-open" : ""}`}
                  >
                    <div>
                      <ul className="max-w-[36rem] pb-9 sm:ml-[10.25rem]">
                        {item.points.map((point) => (
                          <li
                            key={point}
                            className="entry-point text-[0.975rem] leading-[1.7] text-ink-soft"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
