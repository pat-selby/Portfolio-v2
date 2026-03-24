import React from "react";
import { Col, Row } from "react-bootstrap";
// import { SiNextdotjs, SiSolidity } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { SiLinux, SiWireshark, SiPython, SiDocker, SiGit, SiMysql } from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
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
        <div className="tech-icons-text">Git</div>
      </Col>

      {/* Network & Security Skills (Text Based) */}
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Nmap</div>
        <div className="tech-icons-text">Scanning</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>Incident Response</div>
        <div className="tech-icons-text">Basic</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>Threat Modeling</div>
        <div className="tech-icons-text">Analysis</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>IoT Device Security</div>
        <div className="tech-icons-text">Protocols</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>MQTT</div>
        <div className="tech-icons-text">Messaging</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>TLS/mTLS</div>
        <div className="tech-icons-text">Security</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>HMAC</div>
        <div className="tech-icons-text">Auth</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>PKI Crypto</div>
        <div className="tech-icons-text">Keys</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>auditd/ausearch</div>
        <div className="tech-icons-text">Linux Audit</div>
      </Col>
    </Row>
  );
}

export default Techstack;
