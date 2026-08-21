import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile } from "../../data/content";
import ThemeToggle from "./ThemeToggle";

const SECTIONS = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "sandbox", label: "sandbox" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    if (!onLanding || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e) => setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onLanding]);

  const href = (id) => (onLanding ? `#${id}` : `/#${id}`);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner shell">
        <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__mark">{profile.initials}</span>
          <span className="nav__handle mono">{profile.handle}</span>
        </Link>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`nav__bar ${open ? "is-open-top" : ""}`} />
          <span className={`nav__bar ${open ? "is-open-mid" : ""}`} />
        </button>

        <nav className={`nav__links ${open ? "is-open" : ""}`}>
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={href(id)}
              className={`nav__link mono ${active === id && onLanding ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link to="/resume" className="nav__link mono" onClick={() => setOpen(false)}>
            resume
          </Link>
          <a
            href={href("contact")}
            className="btn btn-primary nav__cta"
            onClick={() => setOpen(false)}
          >
            Say hi
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Nav;
