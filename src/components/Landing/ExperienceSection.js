import React, { useState } from "react";
import { experience } from "../../data/content";
import aiotLab from "../../Assets/aiot_lab.webp";
import codepathLogo from "../../Assets/codepath_logo.webp";
import iotExternship from "../../Assets/iot_externship.webp";
import useReveal from "./useReveal";

const LOGOS = {
  "aiot_lab.png": aiotLab,
  "codepath_logo.png": codepathLogo,
  "iot_externship.png": iotExternship,
};

// Initials for entries with no logo art, so the row never renders a broken image.
const monogram = (name) =>
  name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

function ExperienceRow({ item, open, onToggle }) {
  const logo = LOGOS[item.logo];

  return (
    <div className={`xp ${open ? "is-open" : ""}`}>
      <button className="xp__head" onClick={onToggle} aria-expanded={open}>
        {logo ? (
          <img className="xp__logo" src={logo} alt="" />
        ) : (
          <span className="xp__logo xp__logo--mark mono" aria-hidden="true">
            {monogram(item.org)}
          </span>
        )}

        <span className="xp__ident">
          <span className="xp__org">
            {item.org}
            {item.current && <span className="xp__now mono">now</span>}
            {item.concept && <span className="xp__concept mono">concept</span>}
          </span>
          <span className="xp__role mono">{item.role}</span>
        </span>

        <span className="xp__dates mono">{item.dates}</span>
        <span className="xp__toggle" aria-hidden="true">
          {open ? "×" : "+"}
        </span>
      </button>

      {open && (
        <div className="xp__body">
          <p className="xp__team mono">{item.team}</p>
          <ul className="xp__bullets">
            {item.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="xp__tools">
            {item.tools.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExperienceSection() {
  const [openId, setOpenId] = useState(experience[0].role);
  const [ref, cls] = useReveal();

  return (
    <section className="section" id="experience" ref={ref}>
      <div className={`shell ${cls}`}>
        <p className="section-label mono">## experience</p>
        <h2 className="section-title">Where I've worked</h2>
        <p className="section-sub">Research, fellowships, and hands-on security work.</p>

        <div className="xp__list">
          {experience.map((item) => (
            <ExperienceRow
              key={item.role}
              item={item}
              open={openId === item.role}
              onToggle={() => setOpenId(openId === item.role ? null : item.role)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
