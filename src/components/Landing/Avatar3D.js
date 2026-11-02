import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Animated 3D avatar. The model is RobotExpressive (Tomás Laulhé / Quaternius,
 * CC0, via the three.js examples), served from public/models so it loads only
 * when an avatar is on screen. Swapping in another rigged GLB with "Idle" and
 * "Wave" clips only needs MODEL_URL changed.
 *
 * It waves on arrival, idles, turns its head toward the pointer, and plays the
 * next gesture whenever `poke` changes. The "bye" variant waves on a timer.
 */
const MODEL_URL = "/models/avatar.glb";
const GESTURES = ["Wave", "ThumbsUp", "Yes"];
// Recolor the model's orange panels toward the site accent.
const MAIN_COLOR = "#2f5fd0";

function Avatar3D({ variant = "wave", poke = 0, alt, className = "" }) {
  const mountRef = useRef(null);
  const playRef = useRef(null);
  const gestureRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    // Far enough back that a raised arm stays inside the frame.
    camera.position.set(0, 2.6, 13.5);
    camera.lookAt(0, 2.3, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 8, 6);
    scene.add(key);

    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2(0, 0);
    let mixer = null;
    let head = null;
    let actions = {};
    let current = null;
    let frame = null;
    let visible = true;
    let byeTimer = null;
    let disposed = false;

    const fadeTo = (name, once) => {
      const next = actions[name];
      if (!next) return;
      next.reset();
      if (once) {
        next.setLoop(THREE.LoopOnce, 1);
        next.clampWhenFinished = true;
      }
      if (current && current !== next) current.crossFadeTo(next, 0.25, false);
      next.play();
      current = next;
    };

    playRef.current = (name) => fadeTo(name, true);

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

    const render = () => {
      frame = null;
      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);
      if (head) {
        // Applied after the mixer so the look-at layers on top of the clip.
        head.rotation.y += THREE.MathUtils.clamp(pointer.x * 0.6, -0.6, 0.6);
        head.rotation.x += THREE.MathUtils.clamp(pointer.y * 0.35, -0.3, 0.35);
      }
      renderer.render(scene, camera);
      if (visible && !reduced) frame = requestAnimationFrame(render);
    };

    // Only animate while on screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        clock.getDelta();
        frame = requestAnimationFrame(render);
      }
    });
    io.observe(mount);

    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse((o) => {
        if (o.isMesh && o.material?.name === "Main") {
          o.material = o.material.clone();
          o.material.color.set(MAIN_COLOR);
        }
      });
      scene.add(model);
      head = model.getObjectByName("Head");

      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer.clipAction(clip);
      });
      // After any one-off gesture, settle back into the idle loop.
      mixer.addEventListener("finished", () => fadeTo("Idle", false));

      fadeTo("Idle", false);
      if (!reduced) fadeTo("Wave", true);
      if (variant === "bye" && !reduced) {
        byeTimer = window.setInterval(() => visible && fadeTo("Wave", true), 5200);
      }
      mount.classList.add("is-ready");
      if (!frame) frame = requestAnimationFrame(render);
    });

    return () => {
      disposed = true;
      playRef.current = null;
      if (frame) cancelAnimationFrame(frame);
      if (byeTimer) window.clearInterval(byeTimer);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose();
          [].concat(o.material).forEach((m) => m.dispose());
        }
      });
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
