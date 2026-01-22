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
              imgPath={iotProject}
              isBlog={false}
              title="IoT Cyber Defense"
              description="Simulated critical infrastructure environment to analyze and mitigate IoT risks. Built mock IoT sensors generating realistic telemetry and a data pipeline transmitting sensor data via MQTT. Identified risks across devices and implemented TLS encryption and device authentication."
              ghLink="https://github.com/pat-selby"
            // demoLink=""
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={awsProject}
              isBlog={false}
              title="AWS Incident Response Lab"
              description="Investigated a simulated cloud security incident by reviewing 100+ CloudTrail log events using JQ. Identified a publicly exposed S3 bucket and misused IAM credentials. Reduced investigation time by correlating API activity and implemented remediation actions."
              ghLink="https://github.com/pat-selby"
            // demoLink=""
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
