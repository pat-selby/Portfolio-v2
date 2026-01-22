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
              <span className="hover-glow">I am a </span><b className="purple hover-glow">Cybersecurity Undergraduate</b><span className="hover-glow"> at Grambling State University (3.9 GPA).</span>
              <br />
              <br />
              <span className="hover-glow">I am seeking hands-on exposure to </span>
              <i>
                <b className="purple hover-glow"> security operations, risk analysis, </b>
              </i>
              <span className="hover-reveal">and </span>
              <i>
                <b className="purple hover-glow"> defensive security practices.</b>
              </i>
              <br />
              <br />
              <span className="hover-glow">My technical expertise includes </span><b className="purple hover-glow">Linux CLI, Network Fundamentals,</b><span className="hover-glow"> and tools like </span><b className="purple hover-glow">Nmap and Wireshark</b>.
              <br />
              <br />
              <span className="hover-glow">Whenever possible, I apply my skills in </span><b className="purple hover-glow">Python</b><span className="hover-reveal"> and </span><b className="purple hover-glow">AWS (EC2, S3, IAM)</b><span className="hover-glow"> to build and secure cloud infrastructure.</span>
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
