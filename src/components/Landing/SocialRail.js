import React from "react";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { profile } from "../../data/content";

/**
 * Social rail pinned to the left edge, anchored at the bottom with a hairline
 * running to the floor.
 *
 * CSS hides it below 1280px: narrower than that and the rail would sit on top
 * of the content column. The same links live in the footer, so nothing is lost
 * when it's hidden.
 */
const LINKS = [
  { href: profile.links.github, label: "GitHub", Icon: AiFillGithub, external: true },
  { href: profile.links.linkedin, label: "LinkedIn", Icon: FaLinkedinIn, external: true },
  { href: profile.links.x, label: "X", Icon: FaXTwitter, external: true },
  { href: `mailto:${profile.email}`, label: "Email", Icon: AiOutlineMail, external: false },
];

function SocialRail() {
  return (
    <div className="rail" aria-label="Social links">
      {LINKS.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          className="rail__link"
          aria-label={label}
          title={label}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
      <span className="rail__line" aria-hidden="true" />
    </div>
  );
}

export default SocialRail;
