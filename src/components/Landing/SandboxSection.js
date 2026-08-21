import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sandboxes } from "../../data/content";
import scansafeApp from "../../Assets/Projects/scansafe_app.webp";
import riskAssessment from "../../Assets/Projects/risk_assessment.webp";
import incidentResponse from "../../Assets/Projects/incident_response.webp";
import useReveal from "./useReveal";

const IMAGES = {
  "scansafe_app.png": scansafeApp,
  "risk_assessment.png": riskAssessment,
  "incident_response.png": incidentResponse,
};

// Fixed tilts so the shelf looks hand-placed but never reshuffles on re-render.
const TILTS = [-1.6, 1.2, -0.9, 1.7, -1.3, 0.8];

function SandboxSection() {
  const [ref, cls] = useReveal();
  const [filter, setFilter] = useState("All");

  const kinds = useMemo(
    () => ["All", ...Array.from(new Set(sandboxes.map((s) => s.kicker)))],
    []
  );
  const shown = sandboxes.filter((s) => filter === "All" || s.kicker === filter);

  return (
    <section className="section sbx" id="sandbox" ref={ref}>
      <div className={`shell ${cls}`}>
        <div className="sbx__head">
          <div>
            <p className="section-label mono">## sandbox</p>
            <h2 className="section-title">Don't take my word for it</h2>
            <p className="section-sub">
              Playable versions of the logic behind my work. Tap any to open it.
            </p>
          </div>

          <div className="sbx__filters">
            {kinds.map((kind) => (
              <button
                key={kind}
                className={`sbx__filter mono ${filter === kind ? "is-on" : ""}`}
                onClick={() => setFilter(kind)}
              >
                {kind}
              </button>
            ))}
          </div>
        </div>

        <div className="sbx__shelf">
          {shown.map((item, i) => (
            <Link key={item.id} to={item.href} className="sbx__card" style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` }}>
              <span className="sbx__tape" aria-hidden="true" />
              <div className="sbx__media">
                <img src={IMAGES[item.image]} alt={item.title} loading="lazy" />
              </div>
              <div className="sbx__body">
                <div className="sbx__row">
                  <h3 className="sbx__title">{item.title}</h3>
                  <span className="sbx__kind mono">{item.kicker}</span>
                </div>
                <p className="sbx__tagline">{item.blurb}</p>
                <span className="sbx__open mono">
                  Open sandbox <span aria-hidden="true">&#8594;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SandboxSection;
