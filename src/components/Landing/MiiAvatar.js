import React from "react";

/**
 * Mii-style vector avatar.
 *
 * Inline SVG rather than a rendered image for one structural reason: the hands
 * float free of the body, so there is no joint to tear open when a limb moves.
 * The previous layered-PNG avatar cut a forearm out of a flat render and hinged
 * it at the elbow, which exposed bare background whenever it swung far enough.
 *
 * Proportions follow the reference: the torso is deliberately narrower than the
 * head so the ball hands clear the silhouette and stay readable, and the
 * sandals are light against a light page so the feet don't disappear.
 *
 * `variant` picks the pose: "wave" raises one hand, "bye" raises both.
 */

const SKIN = "#7A4B2A";
const SKIN_HI = "#9C6540";
const SKIN_LO = "#5B3520";

// Torso spans the head's full width; a narrow torso reads as a scarecrow.
const T_TOP = 160;
const T_BOT = 322;
const KENTE = ["#E0A82E", "#14100D", "#1E7A4C", "#C1272D", "#E0A82E", "#14100D", "#1E7A4C"];
const BAND_H = (T_BOT - T_TOP) / KENTE.length;

function Hand({ className, cx, cy, r = 27 }) {
  return (
    <g className={className}>
      <circle cx={cx} cy={cy} r={r} fill="url(#mii-skin)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={SKIN_LO} strokeWidth="1.5" opacity="0.5" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.32} r={r * 0.34} fill={SKIN_HI} opacity="0.6" />
    </g>
  );
}

function Foot({ x }) {
  // Sole + strap. Light leather so the feet stay visible on a near-white page.
  return (
    <g>
      <rect x={x} y="396" width="62" height="30" rx="14" fill="#C89B6A" />
      <rect x={x} y="396" width="62" height="30" rx="14" fill="none" stroke="#8B5A2B" strokeWidth="2.5" />
      <rect x={x + 8} y="402" width="46" height="7" rx="3.5" fill="#E0A82E" />
      <rect x={x + 8} y="413" width="46" height="5" rx="2.5" fill="#8B5A2B" opacity="0.7" />
    </g>
  );
}

function MiiAvatar({ variant = "wave", alt, className = "" }) {
  const bye = variant === "bye";

  return (
    <svg
      className={`mii mii--${variant} ${className}`}
      viewBox="0 0 520 460"
      role="img"
      aria-label={alt}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Off-centre radial light is what sells the soft matte-plastic look. */}
        <radialGradient id="mii-skin" cx="34%" cy="26%" r="80%">
          <stop offset="0%" stopColor={SKIN_HI} />
          <stop offset="60%" stopColor={SKIN} />
          <stop offset="100%" stopColor={SKIN_LO} />
        </radialGradient>

        <radialGradient id="mii-hair" cx="34%" cy="22%" r="78%">
          <stop offset="0%" stopColor="#3E312A" />
          <stop offset="58%" stopColor="#17120F" />
          <stop offset="100%" stopColor="#0A0807" />
        </radialGradient>

        <radialGradient id="mii-trouser" cx="34%" cy="20%" r="84%">
          <stop offset="0%" stopColor="#41506E" />
          <stop offset="100%" stopColor="#232C3A" />
        </radialGradient>

        <linearGradient id="mii-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>

        <clipPath id="mii-torso-clip">
          <path d="M157 206c0-30 34-46 78-46s78 16 78 46v86c0 18-14 30-32 30H189c-18 0-32-12-32-30z" />
        </clipPath>

        <filter id="mii-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <ellipse
        className="mii__shadow"
        cx="235"
        cy="440"
        rx="92"
        ry="13"
        fill="#101319"
        opacity="0.2"
        filter="url(#mii-shadow)"
      />

      <g className="mii__figure">
        {/* ---- legs and sandals ---- */}
        <g className="mii__legs">
          <rect x="190" y="312" width="40" height="92" rx="19" fill="url(#mii-trouser)" />
          <rect x="240" y="312" width="40" height="92" rx="19" fill="url(#mii-trouser)" />
          <Foot x="176" />
          <Foot x="226" />
        </g>

        {/* ---- torso in kente ---- */}
        <g className="mii__torso">
          <g clipPath="url(#mii-torso-clip)">
            {KENTE.map((c, i) => (
              <rect key={i} x="150" y={T_TOP + i * BAND_H} width="176" height={BAND_H + 0.5} fill={c} />
            ))}
            {/* Vertical warp threads: what reads as "woven" rather than "striped". */}
            {[172, 196, 220, 244, 268, 292].map((x) => (
              <rect key={x} x={x} y={T_TOP} width="6" height="170" fill="#14100D" opacity="0.32" />
            ))}
            {[184, 235, 286].map((x) => (
              <rect key={x} x={x} y={T_TOP} width="4" height="170" fill="#E0A82E" opacity="0.6" />
            ))}
            <rect x="150" y={T_TOP} width="176" height="170" fill="url(#mii-sheen)" />
          </g>
          <path
            d="M157 206c0-30 34-46 78-46s78 16 78 46v86c0 18-14 30-32 30H189c-18 0-32-12-32-30z"
            fill="none"
            stroke="#0E1116"
            strokeWidth="2"
            opacity="0.25"
          />
          <path d="M220 162h30l-15 26z" fill="#0E1116" opacity="0.5" />
        </g>

        {/* ---- head ---- */}
        <g className="mii__head">
          <ellipse cx="153" cy="108" rx="12" ry="16" fill={SKIN} />
          <ellipse cx="317" cy="108" rx="12" ry="16" fill={SKIN} />
          <ellipse cx="235" cy="100" rx="80" ry="74" fill="url(#mii-skin)" />
          <path
            d="M155 106c0-62 36-90 80-90s80 28 80 90c-16-28-43-39-80-39s-64 11-80 39z"
            fill="url(#mii-hair)"
          />
          <path d="M189 82q15-9 30 0" stroke="#241A14" strokeWidth="7.5" strokeLinecap="round" fill="none" />
          <path d="M251 82q15-9 30 0" stroke="#241A14" strokeWidth="7.5" strokeLinecap="round" fill="none" />

          <g className="mii__eyes">
            <ellipse cx="204" cy="108" rx="11" ry="14" fill="#140F0C" />
            <ellipse cx="266" cy="108" rx="11" ry="14" fill="#140F0C" />
            <circle cx="208" cy="103" r="3.8" fill="#fff" opacity="0.92" />
            <circle cx="270" cy="103" r="3.8" fill="#fff" opacity="0.92" />
          </g>

          <ellipse cx="235" cy="126" rx="7.5" ry="5.5" fill={SKIN_LO} opacity="0.5" />
          <path d="M217 141q18 18 36 0" stroke="#2E1B12" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>

        {/* ---- floating hands, clear of the torso silhouette ---- */}
        {bye ? (
          <>
            <Hand className="mii__hand mii__hand--bye-l" cx="108" cy="150" />
            <Hand className="mii__hand mii__hand--bye-r" cx="362" cy="150" />
          </>
        ) : (
          <>
            <Hand className="mii__hand mii__hand--rest" cx="146" cy="296" />
            <Hand className="mii__hand mii__hand--wave" cx="382" cy="146" />
          </>
        )}
      </g>
    </svg>
  );
}

export default MiiAvatar;
