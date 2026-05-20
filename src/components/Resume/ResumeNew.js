import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/resume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import {
  FaUserShield,
  FaAward,
  FaTerminal,
  FaShieldAlt,
  FaSearch,
  FaNetworkWired,
  FaCode,
  FaCloud,
  FaUserGraduate,
  FaClipboardList,
  FaBug,
  FaLock,
  FaServer
} from "react-icons/fa";
import "./Resume.css";

function ResumeNew() {
  const [activeQuest, setActiveQuest] = useState("aiot");
  const [activeSkill, setActiveSkill] = useState("nmap");
  const [terminalHistory, setTerminalHistory] = useState([
    { text: "Welcome to Patrick's Cyber Security Console [v2.28].", type: "system" },
    { text: "Status: ALL SYSTEMS OPERATIONAL. Security protocols: ENFORCED.", type: "success" },
    { text: "Ready for scan. Select a module below to initiate diagnostic commands...", type: "system" }
  ]);

  // Terminal commands mock executor
  const executeCommand = (cmd) => {
    let output = [];
    if (cmd === "nmap") {
      output = [
        { text: "$ nmap -sV -p 80,443,1883 scan-target.gsu.edu", type: "prompt" },
        { text: "Starting Nmap 9.00 ( https://nmap.org ) at 2026-05-20 03:52 EST", type: "line" },
        { text: "Nmap scan report for scan-target.gsu.edu (147.124.22.8)", type: "line" },
        { text: "Host is up (0.045s latency).", type: "line" },
        { text: "PORT     STATE SERVICE VERSION", type: "line" },
        { text: "80/tcp   open  http    nginx 1.25.1", type: "line" },
        { text: "443/tcp  open  https   nginx (TLS v1.3 / mTLS broker)", type: "success" },
        { text: "1883/tcp open  mqtt    Eclipse Mosquitto (authenticated)", type: "success" },
        { text: "Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel", type: "line" },
        { text: "Nmap done: 1 IP address (1 host up) scanned in 1.45 seconds.", type: "success" }
      ];
    } else if (cmd === "coursework") {
      output = [
        { text: "$ cat /home/pselby/education/coursework.db", type: "prompt" },
        { text: "{", type: "line" },
        { text: "  \"Major\": \"B.S. Cybersecurity\",", type: "line" },
        { text: "  \"GPA\": \"3.83/4.0\",", type: "success" },
        { text: "  \"GSU_Core\": [\"Attacks, Threats & Vulnerabilities (Sec+ SY0-701)\", \"Discrete Structures\", \"Data Structures & Algorithms\"],", type: "line" },
        { text: "  \"Math_Foundations\": [\"Calculus I\", \"Probability & Statistics\"],", type: "line" },
        { text: "  \" CIS_Minor\": \"Computer Information Systems\"", type: "line" },
        { text: "}", type: "line" }
      ];
    } else if (cmd === "scansafe") {
      output = [
        { text: "$ grep -rn \"CRITICAL\" /var/log/scansafe/URLRiskEngine.log", type: "prompt" },
        { text: "URLRiskEngine.log:104:[2026-05-18 10:14:02] ALERT - Rule 13 triggered (SafeLinks wrapping detected).", type: "line" },
        { text: "URLRiskEngine.log:105:[2026-05-18 10:14:02] TARGET - Microsoft Office 365 impersonation page.", type: "line" },
        { text: "URLRiskEngine.log:106:[2026-05-18 10:14:03] CRITICAL - 18-rule Heuristics flagged phishing attempt.", type: "error" },
        { text: "URLRiskEngine.log:107:[2026-05-18 10:14:03] ACTION - Phishing URL intercepted. ScanSafe blocked execution.", type: "success" },
        { text: "ScanSafe Analysis Engine status: Zero cloud dependencies, 0ms latency local lookup completed.", type: "success" }
      ];
    } else if (cmd === "auditd") {
      output = [
        { text: "$ ausearch -k config_changes -m SYSCALL", type: "prompt" },
        { text: "----", type: "line" },
        { text: "time->Mon Feb 23 14:24:51 2026", type: "line" },
        { text: "type=PROCTITLE msg=audit(1771874691.102:451): proctitle=6E616E6F202F6574632F706173737764", type: "line" },
        { text: "type=SYSCALL msg=audit(1771874691.102:451): arch=c000003e syscall=2 success=yes exit=3 a0=7ffd588... items=1 ppid=1204 pid=1310 auid=1000 uid=0 gid=0 euid=0", type: "line" },
        { text: "auditd_trace: [RESOLVED] Root user edited sensitive system file via nano. Log integrity checked.", type: "success" },
        { text: "Splunk correlation: Event indexed. Threat hunt resolved 3 actionable control recommendations.", type: "success" }
      ];
    }
    setTerminalHistory((prev) => [...prev, ...output]);
  };

  // Quests Data
  const quests = {
    aiot: {
      title: "Mobile Security Research Assistant",
      company: "Grambling State University · AIoT Lab",
      date: "Mar 2026 – May 2026",
      status: "Active Research",
      rewards: "Android Studio, Python, Git, Heuristic Analysis",
      description: [
        "Reduced QR phishing exposure to zero cloud dependency by engineering ScanSafe, an on-device Android application.",
        "Created an 18-rule heuristic URL analysis engine operating with no pretrained AI models.",
        "Increased phishing detection coverage by 50% through Rule 13, directly responding to a live GSU-targeted credential harvesting campaign impersonating Microsoft Office 365 via SafeLinks wrapping."
      ]
    },
    codepath: {
      title: "Intermediate Cybersecurity Fellow",
      company: "CodePath",
      date: "Feb 2026 – May 2026",
      status: "Completed (Honors)",
      rewards: "Splunk, Wireshark, auditd, Forensics, Incident Response",
      description: [
        "Completed 7 hands-on security labs including Wireshark/SMTP forensics, FTP directory traversal mitigation, auditd monitoring, Splunk SIEM log correlation, CSIRT incident response, and SolarWinds IOC threat hunting.",
        "Led a capstone security analyst team through the full incident response lifecycle: dataset analysis, playbook selection, IOC identification, and live presentation on Demo Day to a technical audience."
      ]
    },
    extern: {
      title: "IoT Cyber Defense Extern",
      company: "Hydroficient (via Extern)",
      date: "Feb 2026 – Mar 2026",
      status: "Completed (Certificate)",
      rewards: "mTLS, MQTT, OpenSSL, STRIDE Modeling, Python",
      description: [
        "Constructed a secure end-to-end IoT pipeline covering STRIDE threat modeling, TLS/mTLS client-broker authentication on MQTT.",
        "Architected a 3-layer replay defense (sequence counters, timestamp checks, HMAC-SHA256 signing).",
        "Configured an Isolation Forest machine learning model for real-time anomaly detection in device telemetry."
      ]
    }
  };

  // Skills Data for Inventory
  const skills = {
    nmap: {
      name: "Nmap Scanning",
      level: 90,
      category: "Cybersecurity",
      desc: "Used to audit network ports, enumerate services, and detect vulnerabilities on hosts.",
      power: "Damage: Enumerate & Map"
    },
    wireshark: {
      name: "Wireshark",
      level: 88,
      category: "Forensics",
      desc: "Capturing packets and performing forensic analysis to trace malicious payloads or unauthorized protocols.",
      power: "Analysis: Decrypt & Audit"
    },
    auditd: {
      name: "auditd & ausearch",
      level: 85,
      category: "Forensics",
      desc: "Linux kernel auditing daemon used to monitor system calls, file integrity violations, and root process anomalies.",
      power: "Defense: Trace root events"
    },
    splunk: {
      name: "Splunk SIEM",
      level: 80,
      category: "Forensics",
      desc: "Correlating security events, writing search queries, indexing logs, and building incident alert dashboards.",
      power: "Search: Log Correlation"
    },
    mqtt: {
      name: "MQTT & TLS/mTLS",
      level: 92,
      category: "Protocols",
      desc: "Lightweight pub/sub messaging secured with client/server certificate handshakes for device identity and transport privacy.",
      power: "Protocol: Safe IoT Pipeline"
    },
    hmac: {
      name: "HMAC & Cryptography",
      level: 86,
      category: "Protocols",
      desc: "Implementing secure hashing (SHA256) combined with secret keys for message integrity and anti-tamper sequence codes.",
      power: "Defense: Integrity verification"
    },
    python: {
      name: "Python Coding",
      level: 94,
      category: "Programming",
      desc: "Scripting custom security tools, automations, heuristic analysis scripts, and machine learning telemetry models.",
      power: "Weapon: Rapid Automation"
    },
    sql: {
      name: "SQL Database",
      level: 82,
      category: "Programming",
      desc: "Writing structured queries for data retrieval, logging security parameters, and securing against injection attacks.",
      power: "Database: Safe data storage"
    },
    aws: {
      name: "AWS Cloud Foundations",
      level: 78,
      category: "Cloud",
      desc: "Configuring Virtual Private Clouds (VPC), Security Groups, IAM Roles, and deploying instances inside AWS securely.",
      power: "Cloud: Hardened infrastructure"
    },
    stride: {
      name: "STRIDE Modeling",
      level: 88,
      category: "Research",
      desc: "Analyzing architectures for Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, and Elevation of privilege.",
      power: "Methodology: Threat Prevention"
    }
  };

  return (
    <div>
      <Container fluid className="resume-section cyber-container">
        <Particle />

        <Row style={{ justifyContent: "center", marginBottom: "30px" }}>
          <Col md={10} style={{ textAlign: "center" }}>
            <h1 className="project-heading" style={{ fontSize: "2.3rem" }}>
              Cybersecurity Specialist <strong className="purple">Quest Log</strong>
            </h1>
            <p style={{ color: "white" }}>
              Explore my professional world through this interactive console. Level up your understanding of my background.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {/* Column 1: Character Stats & Terminal Diagnostics */}
          <Col lg={5} md={12}>
            {/* Player Stats Panel */}
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaUserShield /> Character Sheet</h3>
                <span style={{ fontSize: "0.8rem", color: "#10b981", fontFamily: "monospace" }}>SEC_STATUS: SECURE</span>
              </div>
              <Row>
                <Col xs={4} style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="badge-icon-glow" style={{ width: "70px", height: "70px", fontSize: "2rem", margin: "0 auto" }}>
                    <FaUserGraduate />
                  </div>
                  <span className="purple" style={{ fontWeight: "bold", fontSize: "0.9rem", marginTop: "10px" }}>Patrick Selby</span>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>GSU-CS-2028</span>
                </Col>
                <Col xs={8}>
                  <div className="char-info-row">
                    <div className="char-label">Class</div>
                    <div className="char-value">Cybersecurity Specialist (Sophomore)</div>
                  </div>
                  <div className="char-info-row">
                    <div className="char-label">Academic XP (GPA)</div>
                    <div className="char-value">3.83 / 4.0</div>
                    <div className="stat-bar-container">
                      <div className="stat-bar-fill xp-bar" style={{ width: "95.75%" }}></div>
                    </div>
                  </div>
                  <div className="char-info-row">
                    <div className="char-label">Security Integrity (HP)</div>
                    <div className="char-value">100 / 100</div>
                    <div className="stat-bar-container">
                      <div className="stat-bar-fill hp-bar" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Diagnostic Terminal Panel */}
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaTerminal /> Diagnostics Terminal</h3>
                <span style={{ color: "#34d399", fontSize: "0.85rem", fontFamily: "monospace" }}>PORT: 22</span>
              </div>
              <div className="terminal-screen" id="console-screen">
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className={`terminal-line ${item.type === 'error' ? 'text-danger' : item.type === 'success' ? 'text-success' : item.type === 'prompt' ? 'terminal-prompt' : ''}`}>
                    {item.text}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "15px" }}>
                <span style={{ color: "#64748b", display: "block", fontSize: "0.75rem", marginBottom: "8px", fontWeight: "bold", textTransform: "uppercase" }}>Execute Diagnostic Probe:</span>
                <button className="terminal-btn" onClick={() => executeCommand("nmap")}>nmap -sV broker</button>
                <button className="terminal-btn" onClick={() => executeCommand("coursework")}>cat coursework.db</button>
                <button className="terminal-btn" onClick={() => executeCommand("scansafe")}>grep ScanSafe</button>
                <button className="terminal-btn" onClick={() => executeCommand("auditd")}>ausearch auditd</button>
              </div>
            </div>
          </Col>

          {/* Column 2: Quests (Experience) */}
          <Col lg={7} md={12}>
            <div className="cyber-panel" style={{ height: "calc(100% - 24px)" }}>
              <div className="cyber-header">
                <h3 className="cyber-title"><FaClipboardList /> Quests Completed (Work Experience)</h3>
              </div>
              <Row>
                <Col md={5}>
                  <div className="quest-list">
                    <div
                      className={`quest-item ${activeQuest === "aiot" ? "active" : ""}`}
                      onClick={() => setActiveQuest("aiot")}
                    >
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Research Assistant</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>GSU AIoT Lab</div>
                      </div>
                      <div className="quest-meta">
                        <span className="quest-status status-active">Active</span>
                      </div>
                    </div>

                    <div
                      className={`quest-item ${activeQuest === "codepath" ? "active" : ""}`}
                      onClick={() => setActiveQuest("codepath")}
                    >
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Cybersecurity Fellow</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>CodePath</div>
                      </div>
                      <div className="quest-meta">
                        <span className="quest-status status-completed">Success</span>
                      </div>
                    </div>

                    <div
                      className={`quest-item ${activeQuest === "extern" ? "active" : ""}`}
                      onClick={() => setActiveQuest("extern")}
                    >
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>IoT Cyber Extern</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Hydroficient</div>
                      </div>
                      <div className="quest-meta">
                        <span className="quest-status status-completed">Success</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md={7}>
                  <div className="quest-details">
                    <h4 className="purple" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{quests[activeQuest].title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px" }}>{quests[activeQuest].company}</p>
                    <p style={{ fontSize: "0.78rem", color: "#10b981", fontStyle: "italic", marginBottom: "15px" }}>{quests[activeQuest].date}</p>
                    
                    <div style={{ fontSize: "0.82rem", color: "#e2e8f0" }}>
                      <p style={{ fontWeight: "bold", color: "#38bdf8", marginBottom: "8px" }}>Objectives Met:</p>
                      <ul style={{ paddingLeft: "15px" }}>
                        {quests[activeQuest].description.map((bullet, index) => (
                          <li key={index} style={{ marginBottom: "8px" }}>{bullet}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#10b981", display: "block" }}>Loot Acquired (Skills Utilized):</span>
                      <span style={{ fontSize: "0.8rem", color: "#ffffff", fontFamily: "monospace" }}>{quests[activeQuest].rewards}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Row 3: Skills Inventory */}
        <Row className="justify-content-center">
          <Col md={12}>
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaShieldAlt /> Skill Arsenal & Tool Inventory</h3>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Select a skill to inspect weapon capabilities</span>
              </div>
              <Row>
                <Col lg={7} md={12} style={{ marginBottom: "15px" }}>
                  <div className="inventory-grid">
                    <div className={`inventory-slot ${activeSkill === "nmap" ? "active" : ""}`} onClick={() => setActiveSkill("nmap")}>
                      <FaSearch className="inventory-icon" />
                      <span className="inventory-name">Nmap Scan</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "wireshark" ? "active" : ""}`} onClick={() => setActiveSkill("wireshark")}>
                      <FaBug className="inventory-icon" />
                      <span className="inventory-name">Wireshark</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "auditd" ? "active" : ""}`} onClick={() => setActiveSkill("auditd")}>
                      <FaTerminal className="inventory-icon" />
                      <span className="inventory-name">auditd</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "splunk" ? "active" : ""}`} onClick={() => setActiveSkill("splunk")}>
                      <FaServer className="inventory-icon" />
                      <span className="inventory-name">Splunk</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "mqtt" ? "active" : ""}`} onClick={() => setActiveSkill("mqtt")}>
                      <FaNetworkWired className="inventory-icon" />
                      <span className="inventory-name">MQTT / TLS</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "hmac" ? "active" : ""}`} onClick={() => setActiveSkill("hmac")}>
                      <FaLock className="inventory-icon" />
                      <span className="inventory-name">HMAC / Crypto</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "python" ? "active" : ""}`} onClick={() => setActiveSkill("python")}>
                      <FaCode className="inventory-icon" />
                      <span className="inventory-name">Python</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "sql" ? "active" : ""}`} onClick={() => setActiveSkill("sql")}>
                      <FaServer className="inventory-icon" />
                      <span className="inventory-name">SQL Database</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "aws" ? "active" : ""}`} onClick={() => setActiveSkill("aws")}>
                      <FaCloud className="inventory-icon" />
                      <span className="inventory-name">AWS Cloud</span>
                    </div>
                    <div className={`inventory-slot ${activeSkill === "stride" ? "active" : ""}`} onClick={() => setActiveSkill("stride")}>
                      <FaShieldAlt className="inventory-icon" />
                      <span className="inventory-name">STRIDE Modeling</span>
                    </div>
                  </div>
                </Col>
                <Col lg={5} md={12}>
                  <div className="inventory-desc-panel d-flex flex-column justify-content-center">
                    <h4 className="purple" style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "8px" }}>
                      {skills[activeSkill].name}
                    </h4>
                    <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "4px", alignSelf: "flex-start", marginBottom: "12px", textTransform: "uppercase", fontWeight: "bold" }}>
                      {skills[activeSkill].category}
                    </span>
                    <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: "1.4", minHeight: "60px" }}>
                      {skills[activeSkill].desc}
                    </p>
                    <div style={{ marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: "bold", marginBottom: "4px" }}>Item Mastery Rating:</span>
                      <div className="d-flex align-items-center gap-3">
                        <div className="stat-bar-container" style={{ flex: 1, marginTop: 0 }}>
                          <div className="stat-bar-fill mp-bar" style={{ width: `${skills[activeSkill].level}%` }}></div>
                        </div>
                        <span style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "#38bdf8", fontWeight: "bold" }}>{skills[activeSkill].level}%</span>
                      </div>
                    </div>
                    <div style={{ marginTop: "12px", fontStyle: "italic", fontSize: "0.78rem", color: "#10b981", fontFamily: "monospace" }}>
                      {skills[activeSkill].power}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Row 4: Achievement Showcase (Certifications) */}
        <Row className="justify-content-center">
          <Col md={12}>
            <div className="cyber-panel">
              <div className="cyber-header">
                <h3 className="cyber-title"><FaAward /> Unlocked Achievements (Certifications)</h3>
              </div>
              <div className="achievement-list">
                <div className="badge-card">
                  <div className="badge-icon-glow"><FaAward /></div>
                  <div className="badge-details">
                    <div className="badge-title">CompTIA Security+</div>
                    <div className="badge-subtitle">In Progress — SY0-701</div>
                  </div>
                </div>
                <div className="badge-card">
                  <div className="badge-icon-glow"><FaAward /></div>
                  <div className="badge-details">
                    <div className="badge-title">AWS Cloud Foundations</div>
                    <div className="badge-subtitle">AWS Academy Certified (2025)</div>
                  </div>
                </div>
                <div className="badge-card">
                  <div className="badge-icon-glow"><FaAward /></div>
                  <div className="badge-details">
                    <div className="badge-title">CodePath Honors</div>
                    <div className="badge-subtitle">CYB102 Certificate of Achievement</div>
                  </div>
                </div>
                <div className="badge-card">
                  <div className="badge-icon-glow"><FaAward /></div>
                  <div className="badge-details">
                    <div className="badge-title">Google Cybersecurity</div>
                    <div className="badge-subtitle">Foundations & Risk Mitigation</div>
                  </div>
                </div>
                <div className="badge-card">
                  <div className="badge-icon-glow"><FaAward /></div>
                  <div className="badge-details">
                    <div className="badge-title">IBM SkillsBuild</div>
                    <div className="badge-subtitle">AI, Security, and Data Specialist</div>
                  </div>
                </div>
                <div className="badge-card">
                  <div className="badge-icon-glow"><FaAward /></div>
                  <div className="badge-details">
                    <div className="badge-title">IOBSE 2026 Participant</div>
                    <div className="badge-subtitle">Black Security Executives Cohort</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Row: Official Physical Scroll Download */}
        <Row className="justify-content-center" style={{ marginTop: "20px" }}>
          <Col md={6} style={{ textAlign: "center" }}>
            <div className="cyber-panel" style={{ borderStyle: "dashed" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "15px" }}>Request Official Physical Scroll (PDF)</h4>
              <Button
                variant="primary"
                href={pdf}
                target="_blank"
                style={{ maxWidth: "280px" }}
              >
                <AiOutlineDownload />
                &nbsp;Download Official Resume
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
