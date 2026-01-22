import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import Tilt from "react-parallax-tilt";
// import laptopImg from "../../Assets/about.png";
// import laptopImg from "../../Assets/about_cyber.png";
import laptopImg from "../../Assets/about_avatar.png";
import Toolstack from "./Toolstack";

function About() {
  return (
    <>
      {" "}
      <Particle />
      <Container fluid className="about-section">
        <Container>
          <Row style={{ justifyContent: "center", padding: "10px" }}>
            <Col
              md={7}
              style={{
                justifyContent: "center",
                paddingTop: "30px",
                paddingBottom: "50px",
              }}
            >
              <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
                <span className="hover-reveal">Know Who </span><strong className="purple hover-glow">I AM</strong>
              </h1>
              <Aboutcard />
            </Col>
            <Col
              md={5}
              style={{ paddingTop: "120px", paddingBottom: "50px" }}
              className="about-img"
            >
              <Tilt>
                <img src={laptopImg} alt="about" className="img-fluid" />
              </Tilt>
            </Col>
          </Row>
          <h1 className="project-heading">
            <span className="hover-reveal">Professional </span><strong className="purple hover-glow">Skillset </strong>
          </h1>

          <Techstack />

          <h1 className="project-heading">
            <strong className="purple hover-glow">Tools</strong> <span className="hover-reveal">I use</span>
          </h1>
          <Toolstack />

          <Github />
        </Container>
      </Container>
    </>
  );
}

export default About;
