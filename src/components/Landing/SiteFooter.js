import React from "react";
import { profile } from "../../data/content";

function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <span className="foot__text mono">
          © {year} Patrick Ennin Selby
          <span className="foot__star" title="Made with Ghana in it" aria-hidden="true">
            ★
          </span>
        </span>
        <div className="foot__links">
          <a href={profile.links.github} className="foot__link mono" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={profile.links.linkedin} className="foot__link mono" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={profile.links.x} className="foot__link mono" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href={`mailto:${profile.email}`} className="foot__link mono">
            Email
          </a>
        </div>
        <span className="foot__text mono">designed &amp; built by Patrick</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
