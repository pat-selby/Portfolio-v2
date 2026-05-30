import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// ─── City district data ───────────────────────────────────────────────────────
const DISTRICTS = [
  { key: "about",      route: "/about",      label: "ABOUT",      sub: "Who I Am",        hex: "#0ea5e9", col: 0x0ea5e9, emi: 0x38bdf8, x: -16, z: -11, w: 6, h: 8,  d: 6 },
  { key: "projects",   route: "/project",    label: "PROJECTS",   sub: "What I Built",    hex: "#8b5cf6", col: 0x8b5cf6, emi: 0xa78bfa, x:  16, z: -11, w: 6, h: 9,  d: 6 },
  { key: "experience", route: "/experience", label: "EXPERIENCE", sub: "Where I Worked",  hex: "#f59e0b", col: 0xf59e0b, emi: 0xfbbf24, x: -13, z:  14, w: 6, h: 6,  d: 6 },
  { key: "resume",     route: "/resume",     label: "RESUME",     sub: "My CV & Skills",  hex: "#06b6d4", col: 0x06b6d4, emi: 0x22d3ee, x:  13, z:  14, w: 6, h: 5,  d: 6 },
];

// ─── Canvas sprite helper ─────────────────────────────────────────────────────
function makeSprite(label, sub, hexColor) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 140;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "rgba(4,9,18,0.88)";
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(6, 6, 500, 128, 14) : ctx.rect(6, 6, 500, 128);
  ctx.fill();

  ctx.strokeStyle = hexColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(6, 6, 500, 128, 14) : ctx.rect(6, 6, 500, 128);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 54px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label, 256, 60);

  ctx.fillStyle = hexColor;
  ctx.font = "30px Arial";
  ctx.fillText(sub, 256, 104);

  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(9, 2.5, 1);
  return sprite;
}

// ─── Building factory ─────────────────────────────────────────────────────────
function createBuilding(d, scene) {
  const grp = new THREE.Group();

  // Body
  const bodyMat = new THREE.MeshPhongMaterial({ color: d.col, emissive: d.emi, emissiveIntensity: 0.18, shininess: 70 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(d.w, d.h, d.d), bodyMat);
  body.position.y = d.h / 2;
  body.castShadow = true;
  grp.add(body);

  // Roof glow bar
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(d.w + 0.5, 0.35, d.d + 0.5),
    new THREE.MeshBasicMaterial({ color: d.emi, transparent: true, opacity: 0.85 })
  );
  roof.position.y = d.h + 0.18;
  grp.add(roof);

  // Windows — front + back faces
  const ROWS = Math.floor(d.h / 1.8);
  const COLS = Math.floor(d.w / 1.5);
  [-1, 1].forEach(side => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.82) {
          const wm = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.35 ? 0xfff8d0 : d.emi,
            transparent: true, opacity: 0.55 + Math.random() * 0.45,
          });
          const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.55), wm);
          const gx = -(d.w / 2) + 0.9 + c * ((d.w - 1.6) / Math.max(COLS - 1, 1));
          const gy = 0.9 + r * ((d.h - 1.4) / Math.max(ROWS - 1, 1));
          win.position.set(gx, gy, side * (d.d / 2 + 0.02));
          if (side === -1) win.rotation.y = Math.PI;
          grp.add(win);
        }
      }
    }
  });

  // Blinking rooftop light
  const blinkMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 6, 6),
    new THREE.MeshBasicMaterial({ color: d.emi })
  );
  blinkMesh.position.y = d.h + 0.55;
  grp.add(blinkMesh);

  // Point light
  const ptLight = new THREE.PointLight(d.emi, 1.8, 15);
  ptLight.position.y = d.h + 1.5;
  grp.add(ptLight);

  // Floating label
  const sprite = makeSprite(d.label, d.sub, d.hex);
  sprite.position.set(0, d.h + 3.2, 0);
  grp.add(sprite);

  grp.position.set(d.x, 0, d.z);
  scene.add(grp);

  return { grp, body, bodyMat, ptLight, blinkMesh, key: d.key, route: d.route, label: d.label };
}

