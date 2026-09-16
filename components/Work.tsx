"use client";

import { useState } from "react";
import PlusMark from "./PlusMark";
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
    note: "Developed a high-throughput, low-latency data processing microservice in Rust for a real-time sensor analysis system from architecture to validation and deployment.",
    points: [
      "The system lacked a way to process a key category of incoming sensor data in real-time, creating a gap in its analysis pipeline.",
      "Designed and built a multi-threaded microservice in Rust from scratch to perform thousands of time-sensitive calculations per second on incoming data.",
      "Architected a gRPC API to integrate the service with the broader analysis system, and implemented the algorithm that combined its output with live data to generate real-time assessments.",
      "Validated the system using an in-house simulator generating synthetic data, confirming reliable performance under high volumes of data.",
    ],
  },
  {
    id: "formula",
    span: "2025 — 2026",
    kind: "work",
    role: "Embedded Software Engineer",
    org: "UW Formula Motorsports — Firmware Team",
    where: "Seattle, WA",
    note: "Engineered realtime, safety-critical firmware for the battery management system",
    points: [
      "Migrating the LVBMS PCB from the LTC6813 to the ADBMS6830 required a complete firmware rewrite to support the new analog cell monitoring IC",
      "Designed low-level SPI drivers in C++ to configure voltage, temperature, current monitoring, and passive balancing on the ADBMS, and to transmit telemetry over CAN via the MCP2515 transceiver.",
      "Implemented RTOS tasks to poll the ADBMS and MCP2515 concurrently, and to detect faults in real-time",
      "Performed hardware in the loop testing with a seven-cell Li-ion pack, cross-checking voltage and temperature readings against a voltmeter and ground-truth sensors, verifying CAN communication, and injecting faults to confirm the protection logic fired.",
    ],
  },
  {
    id: "nedl",
    span: "2025",
    kind: "work",
    role: "AI Engineering Intern",
    org: "Nēdl Labs — Data Extraction Harness",
    where: "Remote",
    note: "Designed an AI agent harness to extract structured data from unstructured health insurance policy text to mitigate malformed extractions by 100%.",
    points: [
      "All health insurance policy documents are public, but unstructured, and the company needed to aggregate it all in a structured data format.",
      "Designed an LLM powered pipeline to extract structured data from insurance company websites, PDFs, and other unstructured text sources.",
      "Benchmarked multiple LLMs and prompt strategies to find the most accurate and cost-effective solution for extracting structured data from unstructured text.",
      "Integrated LangChain and Pydantic to strictly enforce JSON schema validation, eliminating malformed outputs by 100%.",
    ],
  },
  {
    id: "tamu",
    span: "2024",
    kind: "work",
    role: "Research Intern",
    org: "Texas A&M University — Independent Research Project",
    where: "Remote",
    note: "Built and tested rover localization and pathfinding software that uses a monocular depth-estimation model to replace satellite powered DEM data, enabling navigation in GPS-denied environments.",
    points: [
      "Existing rover localization and pathfinding algorithms rely on satellite-generated digital elevation maps but many extraplanetary environments lack satellite coverage.",
      "Benchmarked monocular depth-estimation models from Hugging Face with the KITTI dataset on a Jetson Orin Nano GPU, and selected the DepthAnything ViT for the rover localization algorithm.",
      "Conducted a literature survey of existing cost based pathfinding algorithms and developed obstacle/elevation scoring algorithms to determine traversable areas.",
      "Accelerated image-to-map conversion by running PyTorch depth inference on a Jetson Orin Nano GPU with CUDA.",
    ],
  },
  {
    id: "uw",
    span: "2025 — 2028",
    kind: "education",
    role: "B.S. Computer Science",
    org: "University of Washington",
    where: "Seattle, WA",
    note: "Paul G. Allen School of Computer Science & Engineering. GPA 3.94.",
    points: [
      "Relevant coursework: Discrete Mathematics; Linear Algebra; Computer Architecture and Hardware-Software Systems; Probability, Statistics & Machine Learning Foundations.",
    ],
  },
];

export default function Work() {
  // The opening entry is expanded on arrival so the section never reads as a
  // wall of shut rows; opening another closes whatever was open.
  const [open, setOpen] = useState<string | null>(TIMELINE[0].id);

  return (
    <section
      id="work"
      className="relative z-10 min-h-[130vh] pt-[34vh] pb-[16vh]"
    >
      <div className="gutter">
        <ol className="mt-5 max-w-[52rem]">
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
                        <span className="label block text-mark">
                          {item.span}
                        </span>
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
                            className="entry-point text-[0.9rem] leading-[1.75] text-ink-soft"
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
