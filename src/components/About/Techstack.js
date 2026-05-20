import React from "react";
import { Col, Row } from "react-bootstrap";
// import { SiNextdotjs, SiSolidity } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { SiLinux, SiWireshark, SiPython, SiGit, SiMysql } from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {/* Programming & Standard Tools */}
      <Col xs={4} md={2} className="tech-icons">
        <SiLinux fontSize={"50px"} />
        <div className="tech-icons-text">Linux CLI</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiPython fontSize={"50px"} />
        <div className="tech-icons-text">Python</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiWireshark fontSize={"50px"} />
        <div className="tech-icons-text">Wireshark</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiMysql fontSize={"50px"} />
        <div className="tech-icons-text">SQL</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiGit fontSize={"50px"} />
        <div className="tech-icons-text">Git/GitHub</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <FaAws fontSize={"50px"} />
        <div className="tech-icons-text">AWS Cloud</div>
      </Col>

      {/* Cyber Security Skills */}
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Nmap</div>
        <div className="tech-icons-text">Scanning</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>Vulnerability</div>
        <div className="tech-icons-text">Assessment</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>auditd/ausearch</div>
        <div className="tech-icons-text">Linux Audit</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Splunk</div>
        <div className="tech-icons-text">SIEM & Forensics</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>Threat Modeling</div>
        <div className="tech-icons-text">STRIDE / Risk</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>MQTT</div>
        <div className="tech-icons-text">IoT Messaging</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>TLS/mTLS</div>
        <div className="tech-icons-text">Device Auth</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>HMAC & Crypto</div>
        <div className="tech-icons-text">PKI Keys</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>STEEP Analysis</div>
        <div className="tech-icons-text">Research</div>
      </Col>
    </Row>
  );
}

export default Techstack;
