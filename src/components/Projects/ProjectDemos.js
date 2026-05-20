import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import Particle from "../Particle";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaSearch,
  FaTerminal,
  FaExclamationTriangle,
  FaServer,
  FaNetworkWired,
  FaFileAlt
} from "react-icons/fa";
import "./ProjectDemos.css";

function ProjectDemos() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("scansafe");

  // Sync tab with URL search parameter e.g. /demos?tab=scansafe
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["scansafe", "risk", "splunk"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // --- SCANSAFE URL HEURISTICS SIMULATOR STATE & LOGIC ---
  const [scanUrl, setScanUrl] = useState("http://microsoft-secure.gsu-portal.xyz/login");
  const [scanResults, setScanResults] = useState(null);
  const [riskPercent, setRiskPercent] = useState(0);

  const runUrlScan = (urlToScan) => {
    if (!urlToScan) return;
    const url = urlToScan.trim().toLowerCase();
    
    // Heuristic Rules Evaluation (Simulating the 18 on-device rules)
    const rules = [
      {
        id: 1,
        name: "IP Address Host Check",
        desc: "URL uses raw IP host instead of domain name (e.g. 192.168.1.1).",
        triggered: /^(https?:\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url),
        weight: 30
      },
      {
        id: 2,
        name: "Insecure Protocol over Login",
        desc: "URL uses unencrypted HTTP protocol on sensitive portal directories.",
        triggered: url.startsWith("http://") && (url.includes("login") || url.includes("secure") || url.includes("signin")),
        weight: 20
      },
      {
        id: 3,
        name: "Suspicious TLD Extension",
        desc: "URL utilizes suspicious or high-risk top-level domain (.xyz, .top, .cc, .click).",
        triggered: /\.(xyz|top|cc|click|info|live)\/?/.test(url),
        weight: 15
      },
      {
        id: 4,
        name: "Typosquatting Mimicry",
        desc: "Domain contains character typos designed to impersonate secure brands.",
        triggered: /(micros0ft|paypaI|gsu-porta1|amazon-signin|outlook-verify)/.test(url),
        weight: 25
      },
      {
        id: 5,
        name: "SafeLinks Redirection Wrap",
        desc: "URL encapsulates redirection tags representing GSU-targeted credentials campaign (Rule 13).",
        triggered: url.includes("safelinks") || url.includes("redir") || url.includes("url="),
        weight: 25
      },
      {
        id: 6,
        name: "Subdomain Flooding",
        desc: "URL contains more than 4 subdomains designed to obscure the primary domain.",
        triggered: (url.match(/\./g) || []).length > 4,
        weight: 10
      },
      {
        id: 7,
        name: "Sensitive Token in Path",
        desc: "URL path contains high-value keywords (e.g., verification, billing, accounts, password).",
        triggered: /(verify|verification|billing|account-update|reset-password)/.test(url),
        weight: 10
      }
    ];

     let score = 0;
     rules.forEach(rule => {
       if (rule.triggered) {
         score += rule.weight;
       }
     });

    const calculatedRisk = Math.min(100, Math.round((score / 100) * 100));
    setRiskPercent(calculatedRisk);
    setScanResults(rules);
  };

  // Run initial scan on load
  useEffect(() => {
    if (activeTab === "scansafe") {
      runUrlScan(scanUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // --- STRIDE & DREAD THREAT MODELER STATE ---
  const [selectedAsset, setSelectedAsset] = useState("broker");
  
  const assetsData = {
    broker: {
      name: "MQTT Telemetry Broker (Sensor Pipeline)",
      stride: [
        { type: "Spoofing", desc: "Attacker injects fake sensor payloads pretending to be device node 4.", dread: { d: 7, r: 8, e: 9, a: 8, df: 7 }, mitigation: "Enforce mTLS client certificates for broker authentication." },
        { type: "Tampering", desc: "Attacker intercepts and modifies data packets in transit.", dread: { d: 8, r: 7, e: 6, a: 8, df: 6 }, mitigation: "Sign all MQTT payloads using HMAC-SHA256 signature hashes." },
        { type: "Information Disclosure", desc: "Attacker snoops pub/sub broker traffic to read sensitive industrial statistics.", dread: { d: 6, r: 9, e: 7, a: 7, df: 5 }, mitigation: "Enforce TLS v1.3 encryption across all communication ports." },
        { type: "Denial of Service", desc: "Attacker floods broker port 1883 with malformed connection packets.", dread: { d: 8, r: 8, e: 8, a: 9, df: 6 }, mitigation: "Configure broker rate limiting and connection limits per IP." }
      ]
    },
    gateway: {
      name: "Edge Gateway Router",
      stride: [
        { type: "Tampering", desc: "Attacker exploits local physical access to dump firmware keys.", dread: { d: 9, r: 4, e: 3, a: 6, df: 4 }, mitigation: "Disable hardware JTAG pins and encrypt storage partitions." },
        { type: "Repudiation", desc: "Attacker deletes local syslog records to hide configuration attacks.", dread: { d: 7, r: 6, e: 5, a: 5, df: 7 }, mitigation: "Ship logs in real-time to a secure, write-only central syslog server." },
        { type: "Elevation of Privilege", desc: "Attacker exploits outdated system binaries to spawn root shells.", dread: { d: 9, r: 8, e: 8, a: 8, df: 7 }, mitigation: "Implement regular patching schedules and disable root SSH login." }
      ]
    },
    webconsole: {
      name: "Admin Control Console (Web App)",
      stride: [
        { type: "Spoofing", desc: "Attacker bypasses session validations to impersonate administrators.", dread: { d: 9, r: 8, e: 8, a: 9, df: 8 }, mitigation: "Implement multi-factor authentication (MFA) and secure HTTP-Only cookies." },
        { type: "Elevation of Privilege", desc: "Attacker executes SQL injections to retrieve system admin privileges.", dread: { d: 10, r: 7, e: 7, a: 9, df: 6 }, mitigation: "Use prepared statements, parametrized queries, and ORM schemas." }
      ]
    }
  };

  const getDreadTotal = (dreadObj) => {
    return dreadObj.d + dreadObj.r + dreadObj.e + dreadObj.a + dreadObj.df;
  };

  // --- SPLUNK THREAT HUNT GAME STATE ---
  const [splunkStage, setSplunkStage] = useState("INIT"); // INIT, ANALYZING, DECIDING, MITIGATED, FAILED
  const [splunkLogs, setSplunkLogs] = useState([]);

  const initSplunkHunt = () => {
    setSplunkStage("ANALYZING");
    setSplunkLogs([
      "[-] SYSTEM STATUS: ACTIVE MONITORING PORT 514",
      "[-] INDEXING INCOMING EVENT STREAM...",
      "[-] INDEXED: SSH authentication success for user 'pat' from 10.0.2.15",
      "[-] ALERT: [2026-05-20 04:07:51] SYSTEM SECURITY EXCEPTION TRIGGERED",
      "[-] ALERT IDENTIFIER: auditd_kernel_event_04",
      "[-] TRACE INFO: SYSCALL syscall=2 (open) success=yes exe='/usr/bin/nano'",
      "[-] TARGET FILE DETECTED: /etc/passwd",
      "[-] SYSTEM INQUIRY: Correlate UID parameters to trace threat..."
    ]);
  };

  const chooseOption = (isCorrect) => {
    if (isCorrect) {
      setSplunkLogs(prev => [
        ...prev,
        "[-] CORRELATION COMPLETED: UID=1000 edited root files via sudo nano /etc/passwd.",
        "[-] RISK METRIC: CRITICAL (Potential root backdoor creation).",
        "[-] ACTION REQUIRED: Select Incident Response playbook immediately..."
      ]);
      setSplunkStage("DECIDING");
    } else {
      setSplunkLogs(prev => [
        ...prev,
        "[-] CORRELATION ERROR: Selected log is normal user traffic.",
        "[-] BREACH STATUS: Attack undetected. Root files compromised.",
        "[-] SYSTEM HALTED: MISSION FAILED"
      ]);
      setSplunkStage("FAILED");
    }
  };

  const runPlaybook = (choice) => {
    if (choice === "isolate") {
      setSplunkLogs(prev => [
        ...prev,
        "[-] PLAYBOOK EXECUTED: Revoke mTLS certificate and isolate target IP.",
        "[-] ISOLATING HOST: Container isolated from MQTT broker pipeline.",
        "[-] SYSTEM STATUS: CLEAN. Backdoor attempt neutralized.",
        "[-] LOG AUDIT: Incident response playbook completed with 100% security integrity.",
        "[-] STATUS: SECURED"
      ]);
      setSplunkStage("MITIGATED");
    } else {
      setSplunkLogs(prev => [
        ...prev,
        "[-] PLAYBOOK EXECUTED: Run automated vulnerability scanner.",
        "[-] SCAN COMPLETED: System scans did not terminate active root shell.",
        "[-] BACKDOOR EXPLOITED: Key data exfiltrated to command-and-control server.",
        "[-] SYSTEM HALTED: MISSION FAILED"
      ]);
      setSplunkStage("FAILED");
    }
  };

  return (
    <Container fluid className="project-section demo-container">
      <Particle />
      <Container>
        <Row className="justify-content-center" style={{ marginBottom: "30px" }}>
          <Col md={10} style={{ textAlign: "center" }}>
            <h1 className="project-heading" style={{ fontSize: "2.3rem" }}>
              Project <strong className="purple">Sandbox Demos</strong>
            </h1>
            <p style={{ color: "white" }}>
              Interact with real-time simulations and sandboxes demonstrating the exact logic of my security projects.
            </p>
          </Col>
        </Row>

        {/* Dynamic Navigation Tabs */}
        <Row className="justify-content-center">
          <Col md={10}>
            <div className="demo-tabs-container">
              <button
                className={`demo-tab-btn ${activeTab === "scansafe" ? "active" : ""}`}
                onClick={() => setActiveTab("scansafe")}
              >
                <FaSearch /> ScanSafe URL Simulator
              </button>
              <button
                className={`demo-tab-btn ${activeTab === "risk" ? "active" : ""}`}
                onClick={() => setActiveTab("risk")}
              >
                <FaShieldAlt /> STRIDE Threat Modeler
              </button>
              <button
                className={`demo-tab-btn ${activeTab === "splunk" ? "active" : ""}`}
                onClick={() => setActiveTab("splunk")}
              >
                <FaTerminal /> Splunk Incident Hunt
              </button>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10}>
            {/* TAB 1: SCANSAFE SIMULATOR */}
            {activeTab === "scansafe" && (
              <div className="demo-panel">
                <div className="demo-header">
                  <h3 className="demo-title"><FaSearch /> ScanSafe — Heuristics Sandbox</h3>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                    Run raw URL analysis using our on-device 18-rule parsing engine.
                  </span>
                </div>
                <Row>
                  <Col lg={7} md={12}>
                    <p style={{ fontSize: "0.9rem" }}>
                      ScanSafe bypasses cloud database queries to eliminate latency. Type any URL below to inspect matching heuristic blocks.
                    </p>
                    <div className="cyber-input-group">
                      <input
                        type="text"
                        className="cyber-input"
                        value={scanUrl}
                        onChange={(e) => setScanUrl(e.target.value)}
                        placeholder="http://enter-url-to-scan.com"
                      />
                      <Button variant="primary" onClick={() => runUrlScan(scanUrl)}>
                        Scan URL
                      </Button>
                    </div>

                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", margin: "15px 0 8px 0" }}>
                      Preset Samples (Click to load):
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                      <Button variant="outline-light" size="sm" onClick={() => { setScanUrl("https://gsu-portal.edu/login/secure"); runUrlScan("https://gsu-portal.edu/login/secure"); }}>
                        GSU Portal (Safe)
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => { setScanUrl("http://microsoft-outlook-safelinks-validation.gsu-portal.secure-access.com"); runUrlScan("http://microsoft-outlook-safelinks-validation.gsu-portal.secure-access.com"); }}>
                        Office365 Spoof (Phish)
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => { setScanUrl("https://aws.amazon.signin.security-alert-aws.net/console"); runUrlScan("https://aws.amazon.signin.security-alert-aws.net/console"); }}>
                        AWS Phishing (Spoof)
                      </Button>
                    </div>

                    <h5 className="purple" style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "12px" }}>
                      Triggered Diagnostic Engine Rules:
                    </h5>
                    <div className="heuristics-grid">
                      {scanResults ? (
                        scanResults.map(rule => (
                          <div key={rule.id} className={`heuristic-row ${rule.triggered ? "triggered" : "passed"}`}>
                            <span>Rule {rule.id}: {rule.name}</span>
                            <span>{rule.triggered ? "🔴 Triggered" : "🟢 Passed"}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                          No scan results. Input a URL and click Scan.
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col lg={5} md={12}>
                    <div className="risk-meter-container">
                      <FaExclamationTriangle style={{ fontSize: "2rem", color: riskPercent > 40 ? "#ef4444" : riskPercent > 10 ? "#ffa500" : "#10b981" }} />
                      <h4 style={{ marginTop: "15px", fontWeight: "bold" }}>URL Risk Analysis</h4>
                      
                      <div
                        className="risk-percentage"
                        style={{ color: riskPercent > 40 ? "#ef4444" : riskPercent > 10 ? "#ffa500" : "#10b981" }}
                      >
                        {riskPercent}%
                      </div>

                      <span
                        className="risk-level"
                        style={{
                          background: riskPercent > 40 ? "rgba(239, 68, 68, 0.2)" : riskPercent > 10 ? "rgba(255, 165, 0, 0.2)" : "rgba(16, 185, 129, 0.2)",
                          color: riskPercent > 40 ? "#f87171" : riskPercent > 10 ? "#fcd34d" : "#34d399",
                          border: `1px solid ${riskPercent > 40 ? '#ef4444' : riskPercent > 10 ? '#ffa500' : '#10b981'}`
                        }}
                      >
                        {riskPercent > 40 ? "Suspicious Phish" : riskPercent > 10 ? "Medium Warning" : "Secure Domain"}
                      </span>

                      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "20px", textAlign: "center", lineHeight: "1.4" }}>
                        {riskPercent > 40
                          ? "CRITICAL WARNING: This URL demonstrates significant phishing markers (typosquatting names or wrapped link targets). ScanSafe intercepts execution."
                          : riskPercent > 10
                          ? "WARNING: Triggered standard redirection or token paths. Review domain indicators carefully before inputs."
                          : "URL passes key heuristic verification constraints. Clean domain origin."}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* TAB 2: STRIDE THREAT MODELER */}
            {activeTab === "risk" && (
              <div className="demo-panel">
                <div className="demo-header">
                  <h3 className="demo-title"><FaShieldAlt /> STRIDE & DREAD threat modeler</h3>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                    Select network assets to inspect threat boundaries and DREAD risk ratings.
                  </span>
                </div>
                <Row>
                  <Col md={5} style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "0.9rem", marginBottom: "15px", fontWeight: "bold", textTransform: "uppercase", color: "#94a3b8" }}>
                      Select System Asset Node:
                    </div>
                    <div className="stride-assets-list">
                      <div
                        className={`stride-asset-card ${selectedAsset === "broker" ? "active" : ""}`}
                        onClick={() => setSelectedAsset("broker")}
                      >
                        <h5 className="purple" style={{ fontSize: "1rem", fontWeight: "bold", margin: 0 }}><FaNetworkWired /> MQTT Telemetry Broker</h5>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Pub/Sub Device Communications</span>
                      </div>

                      <div
                        className={`stride-asset-card ${selectedAsset === "gateway" ? "active" : ""}`}
                        onClick={() => setSelectedAsset("gateway")}
                      >
                        <h5 className="purple" style={{ fontSize: "1rem", fontWeight: "bold", margin: 0 }}><FaServer /> Edge Gateway Router</h5>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Local Routing and Firmware</span>
                      </div>

                      <div
                        className={`stride-asset-card ${selectedAsset === "webconsole" ? "active" : ""}`}
                        onClick={() => setSelectedAsset("webconsole")}
                      >
                        <h5 className="purple" style={{ fontSize: "1rem", fontWeight: "bold", margin: 0 }}><FaFileAlt /> Admin Web Console</h5>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Web GUI Management Console</span>
                      </div>
                    </div>
                  </Col>

                  <Col md={7}>
                    <div className="quest-details" style={{ minHeight: "auto" }}>
                      <h4 className="purple" style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                        Active Threat Modeler Matrix:
                      </h4>
                      <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                        Listing STRIDE threat profiles compiled for: <strong>{assetsData[selectedAsset].name}</strong>
                      </p>

                      {assetsData[selectedAsset].stride.map((threat, index) => {
                        const score = getDreadTotal(threat.dread);
                        const severity = score > 35 ? "Critical" : score > 25 ? "High" : "Medium";
                        return (
                          <div
                            key={index}
                            style={{
                              background: "rgba(15, 23, 42, 0.7)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              borderRadius: "8px",
                              padding: "16px",
                              marginBottom: "15px"
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong style={{ color: "#38bdf8", textTransform: "uppercase", fontSize: "0.85rem" }}>
                                {threat.type}
                              </strong>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  background: severity === "Critical" ? "rgba(239, 68, 68, 0.18)" : severity === "High" ? "rgba(245, 158, 11, 0.18)" : "rgba(16, 185, 129, 0.18)",
                                  color: severity === "Critical" ? "#f87171" : severity === "High" ? "#fbbf24" : "#34d399",
                                  border: `1px solid ${severity === 'Critical' ? '#ef4444' : severity === 'High' ? '#f59e0b' : '#10b981'}`
                                }}
                              >
                                DREAD Score: {score} ({severity})
                              </span>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>{threat.desc}</p>
                            
                            {/* DREAD parameters visual meters */}
                            <div style={{ background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "6px", margin: "10px 0" }}>
                              <div className="dread-meter-row">
                                <span className="dread-label text-muted">Damage (D):</span>
                                <div className="dread-bar"><div className="dread-bar-fill" style={{ width: `${threat.dread.d * 10}%` }}></div></div>
                                <span className="dread-value">{threat.dread.d}/10</span>
                              </div>
                              <div className="dread-meter-row">
                                <span className="dread-label text-muted">Reproducibility (R):</span>
                                <div className="dread-bar"><div className="dread-bar-fill" style={{ width: `${threat.dread.r * 10}%` }}></div></div>
                                <span className="dread-value">{threat.dread.r}/10</span>
                              </div>
                              <div className="dread-meter-row">
                                <span className="dread-label text-muted">Exploitability (E):</span>
                                <div className="dread-bar"><div className="dread-bar-fill" style={{ width: `${threat.dread.e * 10}%` }}></div></div>
                                <span className="dread-value">{threat.dread.e}/10</span>
                              </div>
                              <div className="dread-meter-row">
                                <span className="dread-label text-muted">Affected Users (A):</span>
                                <div className="dread-bar"><div className="dread-bar-fill" style={{ width: `${threat.dread.a * 10}%` }}></div></div>
                                <span className="dread-value">{threat.dread.a}/10</span>
                              </div>
                              <div className="dread-meter-row">
                                <span className="dread-label text-muted">Discoverability (D):</span>
                                <div className="dread-bar"><div className="dread-bar-fill" style={{ width: `${threat.dread.df * 10}%` }}></div></div>
                                <span className="dread-value">{threat.dread.df}/10</span>
                              </div>
                            </div>

                            <div style={{ fontSize: "0.8rem", color: "#10b981", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
                              <strong>Mitigation Control:</strong> {threat.mitigation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* TAB 3: SPLUNK THREAT HUNT GAME */}
            {activeTab === "splunk" && (
              <div className="demo-panel">
                <div className="demo-header">
                  <h3 className="demo-title"><FaTerminal /> Splunk — Threat Hunting Dashboard</h3>
                  <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                    Identify anomalous auditd events and run playbook scripts.
                  </span>
                </div>

                <p style={{ fontSize: "0.9rem" }}>
                  This interactive module simulates monitoring system logs. Trace security events, isolate threat triggers, and secure systems.
                </p>

                {/* Splunk Console screen */}
                <div className="soc-terminal-screen">
                  {splunkLogs.length === 0 ? (
                    <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#64748b" }}>
                      <FaTerminal style={{ fontSize: "2.5rem", marginBottom: "10px" }} />
                      <span>LOGS OFFLINE. Start Threat Hunt to activate SIEM log collection.</span>
                    </div>
                  ) : (
                    splunkLogs.map((line, idx) => (
                      <div key={idx} className="soc-terminal-line">
                        {line}
                      </div>
                    ))
                  )}
                </div>

                {/* Game state display control */}
                {splunkStage === "INIT" && (
                  <Button variant="primary" onClick={initSplunkHunt}>
                    Initiate Threat Hunt
                  </Button>
                )}

                {splunkStage === "ANALYZING" && (
                  <div>
                    <h5 className="purple mb-3" style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      SIEM Inquiry: Identify the correct anomalous log to trace:
                    </h5>
                    <div className="soc-options-grid">
                      <div className="soc-opt-card error" onClick={() => chooseOption(false)}>
                        <strong>Event A: SSH Login Failure</strong>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "5px" }}>
                          [10:14:02] SSH login failed for user 'root' from 192.168.1.5 (Port 22) - Incorrect password.
                        </span>
                      </div>
                      <div className="soc-opt-card success" onClick={() => chooseOption(true)}>
                        <strong>Event B: auditd Kernel Override</strong>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "5px" }}>
                          [10:14:02] syscall=2 (open) success=yes exe='/usr/bin/nano' path='/etc/passwd' auid=1000 uid=0.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {splunkStage === "DECIDING" && (
                  <div>
                    <h5 className="purple mb-3" style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      Select Incident Response Playbook to neutralize:
                    </h5>
                    <div className="soc-options-grid">
                      <div className="soc-opt-card success" onClick={() => runPlaybook("isolate")}>
                        <strong>Playbook A: Revoke Node Credentials & Isolate Host</strong>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "5px" }}>
                          Immediately isolates the compromising gateway and revokes TLS certificates to stop movement.
                        </span>
                      </div>
                      <div className="soc-opt-card error" onClick={() => runPlaybook("scan")}>
                        <strong>Playbook B: Run Vulnerability Scan on Node</strong>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "5px" }}>
                          Runs automated scans to check CVE status while leaving connection active.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(splunkStage === "MITIGATED" || splunkStage === "FAILED") && (
                  <div className="text-center mt-3">
                    <h4 className={splunkStage === "MITIGATED" ? "text-success" : "text-danger"} style={{ fontWeight: "bold" }}>
                      {splunkStage === "MITIGATED" ? "✓ SECURED COMPLETED (+50 XP)" : "⚠ MISSION BREACHED (HP DECREASED)"}
                    </h4>
                    <Button variant="primary" style={{ marginTop: "15px" }} onClick={() => setSplunkStage("INIT")}>
                      Reset SIEM Console
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>

        {/* Back Button to standard portfolio */}
        <Row className="justify-content-center" style={{ marginTop: "20px" }}>
          <Col md={10} style={{ textAlign: "center" }}>
            <Link to="/project" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "1rem" }}>
              <button className="hud-btn">
                <FaArrowLeft /> Back to Project Grid
              </button>
            </Link>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default ProjectDemos;
