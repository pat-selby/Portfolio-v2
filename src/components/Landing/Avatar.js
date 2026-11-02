import React, { Suspense, lazy } from "react";

// three.js is large, so the 3D avatar loads in its own chunk after the page.
const Avatar3D = lazy(() => import("./Avatar3D"));

/**
 * The site's avatar. Holds its space with a soft placeholder while the 3D
 * code and model load, so nothing on the page jumps when it appears.
 *
 * `variant`: "wave" (hero, chooser) or "bye" (contact). `poke`: bump it to
 * play the next gesture.
 */
function Avatar({ variant = "wave", poke = 0, alt, className = "" }) {
  const fallback = <div className={`av3d av3d--${variant} ${className}`} role="img" aria-label={alt} />;

  return (
    <Suspense fallback={fallback}>
      <Avatar3D variant={variant} poke={poke} alt={alt} className={className} />
    </Suspense>
  );
}

export default Avatar;
