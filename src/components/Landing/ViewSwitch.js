import React from "react";
import { views } from "../../data/content";
import useView, { VIEW_KEYS } from "./useView";

/** Segmented control for changing views after the first choice. */
function ViewSwitch({ className = "" }) {
  const { key, setView } = useView();
  const current = key || "general";

  return (
    <div className={`vswitch ${className}`} role="group" aria-label="Choose which side of Patrick to see">
      <span className="vswitch__label mono">viewing as</span>
      {VIEW_KEYS.map((k) => (
        <button
          key={k}
          type="button"
          className={`vswitch__btn mono ${current === k ? "is-on" : ""}`}
          aria-pressed={current === k}
          onClick={() => setView(k)}
        >
          {views[k].label}
        </button>
      ))}
    </div>
  );
}

export default ViewSwitch;
