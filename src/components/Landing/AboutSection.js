import React from "react";
import { about, education, certifications, affiliations } from "../../data/content";
import aboutAvatar from "../../Assets/about_avatar.webp";
import useReveal from "./useReveal";

function AboutSection() {
  const [ref, cls] = useReveal();

  return (
    <section className="section" id="about" ref={ref}>
      <div className={`shell ${cls}`}>
        <p className="section-label mono">## about</p>
        <h2 className="section-title">A little about me</h2>

        <div className="about__grid">
          <div className="about__left">
            <img className="about__photo" src={aboutAvatar} alt="Patrick Ennin Selby" />
            {about.bio.map((para) => (
              <p key={para} className="about__para">
                {para}
              </p>
            ))}

          </div>

          <div className="about__right">
            <p className="about__eyebrow mono">things I can do</p>
            <div className="skills">
              {about.skills.map((group) => (
                <div key={group.group} className="skills__cell">
                  <h3 className="skills__title">{group.group}</h3>
                  <div className="skills__chips">
                    {group.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="about__eyebrow mono">education</p>
            <div className="card edu">
              <h3 className="edu__school">{education.school}</h3>
              <p className="edu__degree">
                {education.degree} <span className="edu__sep">·</span> {education.detail}
              </p>
              <p className="edu__dates mono">{education.dates}</p>
              <div className="edu__chips">
                {education.coursework.map((course) => (
                  <span key={course} className="chip">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <p className="about__eyebrow mono">certifications</p>
            <ul className="certs card">
              {certifications.map((cert) => (
                <li key={cert.name} className="certs__row">
                  {/* Every credential links to its own proof; anything without a
                      verifiable URL stays plain text rather than a dead link. */}
                  {cert.href ? (
                    <a
                      className="certs__name certs__name--link"
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cert.name}
                      <span className="certs__verify" aria-hidden="true">
                        &#8599;
                      </span>
                      <span className="sr-only">(opens credential in a new tab)</span>
                    </a>
                  ) : (
                    <span className="certs__name">{cert.name}</span>
                  )}
                  <span className={`certs__issuer mono ${cert.pending ? "is-pending" : ""}`}>
                    {cert.issuer}
                  </span>
                </li>
              ))}
            </ul>

            <p className="about__eyebrow mono">communities</p>
            <div className="about__affiliations">
              {affiliations.map((group) => (
                <span key={group} className="chip">
                  {group}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
