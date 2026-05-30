import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/intro_avatar.jpg";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              <span className="hover-reveal">LET ME </span>
              <span className="purple hover-glow"> INTRODUCE </span>
              <span className="hover-reveal"> MYSELF</span>
            </h1>
            <p className="home-about-body">
              I'm a <b className="purple">Cybersecurity Sophomore</b> at Grambling State University — originally from <b className="purple">Ghana</b> — carrying a 3.83 GPA and a genuine obsession with building things that protect people.
              <br /><br />
              Right now, I'm doing research in the <b className="purple">AIoT Lab</b> where I built <i><b className="purple">ScanSafe</b></i> — an Android app that catches QR phishing attacks entirely on-device, no cloud, no pretrained models, just 18 rules I designed from scratch (including one I wrote after a real attack targeted my school).
              <br /><br />
              My focus is <b className="purple">threat modeling, system monitoring,</b> and building secure communication for connected devices. I don't just learn security — I build it.
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
