import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import riskAssessment from "../../Assets/Projects/risk_assessment.png";
import incidentResponse from "../../Assets/Projects/incident_response.png";
import scansafeApp from "../../Assets/Projects/scansafe_app.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Container>
        <h1 className="project-heading">
          <span className="hover-reveal">My Recent </span><strong className="purple hover-glow">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          <span className="hover-reveal">Here are a few things I've built.</span>
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {/* 1. ScanSafe */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={scansafeApp}
              isBlog={false}
              title="ScanSafe — On-Device QR Phishing Detection"
              description="I built this Android app to catch phishing links hidden in QR codes — entirely on your phone, no internet needed. I designed all 18 detection rules myself."
              ghLink="https://github.com/pat-selby/scansafe"
              demoLink="/demos?tab=scansafe"
            />
          </Col>

          {/* 2. IT Risk Assessment */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={riskAssessment}
              isBlog={false}
              title="IT Risk Assessment & Data Classification"
              description="I mapped out a fictional company's digital assets, ranked their risks, and recommended the security controls most worth their time and money."
              ghLink="https://github.com/pat-selby/bayoucare-risk-classification-lab"
              demoLink="/demos?tab=risk"
            />
          </Col>

          {/* 3. Linux Security Monitoring */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={incidentResponse}
              isBlog={false}
              title="Linux Security Monitoring & Incident Response"
              description="I investigated a simulated security incident on Linux — tracing every file change, identifying the culprit process, and writing up exactly how to prevent it next time."
              ghLink="https://github.com/pat-selby/pineridge-incident-response-lab"
              demoLink="/demos?tab=splunk"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
