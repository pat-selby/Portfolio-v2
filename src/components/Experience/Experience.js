import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import iotExternship from "../../Assets/iot_externship.png";
import aiotLab from "../../Assets/aiot_lab.png";
import codepathLogo from "../../Assets/codepath_logo.png";

function Experience() {
  return (
    <Container fluid className="project-section">
      <Container>
        <h1 className="project-heading">
          My <strong className="purple">Experience</strong>
        </h1>
        <p style={{ color: "white" }}>
          Here's where I've put my skills to work.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>

          {/* Research Assistant */}
          <Col md={12} className="project-card" style={{ paddingBottom: "20px" }}>
            <div className="project-card-view" style={{ textAlign: "left", padding: "20px" }}>
              <Row>
                <Col md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={aiotLab} alt="AIoT Lab" className="img-fluid"
                    style={{ maxHeight: "250px", borderRadius: "10px", width: "100%", objectFit: "cover" }} />
                </Col>
                <Col md={8}>
                  <h3 className="purple">Research Assistant — Mobile Security</h3>
                  <h5 style={{ color: "white" }}>Grambling State University · AIoT Lab — Grambling, LA</h5>
                  <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Spring 2026 – Present</p>
                  <ul style={{ color: "white", textAlign: "left" }}>
                    <li>I built <strong>ScanSafe</strong> — an Android app that detects phishing links hidden in QR codes, entirely on the phone, no internet needed. I designed all 18 detection rules myself.</li>
                    <li>One of those rules came directly from a real phishing attack targeting my school. I spotted it, understood it, and wrote a fix for it.</li>
                    <li>I also redesigned the results screen so both everyday users and technical reviewers can read it clearly.</li>
                  </ul>
                  <p style={{ color: "#10b981", fontWeight: "bold" }}>Tools: <span style={{ color: "white", fontWeight: "normal" }}>Android Studio, Python, Git</span></p>
                </Col>
              </Row>
            </div>
          </Col>

          {/* CodePath Fellow */}
          <Col md={12} className="project-card" style={{ paddingBottom: "20px" }}>
            <div className="project-card-view" style={{ textAlign: "left", padding: "20px" }}>
              <Row>
                <Col md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={codepathLogo} alt="CodePath" className="img-fluid"
                    style={{ maxHeight: "250px", borderRadius: "10px", width: "100%", objectFit: "cover" }} />
                </Col>
                <Col md={8}>
                  <h3 className="purple">Cybersecurity Fellow</h3>
                  <h5 style={{ color: "white" }}>CodePath — Remote · Certificate with Honors</h5>
                  <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Feb 2026 – May 2026</p>
                  <ul style={{ color: "white", textAlign: "left" }}>
                    <li>I completed 7 hands-on security labs — tracking suspicious network traffic, investigating system logs, responding to simulated incidents, and hunting for signs of real breaches.</li>
                    <li>I led my team's capstone presentation, walking a technical audience through how we identified, contained, and documented a security incident from start to finish.</li>
                  </ul>
                  <p style={{ color: "#10b981", fontWeight: "bold" }}>Tools: <span style={{ color: "white", fontWeight: "normal" }}>Wireshark, Splunk, Linux, Python, VirusTotal</span></p>
                </Col>
              </Row>
            </div>
          </Col>

          {/* IoT Extern */}
          <Col md={12} className="project-card">
            <div className="project-card-view" style={{ textAlign: "left", padding: "20px" }}>
              <Row>
                <Col md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={iotExternship} alt="IoT Externship" className="img-fluid"
                    style={{ maxHeight: "250px", borderRadius: "10px", width: "100%", objectFit: "cover" }} />
                </Col>
                <Col md={8}>
                  <h3 className="purple">IoT Security Extern</h3>
                  <h5 style={{ color: "white" }}>Hydroficient (via Extern) — Remote · Certificate of Completion</h5>
                  <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Feb 2026 – Mar 2026</p>
                  <ul style={{ color: "white", textAlign: "left" }}>
                    <li>I designed a secure communication pipeline for connected devices — covering how devices verify each other's identity, how messages stay tamper-proof in transit, and how the system flags unusual behavior automatically.</li>
                    <li>I also built in three layers of protection against replay attacks, where an attacker tries to reuse old messages to trick the system.</li>
                  </ul>
                  <p style={{ color: "#10b981", fontWeight: "bold" }}>Tools: <span style={{ color: "white", fontWeight: "normal" }}>Python, Wireshark, OpenSSL, Linux</span></p>
                </Col>
              </Row>
            </div>
          </Col>

        </Row>
      </Container>
    </Container>
  );
}

export default Experience;
