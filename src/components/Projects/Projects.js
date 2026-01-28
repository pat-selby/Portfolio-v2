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
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={awsProject}
              isBlog={false}
              title="IT Risk Assessment & Data Classification Lab"
              description="Conducted an IT risk assessment by inventorying organizational assets, classifying sensitive data, and scoring risks using likelihood and impact analysis. Developed a formal data classification standard to define handling requirements. Translated technical risk findings into leadership-ready documentation."
              ghLink="https://github.com/pat-selby/bayoucare-risk-classification-lab"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
