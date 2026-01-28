import React from "react";
import { Col, Row } from "react-bootstrap";
// import macOs from "../../Assets/TechIcons/Apple MacOSX.svg";
import chrome from "../../Assets/TechIcons/Google Chrome.svg";
import { SiUbuntu, SiKalilinux, SiOpenai, SiGoogle, SiCodesandbox } from "react-icons/si";

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
      <Col xs={4} md={2} className="tech-icons ">
        <img src={chrome} alt="Chrome" className="tech-icon-images" />
        <div className="tech-icons-text">Google Chrome</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons ">
        <img src={vsCode} alt="vsCode" className="tech-icon-images" />
        <div className="tech-icons-text">Vs Code</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons ">
        <SiOpenai fontSize={"50px"} />
        <div className="tech-icons-text">AI Tools (Gemini/ChatGPT)</div>
      </Col>
    </Row>
  );
}

export default Toolstack;
