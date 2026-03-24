import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import iotProject from "../../Assets/Projects/iot_project.png";
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
          {/* 1. ScanSafe iOS */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={scansafeApp}
              isBlog={false}
              title="ScanSafe iOS — QR Phishing Detector"
              description="Developing an on-device iOS application that detects QR code phishing threats in real time using heuristic URL analysis — no cloud dependency or pretrained models. Built with Swift, SwiftUI, AVFoundation, OpenCV 4.13, and Apple Vision. Features an 18-rule URL risk scoring engine and a dual-layer Findings UI with plain-English explanations and expandable technical detail."
              ghLink="https://github.com/pat-selby/scansafe-ios"
            />
          </Col>

          {/* 2. ScanSafe Android */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={scansafeApp}
              isBlog={false}
              title="ScanSafe Android — QR Phishing Detector"
              description="Original Android version of ScanSafe, an on-device app detecting QR code phishing in real time using heuristic URL analysis — no cloud dependency or pretrained models."
              ghLink="https://github.com/pat-selby/scansafe"
            />
          </Col>

          {/* 3. IT Risk Assessment */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={riskAssessment}
              isBlog={false}
              title="IT Risk Assessment & Data Classification Lab"
              description="Conducted an IT risk assessment by inventorying organizational assets, classifying sensitive data, and scoring risks using likelihood and impact analysis. Developed a formal data classification standard to define handling requirements. Translated technical risk findings into leadership-ready documentation."
              ghLink="https://github.com/pat-selby/bayoucare-risk-classification-lab"
            />
          </Col>

          {/* 4. Linux Security Monitoring */}
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={incidentResponse}
              isBlog={false}
              title="Linux Security Monitoring & Incident Response"
              description="Configured auditd watch rules and used ausearch to trace file modification events to specific processes on a Linux system. Documented chain-of-custody log evidence and delivered a root cause analysis with 3 preventative control recommendations."
              ghLink="https://github.com/pat-selby/pineridge-incident-response-lab"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
