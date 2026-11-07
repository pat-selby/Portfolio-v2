"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

import { profile } from "@/lib/content";
import { cn } from "@/lib/utils";

function socialLinks() {
  return [
    { href: `mailto:${profile.email}`, label: "Email", Icon: MdOutlineEmail, tint: "hover:bg-[#0071e3]" },
    { href: profile.github, label: "GitHub", Icon: FaGithub, tint: "hover:bg-[#181717]" },
    { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedinIn, tint: "hover:bg-[#0a66c2]" },
    { href: profile.x, label: "X", Icon: FaXTwitter, tint: "hover:bg-black" },
    ...(profile.instagram
      ? [{ href: profile.instagram, label: "Instagram", Icon: FaInstagram, tint: "hover:bg-[#e1306c]" }]
      : []),
  ];
}

const external = (href: string) => (href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" });

/** Real brand logos for each place to find Patrick. Instagram appears once its handle is set. */
export function SocialLinks({ size = "md", className }: { size?: "sm" | "md"; className?: string }) {
  const links = socialLinks();

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {links.map(({ href, label, Icon, tint }) => (
        <a
          key={label}
          href={href}
          {...external(href)}
          aria-label={label}
          className={cn(
            "group inline-flex items-center gap-2 rounded-full border border-border bg-white font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-lg",
            size === "md" ? "h-12 px-5 text-[15px]" : "h-9 px-3 text-sm",
            tint
          )}
        >
          <Icon className={cn("transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110", size === "md" ? "size-5" : "size-4")} />
          {size === "md" && <span>{label}</span>}
        </a>
      ))}
    </div>
  );
}

/** Types text out once on load. The server sends the full text, so it is never missing. */
export function Typewriter({ text, className, speed = 55 }: { text: string; className?: string; speed?: number }) {
  const [shown, setShown] = useState(text.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      <span
        aria-hidden="true"
        className={cn("ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-primary align-baseline", shown >= text.length ? "animate-pulse" : "")}
      />
    </span>
  );
}

/**
 * Links that follow you down the page: a vertical rail on the left on wide
 * screens, a pill at the bottom on phones. It appears once you scroll past
 * the hero and steps aside at the closing section, where the big buttons are.
 */
export function FloatingSocials() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let atContact = false;
    const update = () => setShow(pastHero && !atContact);

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.6;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contact");
    const io = new IntersectionObserver(([entry]) => {
      atContact = entry.isIntersecting;
      update();
    });
    if (contact) io.observe(contact);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const links = socialLinks();
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Find me online"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className={cn(
            "fixed z-40 flex gap-1.5 rounded-full border border-black/5 bg-white/80 p-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl",
            // Phones: a pill centered at the bottom. Wide screens: a rail on the left.
            "bottom-4 left-1/2 -translate-x-1/2 flex-row",
            "lg:top-1/2 lg:bottom-auto lg:left-5 lg:-translate-x-0 lg:-translate-y-1/2 lg:flex-col"
          )}
        >
          {links.map(({ href, label, Icon, tint }) => (
            <a
              key={label}
              href={href}
              {...external(href)}
              aria-label={label}
              title={label}
              className={cn(
                "group grid size-10 place-items-center rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:text-white",
                tint
              )}
            >
              <Icon className="size-[18px] transition-transform duration-300 group-hover:rotate-[-8deg]" />
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
