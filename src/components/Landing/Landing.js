import React from "react";
import Hero from "./Hero";
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";
import SandboxSection from "./SandboxSection";
import SideQuests from "./SideQuests";
import ContactSection from "./ContactSection";

function Landing() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SandboxSection />
      <SideQuests />
      <ContactSection />
    </main>
  );
}

export default Landing;
