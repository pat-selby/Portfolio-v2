import React from "react";
import { Col, Row } from "react-bootstrap";
import { SiUbuntu, SiKalilinux, SiOpenai, SiAndroidstudio, SiGithub } from "react-icons/si";
import vsCode from "../../Assets/TechIcons/vscode.svg";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <SiUbuntu fontSize={"50px"} />
        <div className="tech-icons-text">Ubuntu</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiKalilinux fontSize={"50px"} />
        <div className="tech-icons-text">Kali Linux</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiAndroidstudio fontSize={"50px"} />
        <div className="tech-icons-text">Android Studio</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <img src={vsCode} alt="VS Code" style={{ height: "50px", width: "50px", objectFit: "contain" }} />
        <div className="tech-icons-text">VS Code</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiGithub fontSize={"50px"} />
        <div className="tech-icons-text">GitHub</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiOpenai fontSize={"50px"} />
        <div className="tech-icons-text">AI-Assisted Dev</div>
      </Col>
    </Row>
  );
}

export default Toolstack;
