import React from "react";
import useReveal from "./useReveal";

/**
 * Photos are picked up straight from src/Assets/SideQuests at build time, so
 * adding one is a file drop with no code change. Filenames carry the caption:
 *   "TMCF - Leadership Institute 2026.jpg" -> label "TMCF", caption the rest.
 */
const FILES = import.meta.glob("../../Assets/SideQuests/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  import: "default",
});

const PHOTOS = Object.entries(FILES)
  .map(([path, src]) => {
    const name = path.split("/").pop().replace(/\.[^.]+$/, "");
    const [label, ...rest] = name.split(" - ");
    return {
      src,
      label: rest.length ? label.trim() : "",
      caption: (rest.length ? rest.join(" - ") : label).trim(),
    };
  })
  .sort((a, b) => a.caption.localeCompare(b.caption));

function Row({ photos, reverse }) {
  // Duplicated so the marquee can loop seamlessly.
  const loop = [...photos, ...photos];

  return (
    <div className={`sq__row ${reverse ? "sq__row--rev" : ""}`}>
      <div className="sq__track" style={{ "--count": photos.length }}>
        {loop.map((photo, i) => (
          <figure className="sq__item" key={`${photo.src}-${i}`}>
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <figcaption className="sq__cap">
              {photo.label && <span className="sq__label mono">{photo.label}</span>}
              <span className="sq__text">{photo.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function SideQuests() {
  const [ref, cls] = useReveal();

  // Nothing to show until photos are added.
  if (PHOTOS.length === 0) return null;

  const half = Math.ceil(PHOTOS.length / 2);
  const top = PHOTOS.slice(0, half);
  const bottom = PHOTOS.length > 3 ? PHOTOS.slice(half) : PHOTOS;

  return (
    <section className="section sq" id="side-quests" ref={ref}>
      <div className={`shell ${cls}`}>
        <p className="section-label mono">## side-quests</p>
        <h2 className="section-title">Beyond the terminal</h2>
        <p className="section-sub">
          Conferences, chapters, and the people I get to learn alongside.
        </p>
      </div>

      <div className="sq__rows">
        <Row photos={top} />
        {bottom.length > 0 && <Row photos={bottom} reverse />}
      </div>

      <div className="shell">
        <p className="sq__hint mono">let them roll by, or hover to pause</p>
      </div>
    </section>
  );
}

export default SideQuests;
