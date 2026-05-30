import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Container, Row, Col, Button } from "react-bootstrap";
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
  FaServer,
  FaCube,
  FaDesktop
} from "react-icons/fa";
import pdf from "../../Assets/resume.pdf";
import "./Resume.css";

function SplineResume({ toggleMode }) {
  const [activeQuest, setActiveQuest] = useState("aiot");
  const [activeSkill, setActiveSkill] = useState("nmap");
  const canvasRef = useRef(null);

  // ── Three.js 3D Cyber Network Background ────────────────────────────────
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    // ── Scene / Camera / Renderer ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040912);
    scene.fog = new THREE.FogExp2(0x040912, 0.028);

    const W = container.offsetWidth || window.innerWidth;
    const H = container.offsetHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 8, 30);
    camera.lookAt(0, 0, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch (e) {
      console.warn("WebGL not supported:", e);
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x0a1a2a, 1));
    const ptLight = new THREE.PointLight(0x00e678, 2.5, 40);
    ptLight.position.set(0, 6, 0);
    scene.add(ptLight);
    const ptLight2 = new THREE.PointLight(0x00c8ff, 1.5, 35);
    ptLight2.position.set(-10, -4, 8);
    scene.add(ptLight2);

    // ── Node network ──
    const NODE_COUNT = 90;
    const SPREAD = 24;
    const NODE_COLORS = [0x00e678, 0x00d4ff, 0x7b2fff, 0x00ff88, 0x38bdf8];

    const nodePositions = Array.from({ length: NODE_COUNT }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD * 2,
        (Math.random() - 0.5) * SPREAD * 0.8,
        (Math.random() - 0.5) * SPREAD * 2
      )
    );
    const nodeVels = nodePositions.map(() =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.014,
        (Math.random() - 0.5) * 0.009,
        (Math.random() - 0.5) * 0.014
      )
    );

    // Mix of sphere and octahedron nodes for variety
    const nodeMeshes = nodePositions.map((pos, i) => {
      const size = Math.random() * 0.22 + 0.07;
      const geo = i % 5 === 0
        ? new THREE.OctahedronGeometry(size * 1.4)
        : new THREE.SphereGeometry(size, 10, 10);
      const color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
        shininess: 80,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);
      return { mesh, phase: Math.random() * Math.PI * 2, color };
    });

    // ── Edge lines (LineSegments — one draw call) ──
    const MAX_EDGES = 400;
    const edgeBuf = new Float32Array(MAX_EDGES * 6);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgeBuf, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x00c8ff,
      transparent: true,
      opacity: 0.18,
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edgeLines);

    // ── Scan pulse rings (torus) ──
    const pulses = Array.from({ length: 4 }, (_, i) => {
      const geo = new THREE.TorusGeometry(0.1, 0.035, 8, 48);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x7b2fff : 0x00e678,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      scene.add(mesh);
      return { mesh, r: 0, speed: 0.18 + Math.random() * 0.1, max: 7 + Math.random() * 5, active: false, delay: i * 70 };
    });

    // ── Large slow-rotating icosahedron wireframe at center ──
    const icoGeo = new THREE.IcosahedronGeometry(4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00e678,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Animation loop ──
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Camera slow orbit
      const orbitR = 30;
      camera.position.x = Math.sin(t * 0.065) * orbitR;
      camera.position.z = Math.cos(t * 0.065) * orbitR;
      camera.position.y = 7 + Math.sin(t * 0.035) * 4;
      camera.lookAt(0, 0, 0);

      // Icosahedron slow spin
      ico.rotation.y = t * 0.08;
      ico.rotation.x = t * 0.04;

      // Drift nodes
      nodeMeshes.forEach((n, i) => {
        const pos = nodePositions[i];
        const vel = nodeVels[i];
        pos.addScaledVector(vel, 1);
        if (Math.abs(pos.x) > SPREAD) vel.x *= -1;
        if (Math.abs(pos.y) > SPREAD * 0.4) vel.y *= -1;
        if (Math.abs(pos.z) > SPREAD) vel.z *= -1;
        n.mesh.position.copy(pos);
        // Pulse emissive
        n.mesh.material.emissiveIntensity = 0.4 + Math.sin(t * 1.6 + n.phase) * 0.35;
        // Gentle spin on octahedra
        if (n.mesh.geometry.type === "OctahedronGeometry") {
          n.mesh.rotation.y += 0.01;
          n.mesh.rotation.x += 0.007;
        }
      });

      // Rebuild edges
      let ei = 0;
      const THRESH = 7.5;
      outer: for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (ei >= MAX_EDGES) break outer;
          const d = nodePositions[i].distanceTo(nodePositions[j]);
          if (d < THRESH) {
            const b = ei * 6;
            edgeBuf[b]     = nodePositions[i].x; edgeBuf[b+1] = nodePositions[i].y; edgeBuf[b+2] = nodePositions[i].z;
            edgeBuf[b+3]   = nodePositions[j].x; edgeBuf[b+4] = nodePositions[j].y; edgeBuf[b+5] = nodePositions[j].z;
            ei++;
          }
        }
      }
      edgeGeo.setDrawRange(0, ei * 2);
      edgeGeo.attributes.position.needsUpdate = true;

      // Scan pulses
      pulses.forEach((p) => {
        p.delay--;
        if (p.delay <= 0 && !p.active) {
          p.active = true;
          p.r = 0.01;
          const src = nodePositions[Math.floor(Math.random() * NODE_COUNT)];
          p.mesh.position.copy(src);
          p.delay = 100 + Math.floor(Math.random() * 90);
        }
        if (p.active) {
          p.r += p.speed;
          const s = p.r * 10;
          p.mesh.scale.set(s, s, s);
          p.mesh.material.opacity = Math.max(0, 0.65 * (1 - p.r / p.max));
          if (p.r >= p.max) { p.active = false; p.mesh.material.opacity = 0; }
        }
      });

      // Lights breathe
      ptLight.intensity = 2.2 + Math.sin(t * 1.1) * 0.5;
      ptLight2.intensity = 1.3 + Math.sin(t * 0.8 + 1) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const [terminalHistory, setTerminalHistory] = useState([
    { text: "Patrick Selby — 3D Resume loaded.", type: "system" },
    { text: "Select a command below to learn more.", type: "success" }
  ]);

  const executeCommand = (cmd) => {
    let output = [];
    if (cmd === "nmap") {
      output = [
        { text: "$ nmap -sV -p 80,443,1883 scan-target.gsu.edu", type: "prompt" },
        { text: "Host is up (0.045s latency).", type: "line" },
        { text: "80/tcp   open  http    nginx 1.25.1", type: "line" },
        { text: "443/tcp  open  https   nginx (encrypted, verified)", type: "success" },
        { text: "1883/tcp open  messaging  authenticated broker", type: "success" }
      ];
    } else if (cmd === "coursework") {
      output = [
        { text: "$ cat /home/pselby/education/coursework.db", type: "prompt" },
        { text: "Major: B.S. Cybersecurity (GPA: 3.83/4.0)", type: "success" },
        { text: "Minor: Computer Information Systems", type: "line" }
      ];
    } else if (cmd === "scansafe") {
      output = [
        { text: "$ grep -rn \"CRITICAL\" /var/log/scansafe/", type: "prompt" },
        { text: "ALERT: Phishing link detected behind redirect.", type: "error" },
        { text: "ScanSafe action: Intercepted & Blocked.", type: "success" }
      ];
    } else if (cmd === "auditd") {
      output = [
        { text: "$ search-logs -k file_changes", type: "prompt" },
        { text: "Root file modification detected in /etc/passwd.", type: "error" },
        { text: "Event correlation completed.", type: "success" }
      ];
    }
    setTerminalHistory((prev) => [...prev, ...output]);
  };

  const quests = {
    aiot: {
      title: "Research Assistant — Mobile Security",
      company: "Grambling State University · AIoT Lab",
      date: "Spring 2026 – Present",
      status: "Active Research",
      tools: "Android Studio, Python, Git",
      description: [
        "I built ScanSafe — an Android app that detects phishing links in QR codes, entirely on the phone with no internet needed.",
        "I wrote all 18 detection rules myself, including one triggered by a real phishing attack on my school.",
        "I redesigned the results screen so both everyday users and technical reviewers can understand it."
      ]
    },
    codepath: {
      title: "Cybersecurity Fellow",
      company: "CodePath · Certificate with Honors",
      date: "Feb 2026 – May 2026",
      status: "Completed (Honors)",
      tools: "Wireshark, Splunk, Linux, Python",
      description: [
        "I completed 7 hands-on security labs — tracking suspicious traffic, investigating logs, and responding to simulated incidents.",
        "I led my team's final presentation, walking a technical audience through a full incident response from detection to resolution."
      ]
    },
    extern: {
      title: "IoT Security Extern",
      company: "Hydroficient (via Extern) · Remote",
      date: "Feb 2026 – Mar 2026",
      status: "Completed (Certificate)",
      tools: "Python, OpenSSL, Wireshark, Linux",
      description: [
        "I designed a secure communication pipeline for connected devices — verifying identity, protecting messages, and detecting unusual behavior.",
        "I built three layers of protection against replay attacks, where an attacker tries to reuse old messages to trick the system."
      ]
    }
  };

  const skills = {
    nmap: {
      name: "Nmap",
      level: 90,
      category: "Scanning",
      desc: "I use Nmap to check what ports and services are exposed on a network and spot anything that shouldn't be open.",
      power: "Find what's exposed"
    },
    wireshark: {
      name: "Wireshark",
      level: 88,
      category: "Forensics",
      desc: "I capture and read network traffic to spot suspicious activity or data being sent without protection.",
      power: "Read the wire"
    },
    auditd: {
      name: "Linux Audit",
      level: 85,
      category: "Forensics",
      desc: "I configure Linux to track who changed what and when — essential for tracing exactly what happened during a security incident.",
      power: "Track every change"
    },
    splunk: {
      name: "Splunk",
      level: 80,
      category: "Log Analysis",
      desc: "I search and correlate security logs across systems, writing search queries, indexing logs, and building incident alert dashboards.",
      power: "Find the story in logs"
    },
    mqtt: {
      name: "Secure Device Messaging",
      level: 92,
      category: "Protocols",
      desc: "I set up encrypted, verified communication channels for connected devices — so only trusted devices can send or receive data.",
      power: "Secure the channel"
    },
    hmac: {
      name: "Message Authentication",
      level: 86,
      category: "Protocols",
      desc: "I use cryptographic signing to prove a message hasn't been tampered with between the sender and receiver.",
      power: "Prove it wasn't changed"
    },
    python: {
      name: "Python",
      level: 94,
      category: "Programming",
      desc: "My go-to language for building security tools, automating tasks, and scripting detection logic.",
      power: "Build anything fast"
    },
    sql: {
      name: "SQL",
      level: 82,
      category: "Programming",
      desc: "I write queries to retrieve and analyze data securely, and I know how to protect databases from common attacks.",
      power: "Query safely"
    },
    aws: {
      name: "AWS Cloud",
      level: 78,
      category: "Cloud",
      desc: "I know how to set up cloud environments securely — controlling access, monitoring traffic, and locking down who can do what.",
      power: "Secure the cloud"
    },
    stride: {
      name: "Threat Modeling",
      level: 88,
      category: "Risk Analysis",
      desc: "I analyze systems before they're built or breached to find where things could go wrong and how to prevent it.",
      power: "Prevent before it happens"
    }
  };

  return (
    <div className="spline-resume-page">
      {/* Three.js 3D Background */}
      <div
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden" }}
      />

      {/* HTML HUD Overlay */}
      <div className="hud-overlay-container">
        <Container fluid>
          {/* Top Bar HUD Controls */}
          <div className="hud-top-bar glass-hud">
            <div className="hud-brand">
              <FaCube className="hud-glow-icon" />
              <span>Patrick Selby · 3D Resume</span>
            </div>
            <div className="hud-actions">
              <Button
                variant="outline-success"
                onClick={toggleMode}
                className="hud-toggle-btn"
              >
                <FaDesktop /> &nbsp; 2D View
              </Button>
            </div>
          </div>

          <Row className="hud-row">
            {/* Left Column: Player Stats & Diagnostics Terminal */}
            <Col lg={5} md={12} className="hud-column">
              <div className="glass-hud-panel">
                <div className="hud-header">
                  <h4>
                    <FaUserShield /> Profile
                  </h4>
                  <span className="badge-glow">SECURE</span>
                </div>
                <Row className="align-items-center">
                  <Col xs={4} className="text-center">
                    <div className="badge-icon-glow animated-icon">
                      <FaUserGraduate />
                    </div>
                    <div className="hud-char-name">Patrick Selby</div>
                  </Col>
                  <Col xs={8}>
                    <div className="char-info-row">
                      <span className="char-label">Class</span>
                      <span className="char-value">Cybersecurity Specialist</span>
                    </div>
                    <div className="char-info-row">
                      <span className="char-label">GPA</span>
                      <span className="char-value">3.83 / 4.0</span>
                      <div className="stat-bar-container">
                        <div className="stat-bar-fill xp-bar" style={{ width: "95.75%" }}></div>
                      </div>
                    </div>
                    <div className="char-info-row">
                      <span className="char-label">Integrity</span>
                      <span className="char-value">100 / 100</span>
                      <div className="stat-bar-container">
                        <div className="stat-bar-fill hp-bar" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="glass-hud-panel">
                <div className="hud-header">
                  <h4>
                    <FaTerminal /> Interactive Terminal
                  </h4>
                </div>
                <div className="terminal-screen small-term">
                  {terminalHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`terminal-line ${
                        item.type === "error"
                          ? "text-danger"
                          : item.type === "success"
                          ? "text-success"
                          : item.type === "prompt"
                          ? "terminal-prompt"
                          : ""
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
                <div className="terminal-actions mt-3">
                  <button className="terminal-btn btn-sm" onClick={() => executeCommand("nmap")}>
                    nmap
                  </button>
                  <button className="terminal-btn btn-sm" onClick={() => executeCommand("coursework")}>
                    cat coursework
                  </button>
                  <button className="terminal-btn btn-sm" onClick={() => executeCommand("scansafe")}>
                    scansafe
                  </button>
                  <button className="terminal-btn btn-sm" onClick={() => executeCommand("auditd")}>
                    auditd
                  </button>
                </div>
              </div>
            </Col>

            {/* Right Column: Quests Completed (Work Experience) */}
            <Col lg={7} md={12} className="hud-column">
              <div className="glass-hud-panel full-height-panel">
                <div className="hud-header">
                  <h4>
                    <FaClipboardList /> Experience
                  </h4>
                </div>
                <Row>
                  <Col md={5}>
                    <div className="quest-list">
                      {Object.keys(quests).map((key) => (
                        <div
                          key={key}
                          className={`quest-item hud-quest-item ${activeQuest === key ? "active" : ""}`}
                          onClick={() => setActiveQuest(key)}
                        >
                          <div>
                            <div className="quest-item-title">{quests[key].title}</div>
                            <div className="quest-item-company">{quests[key].company}</div>
                          </div>
                          <span
                            className={`quest-status ${
                              quests[key].status.includes("Active") ? "status-active" : "status-completed"
                            }`}
                          >
                            {quests[key].status.includes("Active") ? "Active" : "Success"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col md={7}>
                    <div className="quest-details glass-inner-panel">
                      <h5 className="purple">{quests[activeQuest].title}</h5>
                      <p className="quest-meta-text">{quests[activeQuest].company}</p>
                      <p className="quest-meta-date">{quests[activeQuest].date}</p>
                      <hr className="hud-hr" />
                      <div className="quest-objectives">
                        <span className="obj-header">What I did:</span>
                        <ul>
                          {quests[activeQuest].description.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="loot-section">
                        <span className="loot-header">Tools I used:</span>
                        <p>{quests[activeQuest].tools}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* Row 3: Skill Inventory & Achievements */}
          <Row className="hud-row">
            <Col lg={7} md={12} className="hud-column">
              <div className="glass-hud-panel">
                <div className="hud-header">
                  <h4>
                    <FaShieldAlt /> Skills
                  </h4>
                </div>
                <Row>
                  <Col md={7}>
                    <div className="inventory-grid hud-inv-grid">
                      {Object.keys(skills).map((key) => (
                        <div
                          key={key}
                          className={`inventory-slot ${activeSkill === key ? "active" : ""}`}
                          onClick={() => setActiveSkill(key)}
                        >
                          {key === "nmap" && <FaSearch className="inventory-icon" />}
                          {key === "wireshark" && <FaBug className="inventory-icon" />}
                          {key === "auditd" && <FaTerminal className="inventory-icon" />}
                          {key === "splunk" && <FaServer className="inventory-icon" />}
                          {key === "mqtt" && <FaNetworkWired className="inventory-icon" />}
                          {key === "hmac" && <FaLock className="inventory-icon" />}
                          {key === "python" && <FaCode className="inventory-icon" />}
                          {key === "sql" && <FaServer className="inventory-icon" />}
                          {key === "aws" && <FaCloud className="inventory-icon" />}
                          {key === "stride" && <FaShieldAlt className="inventory-icon" />}
                          <span className="inventory-name">{skills[key].name}</span>
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col md={5}>
                    <div className="inventory-desc-panel glass-inner-panel">
                      <h5>{skills[activeSkill].name}</h5>
                      <span className="skill-category">{skills[activeSkill].category}</span>
                      <p className="skill-description">{skills[activeSkill].desc}</p>
                      <div className="skill-progress mt-3">
                        <span className="progress-label">Proficiency:</span>
                        <div className="d-flex align-items-center gap-2">
                          <div className="stat-bar-container w-100">
                            <div
                              className="stat-bar-fill mp-bar"
                              style={{ width: `${skills[activeSkill].level}%` }}
                            ></div>
                          </div>
                          <span className="mastery-val">{skills[activeSkill].level}%</span>
                        </div>
                      </div>
                      <div className="skill-power">{skills[activeSkill].power}</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>


            <Col lg={5} md={12} className="hud-column">
              <div className="glass-hud-panel">
                <div className="hud-header">
                  <h4><FaAward /> Certifications</h4>
                </div>
                <div className="achievement-list hud-achievement-list">
                  {[
                    ["CompTIA Security+", "In Progress — SY0-701"],
                    ["CodePath CYB102", "Certificate of Achievement · Honors"],
                    ["AWS Cloud Foundations", "AWS Academy (2025)"],
                    ["Google Cybersecurity", "Foundations & Risk Mitigation"],
                    ["IBM SkillsBuild", "AI, Security & Data"],
                    ["IOBSE 2026", "Black Security Executives Cohort"],
                  ].map(([title, sub]) => (
                    <div key={title} className="badge-card hud-badge-card">
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

        </Container>
      </div>
    </div>
  );
}

export default SplineResume;
