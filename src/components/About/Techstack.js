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
        <FaAws fontSize={"50px"} />
        <div className="tech-icons-text">AWS (IAM, EC2, S3)</div>
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
      <Col xs={4} md={2} className="tech-icons">
        <SiDocker fontSize={"50px"} />
        <div className="tech-icons-text">Docker</div>
      </Col>
      {/* Added generic Nmap manually if icon not found, or just text */}
      <Col xs={4} md={2} className="tech-icons">
        <div style={{ fontSize: "2em", fontWeight: "bold" }}>Nmap</div>
        <div className="tech-icons-text">Network Scanning</div>
      </Col>
    </Row>
  );
}

export default Techstack;
