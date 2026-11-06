import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Animated 3D "mini Patrick", built from primitives so it can be styled after
 * his headshot (deep brown skin, short black hair, smile, black blazer over a
 * navy shirt, blue lapel pin) without any model file.
 *
 * Poses are computed every frame: an idle layer (breathing, sway, blinking,
 * head following the pointer) plus at most one gesture blended on top.
 * It waves on arrival and plays the next gesture whenever `poke` changes.
 * The "bye" variant waves on a timer.
 */
const COLORS = {
  skin: "#5e3a26",
  skinShade: "#4e2f1f",
  hair: "#141011",
  blazer: "#222228",
  lapel: "#2e2e35",
  shirt: "#22345c",
  trousers: "#16161a",
  shoes: "#0d0d0f",
  eyeWhite: "#f4f1ec",
  iris: "#1b100b",
  lips: "#3b1d14",
  teeth: "#fbfaf7",
  pin: "#2b5cc0",
  gold: "#c9a24a",
};

const GESTURES = ["wave", "thumbs", "nod"];
const DURATION = { wave: 2.4, thumbs: 2.0, nod: 1.4 };

const smooth = (x) => x * x * (3 - 2 * x);

// Fades a gesture in and out over its duration.
const envelope = (t, dur, edge = 0.35) =>
  smooth(THREE.MathUtils.clamp(Math.min(t / edge, (dur - t) / edge), 0, 1));

