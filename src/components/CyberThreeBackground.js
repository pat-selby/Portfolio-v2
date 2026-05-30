import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLocation } from "react-router-dom";

/**
 * CyberThreeBackground — minimal ambient particle field.
 * position:fixed / z-index:-1, hidden on the city page (/).
 */
function CyberThreeBackground() {
  const mountRef = useRef(null);
  const location = useLocation();
  const isCity   = location.pathname === "/";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene & camera ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040912);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);

    // ── Renderer ───────────────────────────────────────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch (e) {
      console.warn("WebGL not supported:", e);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Particle field — tiny dim dots only ────────────────────────────────
    const COUNT  = 220;
    const SPREAD = 55;

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3); // drift velocities

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * SPREAD * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;

      vel[i * 3]     = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color:       0x34d399,
      size:        0.22,
      transparent: true,
      opacity:     0.28,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ── A second layer in blue/cyan for depth ──────────────────────────────
    const geo2 = new THREE.BufferGeometry();
    const pos2 = new Float32Array(120 * 3);
    const vel2 = new Float32Array(120 * 3);

    for (let i = 0; i < 120; i++) {
      pos2[i * 3]     = (Math.random() - 0.5) * SPREAD * 2;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      pos2[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 1.4;

      vel2[i * 3]     = (Math.random() - 0.5) * 0.006;
      vel2[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
      vel2[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }

    geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));

    const mat2 = new THREE.PointsMaterial({
      color:       0x38bdf8,
      size:        0.16,
      transparent: true,
      opacity:     0.18,
      sizeAttenuation: true,
    });

    const particles2 = new THREE.Points(geo2, mat2);
    scene.add(particles2);

    // ── Animation — drift only, no camera orbit ────────────────────────────
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Drift green particles
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     += vel[i * 3];
        pos[i * 3 + 1] += vel[i * 3 + 1];
        pos[i * 3 + 2] += vel[i * 3 + 2];

        if (Math.abs(pos[i * 3])     > SPREAD)      vel[i * 3]     *= -1;
        if (Math.abs(pos[i * 3 + 1]) > SPREAD * 0.5) vel[i * 3 + 1] *= -1;
        if (Math.abs(pos[i * 3 + 2]) > SPREAD)      vel[i * 3 + 2] *= -1;
      }
      geo.attributes.position.needsUpdate = true;

      // Drift blue particles
      for (let i = 0; i < 120; i++) {
        pos2[i * 3]     += vel2[i * 3];
        pos2[i * 3 + 1] += vel2[i * 3 + 1];
        pos2[i * 3 + 2] += vel2[i * 3 + 2];

        if (Math.abs(pos2[i * 3])     > SPREAD)      vel2[i * 3]     *= -1;
        if (Math.abs(pos2[i * 3 + 1]) > SPREAD * 0.5) vel2[i * 3 + 1] *= -1;
        if (Math.abs(pos2[i * 3 + 2]) > SPREAD * 1.4) vel2[i * 3 + 2] *= -1;
      }
      geo2.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         "100vw",
        height:        "100vh",
        zIndex:        -1,
        pointerEvents: "none",
        overflow:      "hidden",
        visibility:    isCity ? "hidden" : "visible",
        opacity:       isCity ? 0 : 1,
      }}
    />
  );
}

export default CyberThreeBackground;
