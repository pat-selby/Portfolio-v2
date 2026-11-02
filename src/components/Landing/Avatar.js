import React from "react";
import wave from "../../Assets/avatar/wave.svg";
import bye from "../../Assets/avatar/bye.svg";

/**
 * DiceBear "Avataaars" portrait. The SVGs are generated ahead of time by
 * scripts/make-avatars.mjs, so the page loads two small files rather than the
 * DiceBear runtime.
 *
 * `variant` picks the expression: "wave" smiles, "bye" winks.
 */
const SOURCES = { wave, bye };

function Avatar({ variant = "wave", alt, className = "" }) {
  return <img className={`dice dice--${variant} ${className}`} src={SOURCES[variant]} alt={alt} />;
}

export default Avatar;
