import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import InkStage from "@/components/InkStage";
import Projects from "@/components/Projects";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <InkStage />
      <main>
        <Hero />
        <Work />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
