import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { FaGraduationCap, FaCertificate, FaUsers, FaInfoCircle } from "react-icons/fa";

function AboutCard() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabContents = {
    profile: (
      <div className="tab-pane-content fade-in">
        <p style={{ textAlign: "justify" }}>
          I'm <span className="purple">Patrick Ennin Selby</span> — born and raised in <span className="purple">Ghana</span>, now studying at <span className="purple">Grambling State University</span> and loving every bit of it.
          <br /><br />
          I'm a Sophomore in <span className="purple">Cybersecurity</span> (minor: CIS), and I spend my time building real tools, breaking things on purpose, and figuring out how to make digital spaces safer for everyone.
        </p>
        <div style={{ marginTop: "20px" }}>
          <span className="purple" style={{ fontWeight: "bold" }}>What I'm focused on:</span>
          <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop: "10px" }}>
            <li className="about-activity hover-glow"><ImPointRight /> Mobile security research that ships real code</li>
            <li className="about-activity hover-glow"><ImPointRight /> IoT security — locking down the devices nobody thinks about</li>
            <li className="about-activity hover-glow"><ImPointRight /> Cloud infrastructure I can actually defend</li>
          </ul>
        </div>
        <p className="about-quote" style={{ color: "#34d399", fontStyle: "italic", marginTop: "20px" }}>
          "In a world of evolving threats, I choose to be the variable that hackers never accounted for."
        </p>
      </div>
    ),
    education: (
      <div className="tab-pane-content fade-in">
        <h4 className="purple"><FaGraduationCap /> Grambling State University</h4>
        <p style={{ marginBottom: "5px" }}><strong>B.S. Cybersecurity</strong> (Minor: CIS) | GPA: 3.83/4.0</p>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Jan 2025 – Dec 2028</p>
        <div style={{ marginTop: "15px" }}>
          <strong className="purple">Coursework I've loved:</strong>
          <div className="course-tags" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
            <span className="course-tag">Security+ Prep (SY0-701)</span>
            <span className="course-tag">Data Structures & Algorithms</span>
            <span className="course-tag">Discrete Structures</span>
            <span className="course-tag">Probability & Statistics</span>
          </div>
        </div>
      </div>
    ),
    certs: (
      <div className="tab-pane-content fade-in">
        <h4 className="purple"><FaCertificate /> My Credentials</h4>
        <ul className="certs-list" style={{ paddingLeft: "0", margin: 0, listStyle: "none" }}>
          <li className="cert-item">
            <span>CodePath Cybersecurity (CYB102)</span>
            <span className="cert-badge">Honors</span>
          </li>
          <li className="cert-item">
            <span>AWS Academy Cloud Foundations</span>
            <span className="cert-badge">Credly Badge</span>
          </li>
          <li className="cert-item">
            <span>Google Cybersecurity Specialist</span>
            <span className="cert-badge">Coursera</span>
          </li>
          <li className="cert-item">
            <span>IBM SkillsBuild (AI, Cybersecurity)</span>
            <span className="cert-badge">IBM</span>
          </li>
          <li className="cert-item">
            <span>CompTIA Security+ SY0-701</span>
            <span className="cert-badge progress-badge">In Progress</span>
          </li>
        </ul>
      </div>
    ),
    affiliations: (
      <div className="tab-pane-content fade-in">
        <h4 className="purple"><FaUsers /> Communities I'm Part Of</h4>
        <p style={{ fontSize: "0.9rem", color: "#cbd5e1", marginBottom: "12px" }}>I believe who you're around shapes who you become:</p>
        <div className="affiliation-grid" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <span className="aff-badge">IOBSE 2026</span>
          <span className="aff-badge">ColorStack</span>
          <span className="aff-badge">NSBE</span>
          <span className="aff-badge">IEEE</span>
          <span className="aff-badge">Honor Society</span>
          <span className="aff-badge">NSLS</span>
          <span className="aff-badge">NABA</span>
          <span className="aff-badge">GSU S.E.C.U.R.E.</span>
          <span className="aff-badge">Cloud Security Alliance</span>
          <span className="aff-badge">ASIS International</span>
        </div>
      </div>
    )
  };

  return (
    <Card className="quote-card-view about-card-interactive">
      <Card.Header className="about-tabs-header" style={{ background: "transparent", borderBottom: "1px solid rgba(52, 211, 153, 0.15)", display: "flex", gap: "10px", padding: "10px" }}>
        <button className={`about-tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><FaInfoCircle /> Profile</button>
        <button className={`about-tab-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}><FaGraduationCap /> Education</button>
        <button className={`about-tab-btn ${activeTab === 'certs' ? 'active' : ''}`} onClick={() => setActiveTab('certs')}><FaCertificate /> Certs</button>
        <button className={`about-tab-btn ${activeTab === 'affiliations' ? 'active' : ''}`} onClick={() => setActiveTab('affiliations')}><FaUsers /> Groups</button>
      </Card.Header>
      <Card.Body style={{ minHeight: "260px" }}>
        {tabContents[activeTab]}
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
