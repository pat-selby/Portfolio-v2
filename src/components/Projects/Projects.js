import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import riskAssessment from "../../Assets/Projects/risk_assessment.png";
import incidentResponse from "../../Assets/Projects/incident_response.png";
import scansafeApp from "../../Assets/Projects/scansafe_app.png";

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
          {/* 1. ScanSafe */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={scansafeApp}
              isBlog={false}
              title="ScanSafe — On-Device QR Phishing Detection"
              description="Eliminated cloud dependency and false-negative risk by engineering an on-device 18-rule heuristic URL analysis engine that detects QR phishing in real time without pretrained models."
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
              description="Prioritized 5+ security controls across a simulated multi-department organization by inventorying assets, classifying data sensitivity tiers, and conducting likelihood-impact analysis."
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
              description="Delivered root cause analysis with 3 actionable control recommendations by configuring auditd watch rules, tracing file modification events to specific processes via ausearch, and documenting chain-of-custody evidence."
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