function buildFigure(track) {
  const mat = (color, roughness = 0.6) => track(new THREE.MeshStandardMaterial({ color, roughness }));
  const geo = (g) => track(g);
  const mesh = (g, m) => new THREE.Mesh(geo(g), m);

  const m = {
    skin: mat(COLORS.skin, 0.55),
    skinShade: mat(COLORS.skinShade, 0.6),
    hair: mat(COLORS.hair, 0.95),
    blazer: mat(COLORS.blazer, 0.7),
    lapel: mat(COLORS.lapel, 0.55),
    shirt: mat(COLORS.shirt, 0.65),
    trousers: mat(COLORS.trousers, 0.8),
    shoes: mat(COLORS.shoes, 0.4),
    eyeWhite: mat(COLORS.eyeWhite, 0.3),
    iris: mat(COLORS.iris, 0.2),
    lips: mat(COLORS.lips, 0.5),
    teeth: mat(COLORS.teeth, 0.3),
    pin: mat(COLORS.pin, 0.35),
    gold: mat(COLORS.gold, 0.3),
  };

  const root = new THREE.Group();

  // Soft contact shadow.
  const shadow = mesh(
    new THREE.CircleGeometry(1.15, 32),
    track(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 }))
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  root.add(shadow);

  const body = new THREE.Group();
  root.add(body);

  // Legs and shoes.
  [-0.36, 0.36].forEach((x) => {
    const leg = mesh(new THREE.CapsuleGeometry(0.3, 0.75, 6, 16), m.trousers);
    leg.position.set(x, 0.78, 0);
    body.add(leg);
    const shoe = mesh(new THREE.CapsuleGeometry(0.22, 0.35, 6, 16), m.shoes);
    shoe.rotation.x = Math.PI / 2;
    shoe.position.set(x, 0.2, 0.12);
    body.add(shoe);
  });

  // Torso: black blazer, with the navy shirt showing in a V.
  const torso = new THREE.Group();
  torso.position.y = 1.45;
  body.add(torso);

  const jacket = mesh(new THREE.CapsuleGeometry(0.88, 1.0, 8, 24), m.blazer);
  jacket.scale.set(1, 1, 0.74);
  jacket.position.y = 0.85;
  torso.add(jacket);

  const vShape = new THREE.Shape();
  vShape.moveTo(-0.4, 1.68);
  vShape.lineTo(0.4, 1.68);
  vShape.lineTo(0, 0.55);
  vShape.closePath();
  const shirt = mesh(new THREE.ExtrudeGeometry(vShape, { depth: 0.2, bevelEnabled: false }), m.shirt);
  shirt.position.z = 0.5;
  torso.add(shirt);

  // Lapels trace the V; the shirt collar sits at its top.
  [-1, 1].forEach((side) => {
    const len = Math.hypot(0.4, 1.13);
    const lapel = mesh(new THREE.BoxGeometry(0.16, len, 0.05), m.lapel);
    lapel.position.set(side * 0.24, 1.11, 0.72);
    lapel.rotation.z = side * Math.atan2(0.4, 1.13);
    torso.add(lapel);
    const collar = mesh(new THREE.BoxGeometry(0.3, 0.14, 0.06), m.shirt);
    collar.position.set(side * 0.2, 1.72, 0.66);
    collar.rotation.z = side * -0.5;
    torso.add(collar);
  });
  [1.25, 0.95].forEach((y) => {
    const button = mesh(new THREE.SphereGeometry(0.035, 10, 10), m.blazer);
    button.position.set(0, y, 0.72);
    torso.add(button);
  });

  // The blue pin on his lapel, and a small gold one opposite.
  const pin = mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 20), m.pin);
  pin.rotation.x = Math.PI / 2;
  pin.position.set(0.5, 1.2, 0.56);
  torso.add(pin);
  const pinRim = mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 24), m.eyeWhite);
  pinRim.position.set(0.5, 1.2, 0.575);
  torso.add(pinRim);
  const goldPin = mesh(new THREE.SphereGeometry(0.04, 10, 10), m.gold);
  goldPin.position.set(-0.55, 1.45, 0.5);
  torso.add(goldPin);

  // Arms: shoulder and elbow pivots so gestures can bend them.
  const makeArm = (side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.98, 1.55, 0);
    torso.add(shoulder);
    const upper = mesh(new THREE.CapsuleGeometry(0.24, 0.55, 6, 16), m.blazer);
    upper.position.y = -0.42;
    shoulder.add(upper);
    const elbow = new THREE.Group();
    elbow.position.y = -0.82;
    shoulder.add(elbow);
    const fore = mesh(new THREE.CapsuleGeometry(0.22, 0.5, 6, 16), m.blazer);
    fore.position.y = -0.36;
    elbow.add(fore);
    const hand = mesh(new THREE.SphereGeometry(0.22, 20, 16), m.skin);
    hand.position.y = -0.78;
    elbow.add(hand);
    const thumb = mesh(new THREE.CapsuleGeometry(0.07, 0.16, 4, 10), m.skin);
    thumb.position.set(-side * 0.02, -0.56, 0.12);
    thumb.visible = false;
    elbow.add(thumb);
    return { shoulder, elbow, thumb };
  };
  // Character's right arm is on the viewer's left (-x).
  const armR = makeArm(-1);
  const armL = makeArm(1);

  const neck = mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.4, 16), m.skin);
  neck.position.y = 1.95;
  torso.add(neck);

  // Head pivots at the neck so nods and look-at turn it naturally.
  const head = new THREE.Group();
  head.position.y = 2.05;
  torso.add(head);

  const skull = mesh(new THREE.SphereGeometry(1, 40, 32), m.skin);
  skull.scale.set(0.95, 1.05, 0.92);
  skull.position.y = 1.0;
  head.add(skull);

  // Short, close-cropped hair: a cap tilted back so the forehead shows.
  const hair = mesh(new THREE.SphereGeometry(1.04, 40, 24, 0, Math.PI * 2, 0, 1.2), m.hair);
  hair.scale.set(0.97, 1.06, 0.95);
  hair.position.y = 1.03;
  hair.rotation.x = -0.32;
  head.add(hair);

  [-1, 1].forEach((side) => {
    const ear = mesh(new THREE.SphereGeometry(0.2, 16, 12), m.skin);
    ear.scale.set(0.5, 1, 0.8);
    ear.position.set(side * 0.92, 0.98, 0);
    head.add(ear);
  });

  const eyes = new THREE.Group();
  eyes.position.set(0, 1.08, 0);
  head.add(eyes);
  [-0.32, 0.32].forEach((x) => {
    const white = mesh(new THREE.SphereGeometry(0.15, 20, 16), m.eyeWhite);
    white.scale.set(1.1, 0.8, 0.5);
    white.position.set(x, 0, 0.82);
    eyes.add(white);
    const iris = mesh(new THREE.SphereGeometry(0.085, 16, 12), m.iris);
    iris.position.set(x, -0.01, 0.89);
    eyes.add(iris);
    const glint = mesh(new THREE.SphereGeometry(0.022, 8, 8), m.eyeWhite);
    glint.position.set(x + 0.03, 0.03, 0.97);
    eyes.add(glint);
    const brow = mesh(new THREE.CapsuleGeometry(0.035, 0.2, 4, 8), m.hair);
    brow.rotation.z = Math.PI / 2 + (x < 0 ? -0.08 : 0.08);
    brow.position.set(x, 0.24, 0.84);
    eyes.add(brow);
  });

  const nose = mesh(new THREE.SphereGeometry(0.13, 16, 12), m.skinShade);
  nose.scale.set(1.25, 0.85, 0.8);
  nose.position.set(0, 0.82, 0.9);
  head.add(nose);

  // Smile with teeth showing, like the headshot.
  const teeth = mesh(new THREE.CircleGeometry(0.25, 24, Math.PI, Math.PI), m.teeth);
  teeth.scale.set(1, 0.55, 1);
  teeth.position.set(0, 0.6, 0.83);
  head.add(teeth);
  const lip = mesh(new THREE.TorusGeometry(0.25, 0.035, 8, 24, Math.PI), m.lips);
  lip.rotation.z = Math.PI;
  lip.scale.set(1, 0.55, 1);
  lip.position.set(0, 0.6, 0.835);
  head.add(lip);
  const upperLip = mesh(new THREE.CapsuleGeometry(0.03, 0.42, 4, 8), m.lips);
  upperLip.rotation.z = Math.PI / 2;
  upperLip.position.set(0, 0.61, 0.835);
  head.add(upperLip);

  return { root, body, torso, head, eyes, armR, armL };
}

