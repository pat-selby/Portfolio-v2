import React, { useEffect, useState } from "react";

const STORAGE_KEY = "pes-theme";

function currentTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") || "light";
}

function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);

  // Follow the OS until the visitor picks a side themselves.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const next = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      /* private mode, so the choice just won't persist */
    }
    setTheme(next);
  };

  const dark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
    </button>
  );
}

export default ThemeToggle;
