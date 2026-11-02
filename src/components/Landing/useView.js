import { useSearchParams } from "react-router-dom";
import { views } from "../../data/content";

export const VIEW_KEYS = ["general", "cyber", "swe"];

/**
 * The visitor's chosen view lives in the URL (?view=cyber), so a link sent
 * with an application opens straight into the right version of the site.
 * `key` is null until a choice is made; `view` falls back to General.
 */
function useView() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("view");
  const key = VIEW_KEYS.includes(raw) ? raw : null;

  const setView = (next) => {
    const updated = new URLSearchParams(params);
    updated.set("view", next);
    setParams(updated);
  };

  return { key, view: views[key || "general"], setView };
}

export default useView;
