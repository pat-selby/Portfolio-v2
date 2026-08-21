import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../../data/content";
import scansafeApp from "../../Assets/Projects/scansafe_app.webp";
import uniqr from "../../Assets/Projects/uniqr.webp";
import riskAssessment from "../../Assets/Projects/risk_assessment.webp";
import incidentResponse from "../../Assets/Projects/incident_response.webp";

const IMAGES = {
  "scansafe_app.png": scansafeApp,
  "uniqr.png": uniqr,
  "risk_assessment.png": riskAssessment,
  "incident_response.png": incidentResponse,
};

const PIN_BREAKPOINT = 900;
const pad = (n) => String(n).padStart(2, "0");

/**
 * Vertical scroll drives horizontal movement: a tall runway holds a sticky
 * stage, and scroll progress through the runway translates the slide track.
 * Below PIN_BREAKPOINT the pinning is dropped and slides stack normally, so
 * phones keep ordinary scrolling.
 */
function ProjectsSection() {
  const runwayRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(
    typeof window === "undefined" ? true : window.innerWidth >= PIN_BREAKPOINT
  );
  const count = projects.length;

  useEffect(() => {
    const onResize = () => setPinned(window.innerWidth >= PIN_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const update = useCallback(() => {
    const runway = runwayRef.current;
    const track = trackRef.current;
    if (!runway || !track || !pinned) return;

    const travel = runway.offsetHeight - window.innerHeight;
    const scrolled = -runway.getBoundingClientRect().top;
    const p = travel > 0 ? Math.min(Math.max(scrolled / travel, 0), 1) : 0;

    track.style.transform = `translate3d(${-p * (count - 1) * 100}%, 0, 0)`;

    // Each slide tilts away from the viewer in proportion to how far it is
    // from centre, so moving sideways reads as turning a drum rather than
    // sliding a filmstrip.
    const head = p * (count - 1);
    for (let i = 0; i < track.children.length; i += 1) {
      const slide = track.children[i];
      const offset = i - head;
      const dist = Math.min(Math.abs(offset), 2);
      const rotate = Math.max(Math.min(offset * -30, 60), -60);
      const depth = dist * 240;
      const scale = 1 - dist * 0.06;
      slide.style.transform = `rotateY(${rotate}deg) translateZ(${-depth}px) scale(${scale})`;
      // 0.14 is the value the reference uses for its off-centre cells.
      slide.style.opacity = `${Math.max(1 - dist * 0.86, 0.14)}`;
      // Only the front slide should take clicks.
      slide.style.pointerEvents = dist < 0.5 ? "auto" : "none";
      // 3D-transformed children inside preserve-3d aren't reliably hit-tested,
      // so the hover reveal keys off this flag plus a hover on the stage
      // rather than :hover on the slide itself.
      slide.classList.toggle("is-active", dist < 0.5);
    }

    setIndex(Math.round(head));
  }, [count, pinned]);

  useEffect(() => {
    if (!pinned) {
      // Unpinned (phones): drop every inline transform so the slides stack as
      // plain flow content.
      const track = trackRef.current;
      if (track) {
        track.style.transform = "";
        for (const slide of track.children) {
          slide.style.transform = "";
          slide.style.opacity = "";
          slide.style.pointerEvents = "";
        }
      }
      setIndex(0);
      return undefined;
    }
    let frame = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, update]);

  // Horizontal input (trackpad swipe, shift+wheel, drag) maps onto the runway,
  // so sideways gestures move the slides just like scrolling down does.
  useEffect(() => {
    const stage = stageRef.current;
    const runway = runwayRef.current;
    if (!stage || !runway || !pinned) return undefined;

    // How much vertical scroll equals one pixel of sideways intent.
    const ratio = () => {
      const travel = runway.offsetHeight - window.innerHeight;
      const span = stage.clientWidth * Math.max(count - 1, 1);
      return span > 0 ? travel / span : 0;
    };

    const onWheel = (e) => {
      const dx = e.shiftKey ? e.deltaY : e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return;
      e.preventDefault();
      window.scrollBy({ top: dx * ratio(), behavior: "instant" });
    };

    let dragging = false;
    let lastX = 0;
    const down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      stage.setPointerCapture?.(e.pointerId);
      stage.classList.add("is-dragging");
    };
    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      window.scrollBy({ top: -dx * ratio(), behavior: "instant" });
    };
    const up = (e) => {
      dragging = false;
      stage.releasePointerCapture?.(e.pointerId);
      stage.classList.remove("is-dragging");
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
    };
  }, [count, pinned]);

  // Clicking a dot scrolls to that slide's position in the runway.
  const goTo = (i) => {
    const runway = runwayRef.current;
    if (!runway || !pinned) return;
    const travel = runway.offsetHeight - window.innerHeight;
    const target = runway.offsetTop + (travel * i) / Math.max(count - 1, 1);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section className="section pj" id="projects">
      <div className="shell">
        <p className="section-label mono">## projects</p>
        <h2 className="section-title">Some things I've built</h2>
        <p className="section-sub">
          Research tools and security labs, each with the reasoning behind it.
        </p>
      </div>

      <div
        className={`pj__runway ${pinned ? "is-pinned" : ""}`}
        ref={runwayRef}
        style={pinned ? { height: `${count * 100 + 40}vh` } : undefined}
      >
        <div className="pj__stage" ref={stageRef}>
          <div className="pj__track" ref={trackRef}>
            {projects.map((project, i) => (
              <article className="pj__slide" key={project.id}>
                <div className="pj__media">
                  <img src={IMAGES[project.image]} alt={project.title} loading="lazy" />
                  {/* Discoverability for the hover-revealed write-up. Hidden
                      once the card is showing, and on touch where it's moot. */}
                  <span className="pj__hover-hint mono" aria-hidden="true">
                    hover for details
                  </span>
                </div>

                <div className="pj__card">
                  <p className="pj__meta mono">
                    <span className="pj__counter">
                      {pad(i + 1)} <span className="pj__slash">/</span> {pad(count)}
                    </span>
                    <span className="pj__tag">{project.tags[0]}</span>
                  </p>

                  <h3 className="pj__title">{project.title}</h3>
                  <p className="pj__subtitle">{project.subtitle}</p>
                  <p className="pj__summary">{project.summary}</p>

                  <p className="pj__outcome mono">
                    <span className="pj__outcome-key">outcome</span>
                    {project.outcome}
                  </p>

                  {/* Skipped entirely when empty, so the row's margin does not
                      leave a gap under projects that have nothing to link to. */}
                  {project.links.length > 0 && (
                    <div className="pj__links">
                      {project.links.map((link) =>
                        link.internal ? (
                          <Link key={link.label} to={link.href} className="pj__link mono">
                            {link.label} <span aria-hidden="true">&#8594;</span>
                          </Link>
                        ) : (
                          <a
                            key={link.label}
                            href={link.href}
                            className="pj__link mono"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label} <span aria-hidden="true">&#8599;</span>
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {pinned && (
            <div className="pj__progress mono">
              <span className="pj__progress-count">
                {pad(index + 1)} <span className="pj__slash">/</span> {pad(count)}
              </span>
              <span className="pj__dots">
                {projects.map((project, i) => (
                  <button
                    key={project.id}
                    className={`pj__dot ${i === index ? "is-on" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to ${project.title}`}
                  />
                ))}
              </span>
              <span className="pj__progress-hint">
                keep scrolling <span aria-hidden="true">&#8595;</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
