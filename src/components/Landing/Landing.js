import React from "react";
import Hero from "./Hero";
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";
import SandboxSection from "./SandboxSection";
import ContactSection from "./ContactSection";
import ViewChooser from "./ViewChooser";
import useView from "./useView";

function Landing() {
  const { key } = useView();

  // No view chosen yet: ask first, then show the matching site.
  if (!key) return <ViewChooser />;

  return (
    // Keyed by view so every section starts fresh when the visitor switches.
    <main key={key}>
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SandboxSection />
      <ContactSection />
    </main>
  );
}

export default Landing;