function Avatar3D({ variant = "wave", poke = 0, alt, className = "" }) {
  const mountRef = useRef(null);
  const playRef = useRef(null);
  const gestureRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const disposables = [];
    const track = (x) => {
      disposables.push(x);
      return x;
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 3.1, 14.5);
    camera.lookAt(0, 2.75, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a4255, 2.0));
    const key = new THREE.DirectionalLight(0xfff4e8, 2.6);
    key.position.set(4, 7, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9db8ff, 3.2);
    rim.position.set(-6, 5, -5);
    // A second rim from the other side so the dark blazer reads on dark pages.
    const rim2 = new THREE.DirectionalLight(0xffd9b0, 1.6);
    rim2.position.set(6, 3, -5);
    scene.add(rim2);
    scene.add(rim);

    const fig = buildFigure(track);
    scene.add(fig.root);

    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    const look = new THREE.Vector2();
    let gesture = null; // { name, start }
    let nextBlink = 1.5;
    let frame = null;
    let visible = true;
    let byeTimer = null;

    const play = (name) => {
      gesture = { name, start: clock.elapsedTime };
    };
    playRef.current = play;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const onPointer = (e) => {
      const r = mount.getBoundingClientRect();
      pointer.set(
        THREE.MathUtils.clamp(((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2, -1, 1),
        THREE.MathUtils.clamp(((e.clientY - (r.top + r.height * 0.3)) / window.innerHeight) * 2, -1, 1)
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const pose = (t) => {
      const { torso, head, eyes, armR, armL, body } = fig;

      // Idle layer.
      torso.scale.y = 1 + 0.012 * Math.sin(t * 2.1);
      body.rotation.z = 0.025 * Math.sin(t * 0.9);
      armR.shoulder.rotation.set(0, 0, -0.12 - 0.03 * Math.sin(t * 1.3));
      armL.shoulder.rotation.set(0, 0, 0.12 + 0.03 * Math.sin(t * 1.3 + 1));
      armR.elbow.rotation.set(0.12, 0, 0);
      armL.elbow.rotation.set(0.12, 0, 0);
      armR.thumb.visible = false;

      look.lerp(pointer, 0.08);
      head.rotation.set(look.y * 0.22, look.x * 0.5, 0.03 * Math.sin(t * 0.7));

      // Blink every few seconds.
      if (t > nextBlink) nextBlink = t + 2.5 + Math.random() * 3;
      const blinkPhase = nextBlink - t;
      eyes.scale.y = blinkPhase < 0.12 ? 0.15 : 1;

      // Gesture layer.
      if (!gesture) return;
      const gt = t - gesture.start;
      const dur = DURATION[gesture.name];
      if (gt > dur) {
        gesture = null;
        return;
      }
      const e = envelope(gt, dur);
      if (gesture.name === "wave") {
        armR.shoulder.rotation.z = THREE.MathUtils.lerp(armR.shoulder.rotation.z, -2.55, e);
        armR.elbow.rotation.z = e * (0.25 + 0.45 * Math.sin(gt * 11));
        armR.elbow.rotation.x = THREE.MathUtils.lerp(0.12, 0, e);
        head.rotation.z += e * 0.08;
      } else if (gesture.name === "thumbs") {
        armR.shoulder.rotation.x = -1.0 * e;
        armR.shoulder.rotation.z = THREE.MathUtils.lerp(armR.shoulder.rotation.z, -0.35, e);
        armR.elbow.rotation.x = THREE.MathUtils.lerp(0.12, -1.35, e);
        armR.thumb.visible = e > 0.4;
      } else if (gesture.name === "nod") {
        head.rotation.x += e * 0.22 * Math.sin(gt * 9);
      }
    };

    const render = () => {
      frame = null;
      clock.getDelta();
      pose(clock.elapsedTime);
      renderer.render(scene, camera);
      if (visible && !reduced) frame = requestAnimationFrame(render);
    };

    // Only animate while on screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(render);
    });
    io.observe(mount);

    if (!reduced) play("wave");
    if (variant === "bye" && !reduced) {
      byeTimer = window.setInterval(() => visible && play("wave"), 5200);
    }
    mount.classList.add("is-ready");
    frame = requestAnimationFrame(render);

    return () => {
      playRef.current = null;
      if (frame) cancelAnimationFrame(frame);
      if (byeTimer) window.clearInterval(byeTimer);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [variant]);

  // Each poke plays the next gesture in turn.
  useEffect(() => {
    if (!poke || !playRef.current) return;
    playRef.current(GESTURES[gestureRef.current % GESTURES.length]);
    gestureRef.current += 1;
  }, [poke]);

  return <div ref={mountRef} className={`av3d av3d--${variant} ${className}`} role="img" aria-label={alt} />;
}

export default Avatar3D;
