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
                                    <h3 className="purple">IoT Cyber Defense Extern (Simulated)</h3>
                                    <h5 style={{ color: "white" }}>Extern / Hydroficient — Remote</h5>
                                    <p style={{ color: "#a5bda5", fontStyle: "italic" }}>Jan 2026 – Mar 2026</p>
                                    <ul style={{ color: "white", textAlign: "left" }}>
                                        <li>Mapped an end-to-end IoT water monitoring system by analyzing simulated sensor telemetry, control commands, and cloud data flows.</li>
                                        <li>Evaluated IoT security risks by reviewing encryption in transit, device authentication, and access-control mechanisms.</li>
                                        <li>Documented mitigation strategies for simulated IoT threat scenarios.</li>
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
