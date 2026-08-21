import React from "react";
import pdf from "../../Assets/resume.pdf";
import { experience, education, certifications, about, profile } from "../../data/content";
import "./Resume.css";

function ResumeNew() {
  return (
    <main className="section resume">
      <div className="shell">
        <p className="section-label mono">## resume</p>
        <h1 className="section-title">Resume</h1>
        <p className="section-sub">
          The short version of everything on the home page. Grab the PDF, or read it below.
        </p>

        <div className="resume__actions">
          <a className="btn btn-primary" href={pdf} download="Patrick-Ennin-Selby-Resume.pdf">
            <span aria-hidden="true">&#8595;</span> Download PDF
          </a>
          <a className="btn btn-ghost" href={pdf} target="_blank" rel="noopener noreferrer">
            Open in new tab
          </a>
        </div>

        <section className="resume__block">
          <h2 className="resume__h2">Education</h2>
          <div className="card resume__card">
            <div className="resume__row-head">
              <h3 className="resume__role">{education.school}</h3>
              <span className="resume__dates mono">{education.dates}</span>
            </div>
            <p className="resume__org">
              {education.degree} · {education.detail}
            </p>
            <div className="resume__chips">
              {education.coursework.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="resume__block">
          <h2 className="resume__h2">Experience</h2>
          {experience.map((job) => (
            <div key={job.role} className="card resume__card">
              <div className="resume__row-head">
                <h3 className="resume__role">{job.role}</h3>
                <span className="resume__dates mono">{job.dates}</span>
              </div>
              <p className="resume__org">
                {job.org} · {job.team}
              </p>
              <ul className="resume__bullets">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="resume__chips">
                {job.tools.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="resume__block">
          <h2 className="resume__h2">Skills</h2>
          <div className="card resume__card">
            {about.skills.map((group) => (
              <div key={group.group} className="resume__skill-row">
                <span className="resume__skill-key mono">{group.group}</span>
                <div className="resume__chips">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="resume__block">
          <h2 className="resume__h2">Certifications</h2>
          <ul className="certs card">
            {certifications.map((cert) => (
              <li key={cert.name} className="certs__row">
                <span className="certs__name">{cert.name}</span>
                <span className={`certs__issuer mono ${cert.pending ? "is-pending" : ""}`}>
                  {cert.issuer}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="resume__block">
          <h2 className="resume__h2">Full document</h2>
          <object className="resume__embed" data={pdf} type="application/pdf" aria-label="Resume PDF">
            <p className="resume__fallback">
              Your browser can't display the PDF inline.{" "}
              <a className="link-accent" href={pdf} download>
                Download it instead
              </a>
              .
            </p>
          </object>
        </section>

        <p className="resume__contact">
          Questions?{" "}
          <a className="link-accent" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </p>
      </div>
    </main>
  );
}

export default ResumeNew;
