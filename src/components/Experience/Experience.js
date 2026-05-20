import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import iotExternship from "../../Assets/iot_externship.png";
import aiotLab from "../../Assets/aiot_lab.png";
import codepathLogo from "../../Assets/Projects/incident_response.png";

function Experience() {
    return (
        <Container fluid className="project-section">
            <Particle />
            <Container>
                <h1 className="project-heading">
                    Professional <strong className="purple">Experience </strong>
                </h1>
                <p style={{ color: "white" }}>
                    Here is my recent professional experience.
                </p>

                <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
                    {/* Research Assistant Entry */}
                    <Col md={12} className="project-card" style={{ paddingBottom: "20px" }}>
                        <div className="project-card-view" style={{ textAlign: "left", padding: "20px", background: "transparent", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <Row>
                                <Col md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img
                                        src={aiotLab}
                                        alt="AIoT Lab"
                                        className="img-fluid"
                                        style={{ maxHeight: "250px", borderRadius: "10px", width: "100%", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col md={8}>
                                    <h3 className="purple">Research Assistant — Mobile Security & Applied Computing</h3>
                                    <h5 style={{ color: "white" }}>Grambling State University · AIoT Lab, Dr. Vasanth Iyer — Grambling, LA</h5>
                                    <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Mar 2026 – May 2026</p>
                                    <ul style={{ color: "white", textAlign: "left" }}>
                                        <li>Reduced QR phishing exposure to zero cloud dependency by building ScanSafe, an on-device Android app using an 18-rule heuristic URL analysis engine with no pretrained models.</li>
                                        <li>Improved phishing detection coverage by 50% by expanding URL risk engine from 12 to 18 rules; Rule 13 directly motivated by a live GSU-targeted attack impersonating Microsoft Office 365 via SafeLinks wrapping.</li>
                                    </ul>
                                    <p style={{ color: "#10b981", fontWeight: "bold" }}>Utilized: <span style={{ color: "white", fontWeight: "normal" }}>Android Studio, Python, Git, GitHub</span></p>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    {/* CodePath Fellow Entry (NEW) */}
                    <Col md={12} className="project-card" style={{ paddingBottom: "20px" }}>
                        <div className="project-card-view" style={{ textAlign: "left", padding: "20px", background: "transparent", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <Row>
                                <Col md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img
                                        src={codepathLogo}
                                        alt="CodePath Logo"
                                        className="img-fluid"
                                        style={{ maxHeight: "250px", borderRadius: "10px", width: "100%", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col md={8}>
                                    <h3 className="purple">Intermediate Cybersecurity Fellow</h3>
                                    <h5 style={{ color: "white" }}>CodePath — Remote (Certificate of Achievement with Honors · ID: 397157)</h5>
                                    <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Feb 2026 – May 2026</p>
                                    <ul style={{ color: "white", textAlign: "left" }}>
                                        <li>Completed 7 hands-on security labs covering Wireshark/SMTP forensics, Linux auditd monitoring, FTP directory traversal, DoS/Slowloris mitigation, Splunk SIEM analysis, CSIRT incident response, and SolarWinds IOC threat hunting.</li>
                                        <li>Led capstone team through full incident response lifecycle — dataset analysis, playbook selection, IOC identification, and live Demo Day presentation to a technical audience.</li>
                                    </ul>
                                    <p style={{ color: "#10b981", fontWeight: "bold" }}>Utilized: <span style={{ color: "white", fontWeight: "normal" }}>Wireshark, auditd, Splunk, nginx, VirusTotal, Catalyst, Linux CLI, Python</span></p>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    {/* Updated Externship Entry */}
                    <Col md={12} className="project-card">
                        <div className="project-card-view" style={{ textAlign: "left", padding: "20px", background: "transparent", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <Row>
                                <Col md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img
                                        src={iotExternship}
                                        alt="IoT Externship"
                                        className="img-fluid"
                                        style={{ maxHeight: "250px", borderRadius: "10px", width: "100%", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col md={8}>
                                    <h3 className="purple">IoT Cyber Defense Extern</h3>
                                    <h5 style={{ color: "white" }}>Hydroficient (via Extern) — Remote (Certificate of Completion)</h5>
                                    <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Feb 2026 – Mar 2026</p>
                                    <ul style={{ color: "white", textAlign: "left" }}>
                                        <li>Built end-to-end IoT security pipeline covering STRIDE threat modeling, TLS/mTLS device authentication on MQTT, 3-layer replay defense (timestamps, sequence counters, HMAC), and Isolation Forest anomaly detection.</li>
                                    </ul>
                                    <p style={{ color: "#10b981", fontWeight: "bold" }}>Utilized: <span style={{ color: "white", fontWeight: "normal" }}>Python, MQTT, OpenSSL, Wireshark, Linux CLI</span></p>
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