// ─── Street light factory ─────────────────────────────────────────────────────
function createStreetLight(x, z, scene) {
  const grp = new THREE.Group();
  const poleMat = new THREE.MeshPhongMaterial({ color: 0x1e3a5f });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 5.5, 8), poleMat);
  pole.position.y = 2.75;
  grp.add(pole);

  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xfff9c4 })
  );
  lamp.position.y = 5.6;
  grp.add(lamp);

  const light = new THREE.PointLight(0xfff9c4, 0.9, 12);
  light.position.y = 5.5;
  grp.add(light);

  grp.position.set(x, 0, z);
  scene.add(grp);
  return grp;
}

// ─── 3-D Avatar (stylised humanoid, mouse-reactive) ──────────────────────────
function createAvatar(scene) {
  const grp    = new THREE.Group();
  const skin   = new THREE.MeshPhongMaterial({ color: 0x8B6914, shininess: 25 });
  const suit   = new THREE.MeshPhongMaterial({ color: 0x0f2a4a, emissive: 0x10b981, emissiveIntensity: 0.12 });
  const pant   = new THREE.MeshPhongMaterial({ color: 0x0a1a30 });
  const shoe   = new THREE.MeshPhongMaterial({ color: 0x05101e });
  const accent = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const eyeM   = new THREE.MeshBasicMaterial({ color: 0x00e678 });

  // Legs
  [-0.26, 0.26].forEach(ox => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.3, 10), pant);
    leg.position.set(ox, 0.85, 0);
    grp.add(leg);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.17, 0.52), shoe);
    foot.position.set(ox, 0.18, 0.1);
    grp.add(foot);
  });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 0.5), suit);
  torso.position.y = 2.2;
  grp.add(torso);

  // Collar accent
  const collar = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.1, 0.52), accent);
  collar.position.set(0, 2.88, 0);
  grp.add(collar);

  // Badge strip on chest
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.22), new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85 }));
  badge.position.set(0, 2.1, 0.26);
  grp.add(badge);

  // Arms
  [-0.65, 0.65].forEach((ox, i) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 1.15, 8), suit);
    arm.position.set(ox, 2.18, 0);
    arm.rotation.z = i === 0 ? 0.2 : -0.2;
    grp.add(arm);
    // Hand
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), skin);
    hand.position.set(ox * 1.08, 1.63, 0);
    grp.add(hand);
  });

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.28, 10), skin);
  neck.position.y = 3.02;
  grp.add(neck);

  // Head group (rotates to track mouse)
  const headGrp = new THREE.Group();
  headGrp.position.set(0, 3.58, 0);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.58, 14, 14), skin);
  headGrp.add(head);

  // Eyes
  [-0.2, 0.2].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), eyeM);
    eye.position.set(ex, 0.06, 0.5);
    headGrp.add(eye);
  });

  // Eye-glow light
  const eyeLight = new THREE.PointLight(0x00e678, 1.0, 2.5);
  eyeLight.position.set(0, 0.06, 0.5);
  headGrp.add(eyeLight);

  // Simple hair — flat dark hemisphere
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhongMaterial({ color: 0x1a0a00 })
  );
  hair.position.y = 0.05;
  headGrp.add(hair);

  grp.add(headGrp);

  // Shadow disc under feet
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.7, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  grp.add(shadow);

  // Place in plaza in front of HQ
  grp.position.set(0, 0, 6.5);
  grp.scale.setScalar(1.1);
  scene.add(grp);

  return { grp, headGrp };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CityPortfolio() {
  const mountRef     = useRef(null);
  const navigate     = useNavigate();
  const [tooltip, setTooltip] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040912);
    scene.fog = new THREE.FogExp2(0x040912, 0.016);

    // ── Camera ──
    const W = mount.offsetWidth || window.innerWidth;
    const H = mount.offsetHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 300);
    camera.position.set(0, 30, 42);
    camera.lookAt(0, 0, 0);

    // ── Renderer ──
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
      console.warn("WebGL not supported:", e);
      return;
    }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const onResize = () => {
      const w = mount.offsetWidth, h = mount.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0x0c1e30, 1.4));
    const sun = new THREE.DirectionalLight(0xd0f0ff, 0.55);
    sun.position.set(25, 45, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);
    const fill = new THREE.HemisphereLight(0x001a2a, 0x050912, 0.4);
    scene.add(fill);

    // ── Ground ──
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 140),
      new THREE.MeshPhongMaterial({ color: 0x060f1c, shininess: 8 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid overlay
    const grid = new THREE.GridHelper(140, 35, 0x0d2e1a, 0x0d2e1a);
    grid.position.y = 0.02;
    scene.add(grid);

    // ── Roads ──
    const roadMat = new THREE.MeshPhongMaterial({ color: 0x0a1828, shininess: 4 });
    [
      [0, -5.5, 4, 22],   // central north road
      [0, 6,    4, 20],   // central south road
      [-8, 1.5, 24, 4],   // east-west road
    ].forEach(([x, z, w, d]) => {
      const road = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d), roadMat);
      road.position.set(x, 0.03, z);
      scene.add(road);
    });

    // Road markings
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });
    for (let i = -4; i <= 4; i += 2) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, 1.2), dashMat);
      dash.position.set(0, 0.04, i * 2.5);
      scene.add(dash);
    }

    // ── Plaza (center) ──
    const plaza = new THREE.Mesh(
      new THREE.CircleGeometry(8, 48),
      new THREE.MeshPhongMaterial({ color: 0x091525, shininess: 12 })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.04;
    scene.add(plaza);

    // Plaza ring accent
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(7.6, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    // ── HQ building (tallest, center) ──
    const hqMat = new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x00e678, emissiveIntensity: 0.2, shininess: 90 });
    const hqBody = new THREE.Mesh(new THREE.BoxGeometry(7, 15, 7), hqMat);
    hqBody.position.set(0, 7.5, -4);
    hqBody.castShadow = true;
    scene.add(hqBody);

    // HQ roof bar
    const hqRoof = new THREE.Mesh(
      new THREE.BoxGeometry(7.5, 0.4, 7.5),
      new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.9 })
    );
    hqRoof.position.set(0, 15.2, -4);
    scene.add(hqRoof);

    // HQ windows
    const winMats = [
      new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.75 }),
      new THREE.MeshBasicMaterial({ color: 0xfff8d0, transparent: true, opacity: 0.65 }),
    ];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 4; c++) {
        if (Math.random() < 0.85) {
          const win = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.75), winMats[Math.floor(Math.random() * 2)]);
          win.position.set(-1.8 + c * 1.25, 1.2 + r * 1.9, -0.48);
          scene.add(win);
        }
      }
    }

    // HQ label
    const hqSprite = makeSprite("HQ", "Patrick's Home Base", "#10b981");
    hqSprite.position.set(0, 17.5, -4);
    scene.add(hqSprite);

    // HQ light
    const hqLight = new THREE.PointLight(0x00e678, 2.5, 22);
    hqLight.position.set(0, 17, -4);
    scene.add(hqLight);

    // ── Other districts ──
    const districts = DISTRICTS.map(d => createBuilding(d, scene));

    // All clickable meshes
    const clickables = [
      { mesh: hqBody, key: "home",   route: "/",           label: "HQ — Home Base" },
      ...districts.map(d => ({ mesh: d.body, key: d.key, route: d.route, label: d.label })),
    ];

    // ── Street lights ──
    [[-8,-8],[8,-8],[-8,8],[8,8],[0,-15],[0,15],[-16,0],[16,0],[-8,-16],[8,-16]].forEach(([x,z]) =>
      createStreetLight(x, z, scene)
    );

    // ── Small decorative low-poly trees ──
    const treeMat = new THREE.MeshPhongMaterial({ color: 0x0d4a2a, emissive: 0x042a14, emissiveIntensity: 0.3 });
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x2d1a0a });
    [[-5,4],[-5,9],[5,4],[5,9],[-10,-2],[10,-2]].forEach(([x,z]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.2, 6), trunkMat);
      trunk.position.set(x, 0.6, z);
      scene.add(trunk);
      const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.4, 7), treeMat);
      canopy.position.set(x, 2.6, z);
      scene.add(canopy);
    });

    // ── Floating particles above city ──
    const pCount = 280;
    const pBuf = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pBuf[i*3]   = (Math.random() - 0.5) * 70;
      pBuf[i*3+1] = 5 + Math.random() * 22;
      pBuf[i*3+2] = (Math.random() - 0.5) * 70;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pBuf, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00e678, size: 0.18, transparent: true, opacity: 0.55 }));
    scene.add(particles);

    // ── Avatar ──
    const { grp: avatarGrp, headGrp } = createAvatar(scene);

    // ── Raycaster ──
    const raycaster = new THREE.Raycaster();
    const mouse2d   = new THREE.Vector2();
    let   hoveredKey  = null;
    let   targetHeadY = 0;
    let   targetHeadX = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouse2d.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2d.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

      // Avatar head tracking (lerped in animate loop)
      targetHeadY =  mouse2d.x * 0.55;
      targetHeadX = -mouse2d.y * 0.28;

      // Raycasting
      raycaster.setFromCamera(mouse2d, camera);
      const hits = raycaster.intersectObjects(clickables.map(c => c.mesh));
      if (hits.length > 0) {
        const found = clickables.find(c => c.mesh === hits[0].object);
        if (found && found.key !== hoveredKey) {
          hoveredKey = found.key;
          setTooltip(found.label);
          renderer.domElement.style.cursor = "pointer";
        }
      } else {
        if (hoveredKey) {
          hoveredKey = null;
          setTooltip(null);
          renderer.domElement.style.cursor = "default";
        }
      }
    };

    const onClick = (e) => {
      const rect = mount.getBoundingClientRect();
      mouse2d.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2d.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2d, camera);
      const hits = raycaster.intersectObjects(clickables.map(c => c.mesh));
      if (hits.length > 0) {
        const found = clickables.find(c => c.mesh === hits[0].object);
        if (found && found.key !== "home") navigate(found.route);
      }
    };

    mount.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("click", onClick);

    // ── Animation loop ──
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Camera — gentle drift, stays city-overview angle
      camera.position.x = Math.sin(t * 0.038) * 12;
      camera.position.z = 40 + Math.sin(t * 0.055) * 6;
      camera.position.y = 28 + Math.sin(t * 0.028) * 3;
      camera.lookAt(0, 3, 0);

      // Particles drift
      particles.rotation.y = t * 0.018;
      particles.position.y = Math.sin(t * 0.12) * 0.4;

      // District lights + blink
      districts.forEach((d, i) => {
        d.ptLight.intensity = 1.5 + Math.sin(t * 1.3 + i * 1.1) * 0.55;
        d.blinkMesh.material.opacity = 0.4 + Math.abs(Math.sin(t * 2.5 + i * 1.7)) * 0.6;
        d.bodyMat.emissiveIntensity = d.key === hoveredKey ? 0.55 : 0.18;
      });

      // HQ pulse
      hqLight.intensity = 2.2 + Math.sin(t * 0.85) * 0.65;
      hqMat.emissiveIntensity = hoveredKey === "home" ? 0.52 : 0.2;
      hqRoof.material.opacity = 0.75 + Math.sin(t * 1.5) * 0.15;

      // Ring accent on plaza
      ring.material.opacity = 0.3 + Math.sin(t * 1.0) * 0.2;

      // Avatar breathe + idle sway
      avatarGrp.position.y = Math.sin(t * 1.1) * 0.045;
      avatarGrp.rotation.y = Math.sin(t * 0.35) * 0.06;

      // Avatar head smooth follow
      headGrp.rotation.y += (targetHeadY - headGrp.rotation.y) * 0.08;
      headGrp.rotation.x += (targetHeadX - headGrp.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMouseMove);
      mount.removeEventListener("click", onClick);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [navigate]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Three.js canvas */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Top instruction bar */}
      <div style={{
        position: "absolute", top: "72px", left: 0, right: 0,
        display: "flex", justifyContent: "center", pointerEvents: "none",
      }}>
        <div style={{
          background: "rgba(4,9,18,0.75)", border: "1px solid rgba(16,185,129,0.35)",
          backdropFilter: "blur(10px)", borderRadius: "50px",
          padding: "8px 28px", color: "#10b981",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.88rem", fontWeight: 600, letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}>
          {windowWidth >= 768
            ? "Patrick's Cyber City · Click a Building to Explore"
            : "Patrick's Cyber City"}
        </div>
      </div>

      {/* 2D Mobile Fallback Menu */}
      {windowWidth < 768 && (
        <div style={{
          position: "absolute",
          top: "135px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "340px",
          background: "rgba(7, 10, 24, 0.85)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 15px rgba(16, 185, 129, 0.2)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
          textAlign: "center"
        }}>
          <div style={{
            color: "#10b981",
            fontSize: "0.8rem",
            fontWeight: "bold",
            letterSpacing: "1.5px",
            marginBottom: "12px",
            textTransform: "uppercase"
          }}>
            District Quick Access
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "HQ (Home)", route: "/", hex: "#10b981" },
              { label: "About District", route: "/about", hex: "#0ea5e9" },
              { label: "Projects District", route: "/project", hex: "#8b5cf6" },
              { label: "Experience District", route: "/experience", hex: "#f59e0b" },
              { label: "Resume District", route: "/resume", hex: "#06b6d4" },
            ].map((d) => (
              <button
                key={d.label}
                onClick={() => navigate(d.route)}
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderLeft: `4px solid ${d.hex}`,
                  borderRadius: "8px",
                  padding: "10px 16px",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                  textAlign: "left"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <span>{d.label}</span>
                <span style={{ color: d.hex }}>&gt;&gt;</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {windowWidth >= 768 && tooltip && (
        <div style={{
          position: "absolute", bottom: "38px", left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(4,9,18,0.92)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(16, 185, 129, 0.5)", borderRadius: "10px",
          padding: "10px 28px", color: "#10b981",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1rem", fontWeight: 700,
          letterSpacing: "0.5px", pointerEvents: "none",
          boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
        }}>
          {tooltip} &nbsp;→&nbsp; Click to Visit
        </div>
      )}

      {/* Mini map legend */}
      {windowWidth >= 768 && (
        <div style={{
          position: "absolute", bottom: "38px", right: "28px",
          background: "rgba(4,9,18,0.8)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px", padding: "14px 18px", pointerEvents: "none",
          backdropFilter: "blur(10px)", minWidth: "155px",
        }}>
          <div style={{ color: "#94a3b8", fontSize: "0.7rem", letterSpacing: "1.5px", marginBottom: "10px", textTransform: "uppercase" }}>Districts</div>
          {[
            { label: "HQ",         hex: "#10b981" },
            { label: "About",      hex: "#0ea5e9" },
            { label: "Projects",   hex: "#8b5cf6" },
            { label: "Experience", hex: "#f59e0b" },
            { label: "Resume",     hex: "#06b6d4" },
          ].map(({ label, hex }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: hex, flexShrink: 0 }} />
              <span style={{ color: "#cbd5e1", fontSize: "0.82rem", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
