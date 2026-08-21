import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// The browser restores the previous scroll offset on reload, which fights any
// anchor in the URL. Own the scroll position instead.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Resets scroll on route change, but defers to an anchor when the URL has one.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    // Wait a frame so the target section is mounted and laid out before we aim.
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo(0, 0);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
