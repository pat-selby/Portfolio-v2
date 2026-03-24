import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import myImg from "../../Assets/avatar.svg";
// import myImg from "../../Assets/cyber_avatar.png";
import myImg from "../../Assets/intro_avatar.png";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              <span className="hover-reveal">LET ME </span><span className="purple hover-glow"> INTRODUCE </span><span className="hover-reveal"> MYSELF</span>
            </h1>
            <p className="home-about-body">
              <span className="hover-glow">I am a </span><b className="purple hover-glow">Cybersecurity Sophomore</b><span className="hover-glow"> at Grambling State University with a 3.9 GPA, conducting NSF-funded research in Dr. Vasanth Iyer's AIoT Lab.</span>
              <br />
              <br />
              <span className="hover-glow">I am building </span>
              <i>
                <b className="purple hover-glow">ScanSafe</b>
              </i>
              <span className="hover-reveal"> — an on-device app that detects QR code phishing in real time using </span>
              <i>
                <b className="purple hover-glow">heuristic URL analysis</b>
              </i>
              <span className="hover-glow">, with no cloud dependency or pretrained models.</span>
              <br />
              <br />
              <span className="hover-glow">My technical skills include </span><b className="purple hover-glow">Linux CLI, Python, Threat Modeling,</b><span className="hover-glow"> and IoT security protocols including </span><b className="purple hover-glow">TLS, mTLS, and HMAC</b>.
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
