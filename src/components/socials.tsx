"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

import { profile } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Real brand logos for each place to find Patrick. Instagram appears once its handle is set. */
export function SocialLinks({ size = "md", className }: { size?: "sm" | "md"; className?: string }) {
  const links = [
    { href: `mailto:${profile.email}`, label: "Email", Icon: MdOutlineEmail, tint: "hover:bg-[#0071e3]" },
    { href: profile.github, label: "GitHub", Icon: FaGithub, tint: "hover:bg-[#181717]" },
    { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedinIn, tint: "hover:bg-[#0a66c2]" },
    { href: profile.x, label: "X", Icon: FaXTwitter, tint: "hover:bg-black" },
    ...(profile.instagram
      ? [{ href: profile.instagram, label: "Instagram", Icon: FaInstagram, tint: "hover:bg-[#e1306c]" }]
      : []),
  ];

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {links.map(({ href, label, Icon, tint }) => (
        <a
          key={label}
          href={href}
          {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
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
