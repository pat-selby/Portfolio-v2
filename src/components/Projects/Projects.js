import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import iotProject from "../../Assets/Projects/iot_project.png";
import awsProject from "../../Assets/Projects/aws_project.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          <span className="hover-reveal">My Recent </span><strong className="purple hover-glow">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          <span className="hover-reveal">Here are a few projects I've worked on recently.</span>
        </p>
        <Col md={4} className="project-card">
          <ProjectCard
            imgPath={iotProject}
            isBlog={false}
            title="IoT Cyber Defense Extern (Simulated)"
            description="Mapped an end-to-end IoT water monitoring system by analyzing simulated sensor telemetry, control commands, and cloud data flows. Evaluated IoT security risks by reviewing encryption in transit, device authentication, and access-control mechanisms. Documented mitigation strategies for simulated IoT threat scenarios."
            ghLink="https://github.com/pat-selby"
          />
        </Col>

        <Col md={4} className="project-card">
          <ProjectCard
            imgPath={awsProject}
            isBlog={false}
            title="IT Risk Assessment & Data Classification Lab"
            description="Conducted an IT risk assessment by inventorying organizational assets, classifying sensitive data, and scoring risks using likelihood and impact analysis. Developed a formal data classification standard to define handling requirements. Translated technical risk findings into leadership-ready documentation."
            ghLink="https://github.com/pat-selby/bayoucare-risk-classification-lab"
          />
        </Col>

        <Col md={4} className="project-card">
          <ProjectCard
            imgPath={awsProject}
            isBlog={false}
            title="Incident Response & Evidence Documentation Lab"
            description="Simulated an incident response workflow by detecting failed authentication attempts, preserving authentication log evidence, and documenting response actions. Analyzed Linux authentication logs to extract failed login events. Performed a post-incident review to identify root causes and preventative controls."
            ghLink="https://github.com/pat-selby/pineridge-incident-response-lab"
          />
        </Col>
      </Container>
    </Container>
  );
}

export default Projects;
