import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import iotExternship from "../../Assets/iot_externship.png";

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
                    {/* New Research Assistant Entry */}
                    <Col md={12} className="project-card" style={{ paddingBottom: "20px" }}>
                        <div className="project-card-view" style={{ textAlign: "left", padding: "20px", background: "transparent", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <Row>
                                <Col md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ padding: "20px", textAlign: "center", color: "#10b981", border: "2px dashed #10b981", borderRadius: "10px", width: "100%" }}>
                                        <h2>AIoT Lab</h2>
                                        <p>Grambling State</p>
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <h3 className="purple">Research Assistant — Mobile Security & Applied Computing</h3>
                                    <h5 style={{ color: "white" }}>Grambling State University · AIoT Lab, Dr. Vasanth Iyer — Grambling, LA</h5>
                                    <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Spring 2026 – Present</p>
                                    <ul style={{ color: "white", textAlign: "left" }}>
                                        <li>Developing ScanSafe, an on-device app using heuristic URL analysis to detect QR code phishing threats in real time — no cloud dependency or pretrained models.</li>
                                        <li>Expanded URL risk scoring engine from 12 to 18 detection rules; Rule 13 directly motivated by a real GSU-targeted phishing email impersonating Microsoft Office 365 via SafeLinks wrapping.</li>
                                        <li>Redesigned Findings UI with dual-layer disclosure: plain-English summaries for general users, expandable technical detail for advanced users.</li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    {/* Updated Externship Entry */}
                    <Col md={12} className="project-card">
                        <div className="project-card-view" style={{ textAlign: "left", padding: "20px", background: "transparent", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <Row>
                                <Col md={4}>
                                    <img
                                        src={iotExternship}
                                        alt="IoT Externship"
                                        className="img-fluid"
                                        style={{ maxHeight: "250px", borderRadius: "10px", width: "100%", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col md={8}>
                                    <h3 className="purple">IoT Cyber Defense Extern</h3>
                                    <h5 style={{ color: "white" }}>Extern / Hydroficient — Remote</h5>
                                    <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Jan 2026 – Present</p>
                                    <ul style={{ color: "white", textAlign: "left" }}>
                                        <li>Completing a structured IoT security externship covering the full security lifecycle of a live water monitoring system — from threat modeling through hardened deployment.</li>
                                        <li>Coursework includes: STRIDE-based threat modeling across sensor, broker, and subscriber layers; TLS encryption and mutual TLS (mTLS) device authentication on an MQTT pipeline; 3-layer replay defense using timestamp validation, sequence counters, and HMAC signing; and real-time anomaly detection using Isolation Forest.</li>
                                    </ul>
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
