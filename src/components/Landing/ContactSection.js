import React from "react";
import { profile } from "../../data/content";
import MiiAvatar from "./MiiAvatar";
import useReveal from "./useReveal";

const ROWS = [
  { label: "Email", text: profile.email, href: `mailto:${profile.email}` },
  {
    label: "GitHub",
    text: "github.com/pat-selby",
    href: profile.links.github,
    external: true,
  },
  {
    label: "LinkedIn",
    text: "linkedin.com/in/patrick-ennin-selby",
    href: profile.links.linkedin,
    external: true,
  },
  { label: "X", text: "@selby_patrick05", href: profile.links.x, external: true },
];

function ContactSection() {
  const [ref, cls] = useReveal();

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className={`shell ${cls}`}>
        <div className="contact__avatar">
          <MiiAvatar variant="bye" alt="Avatar of Patrick waving goodbye" />
        </div>

        <p className="section-label mono">## say-hi</p>
        <h2 className="section-title contact__title">Thank you for making it this far.</h2>

        <p className="section-sub contact__lede">
          You just walked through everything I've built, broken, and learned so far: the research,
          the labs, the late nights. That means a lot, and I don't take it for granted.
        </p>
        <p className="section-sub contact__lede">
          My inbox is always open, whether it's a question, a role, or just a hello. Until then,
          <strong className="contact__soon"> meet you soon.</strong>
        </p>

        <a href={`mailto:${profile.email}`} className="btn btn-primary contact__cta">
          <span aria-hidden="true">&#8594;</span> {profile.email}
        </a>

        <dl className="contact__rows">
          {ROWS.map((row) => (
            <div key={row.label} className="contact__row">
              <dt className="contact__key">{row.label}</dt>
              <dd className="contact__val">
                <a
                  href={row.href}
                  className="link-accent"
                  {...(row.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {row.text}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default ContactSection;
