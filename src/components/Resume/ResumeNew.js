import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import pdf from "../../Assets/resume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import {
  FaUserShield, FaAward, FaTerminal, FaShieldAlt,
  FaSearch, FaNetworkWired, FaCode, FaCloud,
  FaUserGraduate, FaBriefcase, FaBug, FaLock,
  FaServer, FaCube
} from "react-icons/fa";
import "./Resume.css";
import SplineResume from "./SplineResume";

function ResumeNew() {
  const [viewMode, setViewMode] = useState("3d");
  const [activeJob, setActiveJob] = useState("aiot");
  const [activeSkill, setActiveSkill] = useState("nmap");
  const [terminalHistory, setTerminalHistory] = useState([
    { text: "Patrick's Security Console — ready.", type: "system" },
    { text: "All systems operational. Select a command below.", type: "success" },
  ]);

  const executeCommand = (cmd) => {
    let output = [];
    if (cmd === "nmap") {
      output = [
        { text: "$ nmap -sV -p 80,443,1883 scan-target.gsu.edu", type: "prompt" },
        { text: "Host is up. Scanning ports...", type: "line" },
        { text: "80/tcp   open  http    nginx 1.25.1", type: "line" },
        { text: "443/tcp  open  https   nginx (encrypted, verified)", type: "success" },
        { text: "1883/tcp open  mqtt    authenticated broker", type: "success" },
        { text: "Scan complete. 1 host up, no open vulnerabilities found.", type: "success" }
      ];
    } else if (cmd === "coursework") {
      output = [
        { text: "$ cat education.txt", type: "prompt" },
        { text: "Degree: B.S. Cybersecurity (Minor: CIS)", type: "line" },
        { text: "GPA: 3.83 / 4.0", type: "success" },
        { text: "Courses: Attacks & Vulnerabilities, Data Structures, Discrete Math, Stats, Calc I", type: "line" },
      ];
    } else if (cmd === "scansafe") {
      output = [
        { text: "$ grep ALERT /var/log/scansafe/engine.log", type: "prompt" },
        { text: "[ALERT] Phishing link detected behind Microsoft SafeLinks redirect.", type: "line" },
        { text: "[BLOCK] ScanSafe intercepted the URL before the user was exposed.", type: "success" },
        { text: "Zero cloud calls made. Detection happened fully on-device.", type: "success" }
      ];
    } else if (cmd === "auditd") {
      output = [
        { text: "$ ausearch -k file_changes", type: "prompt" },
        { text: "Suspicious write detected: root process modified /etc/passwd", type: "line" },
        { text: "[RESOLVED] Event traced, documented, root cause identified.", type: "success" },
        { text: "3 security control recommendations submitted.", type: "success" }
      ];
    }
    setTerminalHistory((prev) => [...prev, ...output]);
  };

  const jobs = {
    aiot: {
      title: "Research Assistant — Mobile Security",
      company: "Grambling State University · AIoT Lab",
      date: "Spring 2026 – Present",
      status: "Active",
      tools: "Android Studio, Python, Git",
      bullets: [
        "I built ScanSafe — an Android app that catches phishing links hidden in QR codes, entirely on-device with no internet needed.",
        "I wrote all 18 detection rules myself, including one inspired by a real phishing attack that targeted my school.",
        "I redesigned the app's results screen so both regular users and technical reviewers can understand it clearly."
      ]
    },
    codepath: {
      title: "Cybersecurity Fellow",
      company: "CodePath · Certificate with Honors",
      date: "Feb 2026 – May 2026",
      status: "Honors",
      tools: "Wireshark, Splunk, Linux, Python",
      bullets: [
        "I completed 7 hands-on security labs — tracking suspicious traffic, investigating system logs, and responding to simulated incidents.",
        "I led my team's final presentation, walking a technical audience through a full incident response from detection to resolution."
      ]
    },
    extern: {
      title: "IoT Security Extern",
      company: "Hydroficient (via Extern) · Remote",
      date: "Feb 2026 – Mar 2026",
      status: "Completed",
      tools: "Python, OpenSSL, Wireshark, Linux",
      bullets: [
        "I designed a secure communication pipeline for connected devices — verifying identity, protecting messages in transit, and detecting unusual behavior.",
        "I built three layers of protection against replay attacks, where an attacker tries to reuse old messages to trick the system."
      ]
    }
  };

  const skills = {
    nmap: { name: "Nmap", level: 90, category: "Scanning", desc: "I use Nmap to map networks, check open ports, and find services that might be exposed or misconfigured.", power: "Find what's exposed" },
    wireshark: { name: "Wireshark", level: 88, category: "Forensics", desc: "I capture and read network traffic to find suspicious activity, unauthorized connections, or data being sent in the clear.", power: "Read the wire" },
    auditd: { name: "Linux auditd", level: 85, category: "Monitoring", desc: "I configure Linux's audit system to track who changed what, when — essential for incident investigations.", power: "Track every change" },
    splunk: { name: "Splunk", level: 80, category: "Log Analysis", desc: "I search and correlate security logs across systems to spot patterns, build alerts, and piece together what happened during an incident.", power: "Find the story in logs" },
    mqtt: { name: "Secure Messaging (MQTT/TLS)", level: 92, category: "Protocols", desc: "I set up encrypted, authenticated communication channels for IoT devices — so only verified devices can send and receive data.", power: "Encrypt the channel" },
    hmac: { name: "Message Authentication", level: 86, category: "Cryptography", desc: "I use cryptographic signing to make sure messages haven't been tampered with between sender and receiver.", power: "Prove it wasn't changed" },
    python: { name: "Python", level: 94, category: "Programming", desc: "My go-to language for building security tools, automating repetitive tasks, and scripting detection logic.", power: "Build anything fast" },
    sql: { name: "SQL", level: 82, category: "Programming", desc: "I write queries to retrieve and analyze data securely, and I know how to protect databases from injection attacks.", power: "Query safely" },
    aws: { name: "AWS Cloud", level: 78, category: "Cloud", desc: "I know how to set up cloud environments securely — controlling who has access, what they can do, and where traffic flows.", power: "Secure the cloud" },
    stride: { name: "Threat Modeling", level: 88, category: "Risk Analysis", desc: "I analyze systems before they're built (or breached) to find where things could go wrong and how to prevent it.", power: "Prevent before it happens" }
  };

  if (viewMode === "3d") {
    return <SplineResume toggleMode={() => setViewMode("2d")} />;
  }

  return (
    <div>
      <Container fluid className="resume-section cyber-container">

        {/* Header */}
        <Row style={{ justifyContent: "center", marginBottom: "30px" }}>
          <Col md={10} style={{ textAlign: "center" }}>
            <h1 className="project-heading" style={{ fontSize: "2.3rem" }}>
              My <strong className="purple">Resume</strong>
            </h1>
            <p style={{ color: "white" }}>
              An interactive look at my background — experience, skills, and certifications.
            </p>
            <Button
              variant="outline-success"
              onClick={() => setViewMode("3d")}
              style={{ marginTop: "10px", marginBottom: "20px", borderColor: "#10b981", color: "#10b981", fontWeight: "bold" }}
            >
              <FaCube /> &nbsp; Switch to 3D View
            </Button>
          </Col>
        </Row>

        {/* Row 1: Experience */}
        <Row className="justify-content-center">
          <Col md={12}>
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaBriefcase /> Experience</h3>
                <span style={{ fontSize: "0.8rem", color: "#10b981", fontFamily: "monospace" }}>3 roles</span>
              </div>
              <Row>
                <Col lg={3} md={12}>
                  <div className="quest-list">
                    {[
                      { key: "aiot", title: "Research Assistant", sub: "GSU AIoT Lab", badge: "Active", cls: "status-active" },
                      { key: "codepath", title: "Cybersecurity Fellow", sub: "CodePath", badge: "Honors", cls: "status-completed" },
                      { key: "extern", title: "IoT Security Extern", sub: "Hydroficient", badge: "Done", cls: "status-completed" },
                    ].map(({ key, title, sub, badge, cls }) => (
                      <div key={key} className={`quest-item ${activeJob === key ? "active" : ""}`} onClick={() => setActiveJob(key)}>
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{title}</div>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{sub}</div>
                        </div>
                        <div className="quest-meta">
                          <span className={`quest-status ${cls}`}>{badge}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col lg={9} md={12}>
                  <div className="quest-details">
                    <h4 className="purple" style={{ fontSize: "1.15rem", fontWeight: "bold" }}>{jobs[activeJob].title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>{jobs[activeJob].company}</p>
                    <p style={{ fontSize: "0.78rem", color: "#10b981", fontStyle: "italic", marginBottom: "14px" }}>{jobs[activeJob].date}</p>
                    <ul style={{ fontSize: "0.88rem", color: "#e2e8f0", paddingLeft: "18px" }}>
                      {jobs[activeJob].bullets.map((b, i) => (
                        <li key={i} style={{ marginBottom: "10px", lineHeight: "1.6" }}>{b}</li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#10b981" }}>Tools I used: </span>
                      <span style={{ fontSize: "0.82rem", color: "#ffffff", fontFamily: "monospace" }}>{jobs[activeJob].tools}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Row 2: Skills */}
        <Row className="justify-content-center">
          <Col md={12}>
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaShieldAlt /> Skills</h3>
                <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>Select a skill to see what I can do with it</span>
              </div>
              <Row>
                <Col lg={7} md={12} style={{ marginBottom: "15px" }}>
                  <div className="inventory-grid">
                    {[
                      ["nmap", <FaSearch />, "Nmap"],
                      ["wireshark", <FaBug />, "Wireshark"],
                      ["auditd", <FaTerminal />, "Linux Audit"],
                      ["splunk", <FaServer />, "Splunk"],
                      ["mqtt", <FaNetworkWired />, "Secure Messaging"],
                      ["hmac", <FaLock />, "Cryptography"],
                      ["python", <FaCode />, "Python"],
                      ["sql", <FaServer />, "SQL"],
                      ["aws", <FaCloud />, "AWS Cloud"],
                      ["stride", <FaShieldAlt />, "Threat Modeling"],
                    ].map(([key, icon, label]) => (
                      <div key={key} className={`inventory-slot ${activeSkill === key ? "active" : ""}`} onClick={() => setActiveSkill(key)}>
                        {React.cloneElement(icon, { className: "inventory-icon" })}
                        <span className="inventory-name">{label}</span>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col lg={5} md={12}>
                  <div className="inventory-desc-panel d-flex flex-column justify-content-center">
                    <h4 className="purple" style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "8px" }}>{skills[activeSkill].name}</h4>
                    <span style={{ fontSize: "0.75rem", background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", padding: "2px 8px", borderRadius: "4px", alignSelf: "flex-start", marginBottom: "12px", textTransform: "uppercase", fontWeight: "bold" }}>
                      {skills[activeSkill].category}
                    </span>
                    <p style={{ fontSize: "0.88rem", color: "#e2e8f0", lineHeight: "1.6", minHeight: "70px" }}>{skills[activeSkill].desc}</p>
                    <div style={{ marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold", marginBottom: "6px" }}>Proficiency:</span>
                      <div className="d-flex align-items-center gap-3">
                        <div className="stat-bar-container" style={{ flex: 1, marginTop: 0 }}>
                          <div className="stat-bar-fill mp-bar" style={{ width: `${skills[activeSkill].level}%` }}></div>
                        </div>
                        <span style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "#38bdf8", fontWeight: "bold" }}>{skills[activeSkill].level}%</span>
                      </div>
                    </div>
                    <div style={{ marginTop: "12px", fontStyle: "italic", fontSize: "0.8rem", color: "#10b981" }}>{skills[activeSkill].power}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Row 3: Certifications */}
        <Row className="justify-content-center">
          <Col md={12}>
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaAward /> Certifications</h3>
              </div>
              <div className="achievement-list">
                {[
                  ["CompTIA Security+", "In Progress — SY0-701"],
                  ["CodePath CYB102", "Certificate of Achievement · Honors"],
                  ["AWS Cloud Foundations", "AWS Academy (2025)"],
                  ["Google Cybersecurity", "Foundations & Risk Mitigation"],
                  ["IBM SkillsBuild", "AI, Security & Data"],
                  ["IOBSE 2026", "Black Security Executives Cohort"],
                ].map(([title, sub]) => (
                  <div key={title} className="badge-card">
                    <div className="badge-icon-glow"><FaAward /></div>
                    <div className="badge-details">
                      <div className="badge-title">{title}</div>
                      <div className="badge-subtitle">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Row 4: Profile + Interactive Terminal */}
        <Row className="justify-content-center">
          <Col lg={5} md={12}>
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaUserShield /> Profile</h3>
              </div>
              <Row>
                <Col xs={4} style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="badge-icon-glow" style={{ width: "70px", height: "70px", fontSize: "2rem", margin: "0 auto" }}>
                    <FaUserGraduate />
                  </div>
                  <span className="purple" style={{ fontWeight: "bold", fontSize: "0.9rem", marginTop: "10px" }}>Patrick Selby</span>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>GSU · Class of 2028</span>
                </Col>
                <Col xs={8}>
                  <div className="char-info-row">
                    <div className="char-label">Degree</div>
                    <div className="char-value">B.S. Cybersecurity</div>
                  </div>
                  <div className="char-info-row">
                    <div className="char-label">Minor</div>
                    <div className="char-value">Computer Info Systems</div>
                  </div>
                  <div className="char-info-row">
                    <div className="char-label">GPA</div>
                    <div className="char-value">3.83 / 4.0</div>
                    <div className="stat-bar-container">
                      <div className="stat-bar-fill xp-bar" style={{ width: "95.75%" }}></div>
                    </div>
                  </div>
                  <div className="char-info-row">
                    <div className="char-label">Integrity</div>
                    <div className="char-value">100 / 100</div>
                    <div className="stat-bar-container">
                      <div className="stat-bar-fill hp-bar" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={7} md={12}>
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaTerminal /> Interactive Terminal</h3>
                <span style={{ color: "#34d399", fontSize: "0.85rem", fontFamily: "monospace" }}>Try a command</span>
              </div>
              <div className="terminal-screen" id="console-screen">
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className={`terminal-line ${item.type === "error" ? "text-danger" : item.type === "success" ? "text-success" : item.type === "prompt" ? "terminal-prompt" : ""}`}>
                    {item.text}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "15px" }}>
                <span style={{ color: "#cbd5e1", display: "block", fontSize: "0.75rem", marginBottom: "8px", fontWeight: "bold", textTransform: "uppercase" }}>Run a command:</span>
                <button className="terminal-btn" onClick={() => executeCommand("nmap")}>Scan Network</button>
                <button className="terminal-btn" onClick={() => executeCommand("coursework")}>View Education</button>
                <button className="terminal-btn" onClick={() => executeCommand("scansafe")}>ScanSafe Demo</button>
                <button className="terminal-btn" onClick={() => executeCommand("auditd")}>Log Investigation</button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Download */}
        <Row className="justify-content-center" style={{ marginTop: "20px" }}>
          <Col md={6} style={{ textAlign: "center" }}>
            <div className="cyber-panel" style={{ borderStyle: "dashed" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "15px" }}>Download My Resume (PDF)</h4>
              <Button variant="primary" href={pdf} target="_blank" style={{ maxWidth: "280px" }}>
                <AiOutlineDownload />&nbsp;Download Resume
              </Button>
            </div>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default ResumeNew;
