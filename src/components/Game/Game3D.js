import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaTrophy,
  FaGamepad,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa";
import "./Game3D.css";
import personalAvatar from "../../Assets/personal_cyber_avatar.png";

// --- SYNTHESIZER ENGINE (Web Audio API) ---
// High-quality procedural instrumental pad playing soothing Christian worship chords (C - G - Am - F)
class AudioSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.oscillators = [];
    this.chordInterval = null;
    this.currentChordIdx = 0;
    this.isPlaying = false;
    this.isMuted = false;

    // Standard worship progression chords (C Major, G Major, A Minor, F Major)
    // Structured as warm voicing frequencies: Bass note, Middle support, Twinkle
    this.chords = [
      { name: "C Major (Peace)", freqs: [130.81, 196.00, 261.63, 329.63, 523.25] }, // C3, G3, C4, E4, C5
      { name: "G Major (Grace)", freqs: [98.00, 146.83, 293.66, 392.00, 587.33] },  // G2, D3, D4, G4, D5
      { name: "A Minor (Hope)", freqs: [110.00, 164.81, 220.00, 349.23, 440.00] },  // A2, E3, A3, F4, A4
      { name: "F Major (Faith)", freqs: [87.31, 174.61, 261.63, 349.23, 523.25] }   // F2, F3, C4, F4, C5
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  start() {
    this.init();
    if (this.isPlaying) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime + 1.5);
    
    // Play first chord immediately
    this.playChord(this.chords[this.currentChordIdx]);

    // Cycle chords every 5 seconds with smooth crossfade
    this.chordInterval = setInterval(() => {
      this.currentChordIdx = (this.currentChordIdx + 1) % this.chords.length;
      this.playChord(this.chords[this.currentChordIdx]);
    }, 5000);
  }

  playChord(chord) {
    if (!this.ctx || !this.isPlaying) return;

    // Fade out previous oscillators
    const fadeTime = 1.2;
    this.oscillators.forEach(osc => {
      try {
        osc.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeTime);
        setTimeout(() => osc.stop(), fadeTime * 1000 + 100);
      } catch (e) {}
    });
    this.oscillators = [];

    // Spawn new oscillators for chord
    chord.freqs.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      // Warm sound: combine soft triangle waves and filtered saw waves
      osc.type = index === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Low pass filter to make the sound soft and peaceful
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(index === 0 ? 150 : 350, this.ctx.currentTime);
      filter.Q.setValueAtTime(1, this.ctx.currentTime);

      // Detune higher notes slightly for ambient chorus depth
      if (index > 2) {
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.ctx.currentTime);
      }

      // Voice volumes
      const maxVolume = index === 0 ? 0.08 : 0.04;
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(maxVolume, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      osc.start();
      
      osc.gainNode = gainNode;
      this.oscillators.push(osc);
    });

    // Twinkling piano bell sound (procedural arpeggio element)
    setTimeout(() => {
      this.playTwinkle(chord.freqs[Math.floor(Math.random() * 3) + 2] * 2);
    }, 1500);

    setTimeout(() => {
      this.playTwinkle(chord.freqs[Math.floor(Math.random() * 2) + 3] * 2);
    }, 3200);
  }

  playTwinkle(freq) {
    if (!this.ctx || !this.isPlaying || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start();
    setTimeout(() => {
      try { osc.stop(); } catch(e) {}
    }, 2100);
  }

  playChime() {
    // Sound FX when collecting badges
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Bright arpeggio)
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.03, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.08);
      setTimeout(() => {
        try { osc.stop(); } catch(e) {}
      }, (idx * 0.08 + 0.8) * 1000);
    });
  }

  mute() {
    this.isMuted = true;
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    }
  }

  unmute() {
    this.isMuted = false;
    if (this.masterGain && this.isPlaying) {
      this.masterGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.5);
    }
  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.chordInterval);
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.oscillators = [];
  }
}

// Instantiate audio manager
const audioManager = new AudioSynth();

// --- WEBGL GAME COMPONENT ---
function Game3D() {
  const mountRef = useRef(null);
  
  // Game state controls
  const [gameState, setGameState] = useState("STARTUP"); // STARTUP, PLAYING
  const [skin, setSkin] = useState("hacker"); // hacker (green), agent (blue), specialist (purple)
  const [xp, setXp] = useState(0);
  const [hp, setHp] = useState(100);
  const [badgesScore, setBadgesScore] = useState(0);
  const [activeStation, setActiveStation] = useState(null);
  const [activeCardTab, setActiveCardTab] = useState("story");

  useEffect(() => {
    setActiveCardTab("story");
  }, [activeStation]);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [notifyText, setNotifyText] = useState(null);

  // Phishing Mini-Game state
  const [isPhishingActive, setIsPhishingActive] = useState(false);
  const [phishingScore, setPhishingScore] = useState(0);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [gameFeedback, setGameFeedback] = useState(null);

  // References for render loop variables
  const keysRef = useRef({ w: false, a: false, s: false, d: false });
  const joystickVectorRef = useRef({ x: 0, y: 0 });
  const playerPosRef = useRef({ x: 0, z: 0 });
  const badgesRef = useRef([]);
  const triggerJumpRef = useRef(null);
  const triggerLaserRef = useRef(null);
  const triggerRollRef = useRef(null);

  // Skin themes mapping
  const skinThemes = {
    agent: { color: 0x38bdf8, hexStr: "#38bdf8", name: "Cyber-Agent" },
    hacker: { color: 0x10b981, hexStr: "#10b981", name: "Matrix Hacker" },
    specialist: { color: 0xa78bfa, hexStr: "#a78bfa", name: "System Specialist" }
  };

  const currentTheme = skinThemes[skin];

  // Phishing prompts database
  const phishingPrompts = [
    { url: "https://gsu-portal.edu/login/secure", isPhish: false, desc: "Grambling State University educational domain." },
    { url: "http://microsoft-outlook-safelinks-validation.gsu-portal.secure-access.com", isPhish: true, desc: "Phishing target! Wrapped SafeLinks harvesting credentials outside GSU domain." },
    { url: "https://github.com/pat-selby/scansafe", isPhish: false, desc: "Official secure GitHub URL repository." },
    { url: "https://aws.amazon.signin.security-alert-aws.net/console", isPhish: true, desc: "Phishing spoof! Typosquatting domain attempting console hijacking." },
    { url: "http://paypal-verification-restore-account.secure-login-3.com", isPhish: true, desc: "Phishing credential theft targeting financial profile." }
  ];

  // UI trigger data for pillars
  const stationDetails = {
    home: {
      title: "Hologram Port: Patrick Selby",
      subtitle: "Cybersecurity Innovator Nexus",
      avatarQuote: "Welcome to my open world! I'm Patrick, a cyber engineer. I built this 3D simulator to guide you through my life, projects, and my value as a security professional. Walk near the themed islands and use the tabs to learn more about my journey.",
      story: "This 3D space maps out the chapters of my engineering career. From my academic work at Grambling State, to my NSF-funded phishing security research, and telemetry encryption pipelines, each node represents practical, hands-on execution. Pick a character skin and use WASD or the joystick to navigate my life's achievements.",
      value: "• Bridges the gap between academic security research and production-grade engineering.\n• Passionate about zero-trust systems, on-device heuristics, and high-performance networks.\n• Highly self-directed, disciplined, and focused on building robust defense tools.",
      tech: "React, Three.js, Web Audio API, Cybersecurity B.S. Core"
    },
    gsu: {
      title: "Grambling State University",
      subtitle: "Academic and Computer Science Foundation",
      avatarQuote: "GSU was where I hammered out my theoretical foundations. Minoring in CIS, I didn't just study security policies—I mastered discrete algorithms, data structures, and stats. This mathematical background allows me to audit protocols and analyze code performance with precision.",
      story: "My tenure at GSU spans Jan 2025 to Dec 2028, maintaining a 3.83/4.0 GPA. Under rigorous courses in data structures, algorithms, calculus, and cryptography, I learned how to decompose complex systems. Minoring in CIS gave me the developer-first mindset needed to collaborate seamlessly with software engineers.",
      value: "• Academic Excellence: 3.83/4.0 GPA, indicating strong self-discipline and speed of learning.\n• Developer Sympathy: Minoring in CIS means I understand database design and API structures, helping me build security into the dev pipeline.\n• Core Compilers & Structures: Comfortable tracing algorithm complexity, memory management, and network payloads.",
      tech: "Discrete Structures, Attacks & Vulnerabilities (Sec+ Prep), Calculus, Statistics, Data Structures & Algorithms"
    },
    scansafe: {
      title: "ScanSafe Research Deck",
      subtitle: "On-Device Mobile Phishing Prevention",
      avatarQuote: "Mobile phishing is a primary attack vector, but cloud-lookup engines suffer from latency. I built ScanSafe under NSF funding to run heuristics 100% locally on-device. When my rules successfully intercepted wrapped Office 365 harvesting pages, it proved my design.",
      story: "ScanSafe is an Android security application designed to analyze raw URL components in real-time. By implementing an 18-rule heuristics parser on-device, ScanSafe bypasses cloud lookups, bringing scanning latency to 0ms. This prevents credential harvesting at the point of click. I engineered this tool under the guidance of Dr. Vasanth Iyer, presenting it to peer-review boards.",
      value: "• Independent Researcher: Proven track record of spearheading research (supported by NSF funding).\n• Low-Latency Focus: Passionate about performance optimization and running complex models on resource-constrained hardware.\n• Practical Security: Rebuilt rules to block active, complex attacks like phishing links wrapped inside Microsoft SafeLinks.",
      tech: "Java, Android SDK, Android Studio, Python script analysis, Regular Expressions, Heuristic Parsers",
      hasGame: true
    },
    iot: {
      title: "IoT Defense Citadel",
      subtitle: "Hydroficient MQTT Secure Pipeline",
      avatarQuote: "IoT telemetry is highly vulnerable to injection. I secured the telemetry pipeline for the Hydroficient lab using mutual TLS (mTLS) for authentication and HMAC-SHA256 data signatures. An Isolation Forest model identifies spoofing attempts in real-time.",
      story: "In smart water infrastructure systems, telemetry integrity is critical. I engineered a secure pub/sub pipeline utilizing MQTT and OpenSSL client certificates to implement strict access control. To prevent packet replay attacks, I added a 3-layer verification check (sequence numbers, timestamp windows, and signature verification). Finally, anomalous data streams are isolated using an unsupervised machine learning model.",
      value: "• PKI Mastery: Strong understanding of client/server SSL handshakes, certification authorities, and key pairs.\n• Threat Modeler: Highly skilled in STRIDE/DREAD matrices, identifying threats before they hit production.\n• Advanced Analytics: Combines machine learning (Isolation Forest) with telemetry streams to automate incident detection.",
      tech: "mTLS, OpenSSL PKI, MQTT, HMAC-SHA256, STRIDE Threat Modeling, Isolation Forest (Scikit-Learn)"
    },
    skills: {
      title: "Skill Arsenal Obelisk",
      subtitle: "Hardened Security Tooling Masteries",
      avatarQuote: "Security is an continuous chess match. My arsenal is geared towards visibility. If you can't monitor the system kernel, you can't defend it. I write custom audit rules and tracer scripts to ensure no behavior goes unnoticed.",
      story: "A cybersecurity engineer is only as strong as their toolbox. I've designed my skill arsenal to span proactive penetration testing (Nmap), passive traffic intelligence (Wireshark), log analysis (Splunk), and system auditing (Linux auditd).",
      value: "• SOC-Ready: Proficient at drafting event correlation queries, parsing network PCAP files, and setting security watch triggers.\n• Automation-Minded: Writes clean Python scripts to automate routine network audits and threat hunting.\n• Multi-Platform: Confident managing Unix/Linux auditing rules and configuring local network firewall boundaries.",
      tech: "Linux auditd, Nmap, Splunk SIEM, Wireshark, Python Automation, OpenSSL PKI"
    }
  };

  // Trigger floating notifications
  const notify = (text) => {
    setNotifyText(text);
    setTimeout(() => setNotifyText(null), 3000);
  };

  // Start audio pad synthesiser
  const toggleAudio = () => {
    if (isAudioPlaying) {
      audioManager.stop();
      setIsAudioPlaying(false);
    } else {
      audioManager.start();
      setIsAudioPlaying(true);
      notify("Inspirational Worship Ambient Pad started");
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioManager.unmute();
      setIsMuted(false);
    } else {
      audioManager.mute();
      setIsMuted(true);
    }
  };

  // Start the phishing analyzer mini-game
  const startPhishingGame = () => {
    setIsPhishingActive(true);
    setCurrentPromptIdx(0);
    setPhishingScore(0);
    setGameFeedback(null);
  };

  // Evaluate URL submission
  const handlePhishAnswer = (chosePhish) => {
    const prompt = phishingPrompts[currentPromptIdx];
    const isCorrect = chosePhish === prompt.isPhish;
    
    if (isCorrect) {
      setPhishingScore(prev => prev + 1);
      setXp(prev => prev + 20);
      setGameFeedback({ status: "success", text: `CORRECT! Heuristic flag verified: ${prompt.desc}` });
    } else {
      setHp(prev => Math.max(10, prev - 15));
      setGameFeedback({ status: "error", text: `BREACH WARNING! Failed heuristics analysis: ${prompt.desc}` });
    }

    setTimeout(() => {
      setGameFeedback(null);
      if (currentPromptIdx + 1 < phishingPrompts.length) {
        setCurrentPromptIdx(prev => prev + 1);
      } else {
        // Game finished
        setIsPhishingActive(false);
        notify(`Simulator finished! Score: ${phishingScore + (isCorrect ? 1 : 0)}/${phishingPrompts.length}. XP Boosted!`);
        if (phishingScore + (isCorrect ? 1 : 0) === phishingPrompts.length) {
          // Max score bonus
          setXp(prev => prev + 50);
          setHp(100);
          audioManager.playChime();
          notify("Flawless ScanSafe Badge Unlocked! Max HP!");
        }
      }
    }, 2800);
  };

  // Initialize Game Loop
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const mountNode = mountRef.current;
    if (!mountNode) return;

    // Dimensions
    const width = mountNode.clientWidth;
    const height = mountNode.clientHeight;

    // GTA-style Interactive Game State & Physics Variables
    let playerVelocityY = 0;
    let isJumping = false;
    let isRolling = false;
    let rollTimer = 0;
    let rollDirX = 0;
    let rollDirZ = 0;
    let isPunching = false;
    let punchTimer = 0;

    const lasers = [];
    const bots = [];
    const particles = [];

    // Invincibility frame timer for player collision
    let invincibilityTimer = 0;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.012);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 8, 14);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 1);
    mountNode.appendChild(renderer.domElement);

    // 3. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // 4. PROCEDURAL 3D NIGHT CITY SKYLINE & AMBIENT GLOW
    
    // Set twilight night city fog and clear color
    scene.fog = new THREE.FogExp2(0x060813, 0.016);
    renderer.setClearColor(0x060813, 1);

    // Reflective wet asphalt city ground surface far below (at y = -12)
    const cityGroundGeom = new THREE.PlaneGeometry(320, 320);
    const cityGroundMat = new THREE.MeshStandardMaterial({
      color: 0x05060a,
      roughness: 0.95,
      metalness: 0.2
    });
    const cityGround = new THREE.Mesh(cityGroundGeom, cityGroundMat);
    cityGround.rotation.x = -Math.PI / 2;
    cityGround.position.y = -12;
    scene.add(cityGround);

    // Faint grid lines on the distant city streets far below
    const cityGrid = new THREE.GridHelper(320, 80, 0x1e1b4b, 0x090514);
    cityGrid.position.y = -11.95;
    scene.add(cityGrid);

    // Shared procedural canvas texture for office building glowing windows
    const winCanvas = document.createElement("canvas");
    winCanvas.width = 128;
    winCanvas.height = 128;
    const winCtx = winCanvas.getContext("2d");
    
    // Dark building panel base
    winCtx.fillStyle = "#0c0d16";
    winCtx.fillRect(0, 0, 128, 128);
    
    // Draw window grid
    const rows = 8;
    const cols = 8;
    const wWidth = 8;
    const wHeight = 10;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rand = Math.random();
        if (rand > 0.45) {
          // Yellow-amber, sky-blue, or light-pink glowing office windows
          winCtx.fillStyle = rand > 0.82 ? "#fef08a" : (rand > 0.62 ? "#38bdf8" : "#f472b6");
          winCtx.shadowColor = winCtx.fillStyle;
          winCtx.shadowBlur = 4;
        } else {
          // Unlit dark windows
          winCtx.fillStyle = "#111827";
          winCtx.shadowBlur = 0;
        }
        winCtx.fillRect(c * 15 + 6, r * 15 + 6, wWidth, wHeight);
      }
    }
    const winTexture = new THREE.CanvasTexture(winCanvas);
    winTexture.wrapS = THREE.RepeatWrapping;
    winTexture.wrapT = THREE.RepeatWrapping;

    // Red obstruction beacons on building rooftops
    const beaconGeom = new THREE.SphereGeometry(0.12, 6, 6);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const redBeacons = [];

    // Helper to spawn a highly detailed low-poly skyscraper at (x, z)
    const spawnSkyscraper = (x, z, width, height, depth) => {
      const skyscraperGroup = new THREE.Group();
      skyscraperGroup.position.set(x, -12 + height / 2, z);
      scene.add(skyscraperGroup);

      // Clone texture and adjust repeat based on width and height to prevent stretching
      const matTex = winTexture.clone();
      matTex.repeat.set(Math.ceil(width / 2), Math.ceil(height / 3));
      matTex.needsUpdate = true;

      const facadeMat = new THREE.MeshStandardMaterial({
        map: matTex,
        roughness: 0.5,
        metalness: 0.3,
        emissive: 0xffffff,
        emissiveMap: matTex,
        emissiveIntensity: 0.12
      });

      const buildingBody = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), facadeMat);
      skyscraperGroup.add(buildingBody);

      // Roof cap mesh (concrete color)
      const roofGeom = new THREE.BoxGeometry(width + 0.1, 0.4, depth + 0.1);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.position.y = height / 2 + 0.2;
      skyscraperGroup.add(roof);

      // Blinking rooftop red warning beacon
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.set(0, height / 2 + 0.5, 0);
      skyscraperGroup.add(beacon);
      redBeacons.push(beacon);
    };

    // Generate Skyscrapers in city blocks (grid placement avoiding the player roads at x=0, z=0)
    // Spawn in four quadrants surrounding the highways
    const spawnCityBlocks = () => {
      const minDistance = 6.0; // Distance to keep clear from roads
      
      // Quadrant 1 (North-West)
      for (let x = -85; x < -minDistance; x += 14) {
        for (let z = -85; z < -minDistance; z += 14) {
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterZ = (Math.random() - 0.5) * 4;
          const w = 6 + Math.random() * 4;
          const h = 18 + Math.random() * 26;
          const d = 6 + Math.random() * 4;
          spawnSkyscraper(x + jitterX, z + jitterZ, w, h, d);
        }
      }

      // Quadrant 2 (North-East)
      for (let x = minDistance + 6; x < 85; x += 14) {
        for (let z = -85; z < -minDistance; z += 14) {
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterZ = (Math.random() - 0.5) * 4;
          const w = 6 + Math.random() * 4;
          const h = 18 + Math.random() * 26;
          const d = 6 + Math.random() * 4;
          spawnSkyscraper(x + jitterX, z + jitterZ, w, h, d);
        }
      }

      // Quadrant 3 (South-West)
      for (let x = -85; x < -minDistance; x += 14) {
        for (let z = minDistance + 6; z < 85; z += 14) {
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterZ = (Math.random() - 0.5) * 4;
          const w = 6 + Math.random() * 4;
          const h = 18 + Math.random() * 26;
          const d = 6 + Math.random() * 4;
          spawnSkyscraper(x + jitterX, z + jitterZ, w, h, d);
        }
      }

      // Quadrant 4 (South-East)
      for (let x = minDistance + 6; x < 85; x += 14) {
        for (let z = minDistance + 6; z < 85; z += 14) {
          const jitterX = (Math.random() - 0.5) * 4;
          const jitterZ = (Math.random() - 0.5) * 4;
          const w = 6 + Math.random() * 4;
          const h = 18 + Math.random() * 26;
          const d = 6 + Math.random() * 4;
          spawnSkyscraper(x + jitterX, z + jitterZ, w, h, d);
        }
      }
    };
    spawnCityBlocks();

    // Helper: Create a concrete city plaza with sidewalks and crosswalk paint
    const createIsland = (x, z, radius, gridColor) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Sidewalk concrete platform plate
      const cylinderGeom = new THREE.CylinderGeometry(radius, radius, 0.2, 32);
      const cylinderMat = new THREE.MeshStandardMaterial({
        color: 0x272d3d, // dark textured concrete sidewalk
        roughness: 0.9,
        metalness: 0.1
      });
      const platformDisk = new THREE.Mesh(cylinderGeom, cylinderMat);
      platformDisk.position.y = -0.1;
      group.add(platformDisk);

      // Steel grid lines on platform floor representing glowing paving lines
      const gridHelper = new THREE.GridHelper(radius * 2, 8, gridColor, 0x1e293b);
      gridHelper.position.y = 0.01;
      group.add(gridHelper);

      // Glowing neon perimeter curb ring
      const ringGeom = new THREE.RingGeometry(radius - 0.08, radius + 0.08, 32);
      ringGeom.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: gridColor,
        side: THREE.DoubleSide
      });
      const glowRing = new THREE.Mesh(ringGeom, ringMat);
      glowRing.position.y = 0.02;
      group.add(glowRing);

      // Draw crosswalk lines (zebra crossings) at connections
      const cwMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const drawCrosswalk = (rx, rz, isVert) => {
        const cwGroup = new THREE.Group();
        cwGroup.position.set(rx, 0.015, rz);
        for (let i = -2; i <= 2; i++) {
          const stripe = new THREE.Mesh(
            isVert ? new THREE.BoxGeometry(0.18, 0.01, 1.2) : new THREE.BoxGeometry(1.2, 0.01, 0.18),
            cwMat
          );
          if (isVert) stripe.position.x = i * 0.38;
          else stripe.position.z = i * 0.38;
          cwGroup.add(stripe);
        }
        group.add(cwGroup);
      };
      
      // Spawn crosswalks facing the center or roads
      if (x === 0 && z === 0) {
        drawCrosswalk(0, -radius + 0.5, true);
        drawCrosswalk(0, radius - 0.5, true);
        drawCrosswalk(-radius + 0.5, 0, false);
        drawCrosswalk(radius - 0.5, 0, false);
      } else {
        const dirToCenter = Math.atan2(-z, -x);
        const cx = Math.cos(dirToCenter) * (radius - 0.5);
        const cz = Math.sin(dirToCenter) * (radius - 0.5);
        const isVert = Math.abs(cx) < Math.abs(cz);
        drawCrosswalk(cx, cz, isVert);
      }

      // Concrete pillars underneath supporting from y = -12 street level
      const supportGeom = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, 12, 16);
      const supportMat = new THREE.MeshStandardMaterial({ color: 0x111622, metalness: 0.1, roughness: 0.9 });
      const supportCol = new THREE.Mesh(supportGeom, supportMat);
      supportCol.position.y = -6.1;
      group.add(supportCol);

      // Procedural safety railings around the platform perimeter (excluding the entrance path)
      const postGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.95, 8);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
      const railMat = new THREE.MeshBasicMaterial({ color: gridColor });
      
      const numPosts = 12;
      const postsPos = [];
      for (let i = 0; i < numPosts; i++) {
        const angle = (i / numPosts) * Math.PI * 2;
        const dirToCenter = Math.atan2(-z, -x);
        let angleDiff = Math.abs(angle - dirToCenter);
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
        
        const isHome = (x === 0 && z === 0);
        let isEntrance = false;
        if (isHome) {
          const modAngle = angle % (Math.PI / 2);
          if (modAngle < 0.25 || modAngle > (Math.PI / 2 - 0.25)) isEntrance = true;
        } else {
          if (angleDiff < 0.6) isEntrance = true; // Skip railing at the entrance
        }
        
        if (!isEntrance) {
          const px = Math.cos(angle) * (radius - 0.15);
          const pz = Math.sin(angle) * (radius - 0.15);
          const post = new THREE.Mesh(postGeom, postMat);
          post.position.set(px, 0.38, pz);
          group.add(post);
          postsPos.push(new THREE.Vector3(px, 0.8, pz));
        }
      }

      // Draw horizontal railing tubes connecting the posts
      for (let i = 0; i < postsPos.length - 1; i++) {
        const dist = postsPos[i].distanceTo(postsPos[i+1]);
        if (dist < 4.0) {
          const midPoint = new THREE.Vector3().addVectors(postsPos[i], postsPos[i+1]).multiplyScalar(0.5);
          const railGeom = new THREE.CylinderGeometry(0.02, 0.02, dist, 8);
          const rail = new THREE.Mesh(railGeom, railMat);
          rail.position.copy(midPoint);
          const direction = new THREE.Vector3().subVectors(postsPos[i+1], postsPos[i]).normalize();
          rail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
          group.add(rail);
        }
      }

      scene.add(group);
      return { x, z, radius };
    };

    // 5. DEFINE ISLAND PLATFORMS
    const islands = [
      createIsland(0, 0, 8, currentTheme.color),        // Home Center Node
      createIsland(0, -25, 6, 0x10b981),               // GSU Academic Lab (Green)
      createIsland(-25, 0, 6, 0xef4444),               // ScanSafe Phone Lab (Red)
      createIsland(25, 0, 6, 0x3b82f6),                // IoT Telemetry Lab (Blue)
      createIsland(0, 25, 6, 0x8b5cf6)                 // Skills Command Center (Purple)
    ];

    // Bridges as elevated catwalk corridors
    const catwalkGroup = new THREE.Group();
    const createCatwalk = (x1, z1, x2, z2, colorVal) => {
      const length = Math.sqrt((x1 - x2) * (x1 - x2) + (z1 - z2) * (z1 - z2));
      const isVertical = (x1 === x2);
      
      // Black asphalt road surface
      const roadGeom = isVertical ? new THREE.BoxGeometry(2.0, 0.15, length - 12) : new THREE.BoxGeometry(length - 12, 0.15, 2.0);
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.95, metalness: 0.05 });
      const road = new THREE.Mesh(roadGeom, roadMat);
      road.position.set((x1 + x2)/2, 0.05, (z1 + z2)/2);
      catwalkGroup.add(road);

      // Double-yellow lane divider dashes down the center
      const dashGroup = new THREE.Group();
      const numDashes = Math.max(2, Math.floor(length / 2.5));
      const yellowMat = new THREE.MeshBasicMaterial({ color: 0xffb700 });
      for (let i = 0; i < numDashes; i++) {
        const t = (i / (numDashes - 1 || 1)) - 0.5;
        const posOffset = t * (length - 14);
        
        // Two parallel stripes for double yellow line
        for (let side = -1; side <= 1; side += 2) {
          const dash = isVertical ? 
            new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.8), yellowMat) : 
            new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.01, 0.04), yellowMat);
          
          const dx = isVertical ? ((x1 + x2)/2 + side * 0.06) : ((x1 + x2)/2 + posOffset);
          const dz = isVertical ? ((z1 + z2)/2 + posOffset) : ((z1 + z2)/2 + side * 0.06);
          dash.position.set(dx, 0.13, dz);
          dashGroup.add(dash);
        }
      }
      catwalkGroup.add(dashGroup);

      // White solid shoulder lines on road borders
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
      const borderL = isVertical ? 
        new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.01, length - 12), whiteMat) : 
        new THREE.Mesh(new THREE.BoxGeometry(length - 12, 0.01, 0.05), whiteMat);
      const borderR = isVertical ? 
        new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.01, length - 12), whiteMat) : 
        new THREE.Mesh(new THREE.BoxGeometry(length - 12, 0.01, 0.05), whiteMat);

      if (isVertical) {
        borderL.position.set(road.position.x - 0.9, 0.13, road.position.z);
        borderR.position.set(road.position.x + 0.9, 0.13, road.position.z);
      } else {
        borderL.position.set(road.position.x, 0.13, road.position.z - 0.9);
        borderR.position.set(road.position.x, 0.13, road.position.z + 0.9);
      }
      catwalkGroup.add(borderL);
      catwalkGroup.add(borderR);

      // Sturdy concrete safety highway guardrails (textured gray boxes)
      const barrierGeom = isVertical ? 
        new THREE.BoxGeometry(0.12, 0.5, length - 12) : 
        new THREE.BoxGeometry(length - 12, 0.5, 0.12);
      const barrierMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, metalness: 0.1 });

      const guardrailL = new THREE.Mesh(barrierGeom, barrierMat);
      const guardrailR = new THREE.Mesh(barrierGeom, barrierMat);
      
      if (isVertical) {
        guardrailL.position.set(road.position.x - 1.02, 0.35, road.position.z);
        guardrailR.position.set(road.position.x + 1.02, 0.35, road.position.z);
      } else {
        guardrailL.position.set(road.position.x, 0.35, road.position.z - 1.02);
        guardrailR.position.set(road.position.x, 0.35, road.position.z + 1.02);
      }
      catwalkGroup.add(guardrailL);
      catwalkGroup.add(guardrailR);

      // Spawn city lampposts along the road layout (casting pools of light onto the asphalt)
      const spacing = 8;
      const startPos = - (length - 12) / 2;
      const endPos = (length - 12) / 2;
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
      
      for (let offset = startPos + 2; offset <= endPos - 2; offset += spacing) {
        // Create lamppost pole
        const poleGeom = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8);
        const pole = new THREE.Mesh(poleGeom, poleMat);
        
        // Offset slightly to sit outside the guardrail
        const px = isVertical ? (road.position.x - 1.15) : (road.position.x + offset);
        const pz = isVertical ? (road.position.z + offset) : (road.position.z + 1.15);
        pole.position.set(px, 1.6, pz);
        catwalkGroup.add(pole);

        // Arm extending over the highway
        const armGeom = isVertical ? new THREE.BoxGeometry(0.6, 0.06, 0.06) : new THREE.BoxGeometry(0.06, 0.06, 0.6);
        const arm = new THREE.Mesh(armGeom, poleMat);
        const ax = isVertical ? px + 0.28 : px;
        const az = isVertical ? pz : pz - 0.28;
        arm.position.set(ax, 3.1, az);
        catwalkGroup.add(arm);

        // Glowing light bulb fixture
        const bulbGeom = new THREE.SphereGeometry(0.12, 8, 8);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffeaad });
        const bulb = new THREE.Mesh(bulbGeom, bulbMat);
        const bx = isVertical ? ax + 0.22 : ax;
        const bz = isVertical ? az : az - 0.22;
        bulb.position.set(bx, 3.0, bz);
        catwalkGroup.add(bulb);

        // Real Light Source pointing downwards to create gorgeous glowing pools of light
        const streetlightSource = new THREE.PointLight(0xfffaeb, 2.8, 12, 1.3);
        streetlightSource.position.set(bx, 2.9, bz);
        catwalkGroup.add(streetlightSource);
      }
    };

    createCatwalk(0, 0, 0, -25, 0x10b981);
    createCatwalk(0, 0, -25, 0, 0xef4444);
    createCatwalk(0, 0, 25, 0, 0x3b82f6);
    createCatwalk(0, 0, 0, 25, 0x8b5cf6);

    scene.add(catwalkGroup);

    // Helper to spawn explosion particles (used when shooting bots or firing lasers)
    const createExplosion = (x, y, z, colorVal) => {
      const count = 12;
      const partGeom = new THREE.SphereGeometry(0.08, 4, 4);
      const partMat = new THREE.MeshBasicMaterial({ color: colorVal, transparent: true });

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(partGeom, partMat);
        mesh.position.set(x, y, z);
        scene.add(mesh);

        // Random velocities
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6 + 2, // slightly upward blast
          (Math.random() - 0.5) * 6
        );

        particles.push({
          mesh,
          velocity: vel,
          life: 0.5 // lasts 0.5 seconds
        });
      }
    };

    // Helper to spawn a patrolling Malware Bot NPC
    const spawnBot = (id, startX, startZ, axis, minVal, maxVal, colorVal = 0xef4444) => {
      const botGroup = new THREE.Group();
      botGroup.position.set(startX, 0.8, startZ);
      scene.add(botGroup);

      // Body (floating prism spike)
      const bodyGeom = new THREE.ConeGeometry(0.35, 0.7, 5);
      bodyGeom.rotateX(Math.PI); // point down
      const bodyMat = new THREE.MeshStandardMaterial({ 
        color: colorVal, 
        roughness: 0.15, 
        metalness: 0.8,
        emissive: colorVal,
        emissiveIntensity: 0.4
      });
      const body = new THREE.Mesh(bodyGeom, bodyMat);
      botGroup.add(body);

      // Red glowing central eye
      const eyeGeom = new THREE.SphereGeometry(0.1, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const eye = new THREE.Mesh(eyeGeom, eyeMat);
      eye.position.set(0, 0, 0.3); // look forward
      botGroup.add(eye);

      // Status health indicator (little red bar above bot)
      const healthBarGeom = new THREE.BoxGeometry(0.5, 0.05, 0.05);
      const healthBarMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const healthBar = new THREE.Mesh(healthBarGeom, healthBarMat);
      healthBar.position.set(0, 0.6, 0);
      botGroup.add(healthBar);

      bots.push({
        id,
        mesh: botGroup,
        body,
        healthBar,
        axis, // "x" or "z"
        minVal,
        maxVal,
        dir: 1,
        speed: 3.0,
        alive: true,
        respawnTimer: 0,
        startX,
        startZ
      });
    };

    // Spawn 4 patrolling bots along the bridges
    spawnBot(1, 0, -15, "z", -21, -9);
    spawnBot(2, -15, 0, "x", -21, -9);
    spawnBot(3, 15, 0, "x", 9, 21);
    spawnBot(4, 0, 15, "z", 9, 21);

    // GTA-style Actions triggers (Jump, Shoot Laser, Dodge Roll)
    const triggerJump = () => {
      if (!isJumping && !isRolling) {
        isJumping = true;
        playerVelocityY = 10.5; // Jump velocity
      }
    };

    const triggerLaser = () => {
      if (!isPunching) {
        isPunching = true;
        punchTimer = 0.22;
        
        // Spawn laser beam forward from player visor
        const laserGeom = new THREE.SphereGeometry(0.12, 8, 8);
        const laserMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const laserMesh = new THREE.Mesh(laserGeom, laserMat);
        
        // Position at visor height
        laserMesh.position.set(playerGroup.position.x, playerGroup.position.y + 1.2, playerGroup.position.z);
        scene.add(laserMesh);

        // Vector direction based on player orientation
        const angle = playerGroup.rotation.y;
        const vel = {
          x: Math.sin(angle) * 32,
          z: Math.cos(angle) * 32
        };
        
        lasers.push({ mesh: laserMesh, velocity: vel, life: 1.0 });

        // Visor muzzle flash
        createExplosion(
          playerGroup.position.x + Math.sin(angle) * 0.8, 
          playerGroup.position.y + 1.2, 
          playerGroup.position.z + Math.cos(angle) * 0.8, 
          0x00ffff
        );
      }
    };

    const triggerRoll = () => {
      if (!isRolling && !isJumping) {
        isRolling = true;
        rollTimer = 0.35;
        
        // Roll in direction of player rotation
        const rx = Math.sin(playerGroup.rotation.y);
        const rz = Math.cos(playerGroup.rotation.y);
        
        const mag = Math.sqrt(rx * rx + rz * rz);
        if (mag > 0) {
          rollDirX = rx / mag;
          rollDirZ = rz / mag;
        } else {
          rollDirX = 0;
          rollDirZ = 1;
        }

        // Spawn roll dash dust trail behind player
        createExplosion(playerGroup.position.x, 0.1, playerGroup.position.z, currentTheme.color);
      }
    };

    triggerJumpRef.current = triggerJump;
    triggerLaserRef.current = triggerLaser;
    triggerRollRef.current = triggerRoll;

    // 6. 3D STATION BEACON STRUCTURES
    const beaconsGroup = new THREE.Group();
    scene.add(beaconsGroup);

    // Beacon 1: GSU (Academic Stack of Books with light shaft + Chalkboard/Whiteboard)
    const gsuGroup = new THREE.Group();
    gsuGroup.position.set(0, 0, -25); // Set y=0 for stable platform placement
    beaconsGroup.add(gsuGroup);

    // Book stack container to keep original rotatable structure
    const gsuBooksSub = new THREE.Group();
    gsuBooksSub.position.y = 1.0;
    gsuGroup.add(gsuBooksSub);

    // Book 1 (Bottom, Dark Green)
    const bookGeom1 = new THREE.BoxGeometry(2.4, 0.3, 1.8);
    const bookMat1 = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.3 });
    const book1 = new THREE.Mesh(bookGeom1, bookMat1);
    book1.position.y = 0.15;
    book1.rotation.y = Math.PI / 12;
    gsuBooksSub.add(book1);

    // Book 2 (Middle, Cyber Gold)
    const bookGeom2 = new THREE.BoxGeometry(2.1, 0.28, 1.6);
    const bookMat2 = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
    const book2 = new THREE.Mesh(bookGeom2, bookMat2);
    book2.position.y = 0.44;
    book2.rotation.y = -Math.PI / 8;
    gsuBooksSub.add(book2);

    // Book 3 (Top, GSU Emerald)
    const bookGeom3 = new THREE.BoxGeometry(1.8, 0.25, 1.4);
    const bookMat3 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.5 });
    const book3 = new THREE.Mesh(bookGeom3, bookMat3);
    book3.position.y = 0.70;
    book3.rotation.y = Math.PI / 16;
    gsuBooksSub.add(book3);

    // Scroll on top
    const scrollGeom = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
    const scrollMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const scroll = new THREE.Mesh(scrollGeom, scrollMat);
    scroll.position.set(0, 0.9, 0);
    scroll.rotation.z = Math.PI / 2;
    scroll.rotation.y = Math.PI / 6;
    gsuBooksSub.add(scroll);

    // Digital Chalkboard Whiteboard behind the books
    const whiteboardGeom = new THREE.BoxGeometry(5.0, 3.2, 0.15);
    const whiteboardMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      emissive: 0x10b981,
      emissiveIntensity: 0.15
    });
    const whiteboard = new THREE.Mesh(whiteboardGeom, whiteboardMat);
    whiteboard.position.set(0, 1.6, -3.2);
    gsuGroup.add(whiteboard);

    // Whiteboard stand pillars
    const legGeom = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const legL = new THREE.Mesh(legGeom, legMat);
    legL.position.set(-2.4, 1.6, -3.2);
    gsuGroup.add(legL);
    const legR = new THREE.Mesh(legGeom, legMat);
    legR.position.set(2.4, 1.6, -3.2);
    gsuGroup.add(legR);

    // Lab chair/stool
    const stoolSeatGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.08, 16);
    const stoolSeatMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
    const stoolSeat = new THREE.Mesh(stoolSeatGeom, stoolSeatMat);
    stoolSeat.position.set(-2.2, 0.7, 1.8);
    gsuGroup.add(stoolSeat);
    const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), legMat);
    stoolLeg.position.set(-2.2, 0.35, 1.8);
    gsuGroup.add(stoolLeg);

    // Light shaft for GSU
    const shaftGeom = new THREE.CylinderGeometry(0.3, 0.3, 30, 8, 1, true);
    const shaftMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const gsuShaft = new THREE.Mesh(shaftGeom, shaftMat);
    gsuShaft.position.set(0, 15, -25);
    beaconsGroup.add(gsuShaft);

    // Beacon 2: ScanSafe Hacking Desk (Smartphone frame + active floating Shield + Desk setup)
    const scansafeGroup = new THREE.Group();
    scansafeGroup.position.set(-25, 0, 0); // Set y=0 for stable platform placement
    beaconsGroup.add(scansafeGroup);

    // Phone container sub-group to keep rotation clean
    const phoneSubGroup = new THREE.Group();
    phoneSubGroup.position.y = 1.0;
    scansafeGroup.add(phoneSubGroup);

    // Phone Chassis (Metallic Grey)
    const chassisGeom = new THREE.BoxGeometry(1.5, 2.6, 0.15);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.position.y = 0.3;
    chassis.rotation.x = -Math.PI / 12; // tilt back slightly
    phoneSubGroup.add(chassis);

    // Screen (Glow Red/Green Heuristics display)
    const phoneScreenGeom = new THREE.BoxGeometry(1.35, 2.45, 0.17);
    const phoneScreenMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const phoneScreen = new THREE.Mesh(phoneScreenGeom, phoneScreenMat);
    phoneScreen.position.copy(chassis.position);
    phoneScreen.rotation.copy(chassis.rotation);
    phoneSubGroup.add(phoneScreen);

    // Active scan bar (holographic line crossing the screen)
    const scanBarGeom = new THREE.BoxGeometry(1.3, 0.08, 0.2);
    const scanBarMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const scanBar = new THREE.Mesh(scanBarGeom, scanBarMat);
    scanBar.position.copy(chassis.position);
    scanBar.rotation.copy(chassis.rotation);
    phoneSubGroup.add(scanBar);

    // Hovering Scanner Protection Shield
    const shieldGeom = new THREE.ConeGeometry(0.55, 0.9, 4);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xef4444,
      emissiveIntensity: 0.3
    });
    const scansafeShield = new THREE.Mesh(shieldGeom, shieldMat);
    scansafeShield.position.set(0, 3.4, 0);
    scansafeGroup.add(scansafeShield);

    // Hacking Dev Desk Table Setup
    const deskTable = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 1.6), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.5 }));
    deskTable.position.set(0.0, 0.4, 2.2);
    scansafeGroup.add(deskTable);

    // Sleek dual monitor setup on table
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.2 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    
    const monitorL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.1), monitorMat);
    monitorL.position.set(-0.8, 1.1, 2.1);
    monitorL.rotation.y = Math.PI / 10;
    scansafeGroup.add(monitorL);
    const monitorLScreen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.12), screenMat);
    monitorLScreen.position.set(-0.8, 1.1, 2.1);
    monitorLScreen.rotation.y = Math.PI / 10;
    scansafeGroup.add(monitorLScreen);

    const monitorR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.1), monitorMat);
    monitorR.position.set(0.8, 1.1, 2.1);
    monitorR.rotation.y = -Math.PI / 10;
    scansafeGroup.add(monitorR);
    const monitorRScreen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.12), screenMat);
    monitorRScreen.position.set(0.8, 1.1, 2.1);
    monitorRScreen.rotation.y = -Math.PI / 10;
    scansafeGroup.add(monitorRScreen);

    // Beacon 3: IoT Citadel (Telemetry Database Server Tower + Orbit Packets + Control Pipes)
    const iotTowerGroup = new THREE.Group();
    iotTowerGroup.position.set(25, 0, 0);
    beaconsGroup.add(iotTowerGroup);

    // Main cylinder database server tower
    const serverGeom = new THREE.CylinderGeometry(0.7, 0.7, 2.2, 16);
    const serverMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    const server = new THREE.Mesh(serverGeom, serverMat);
    server.position.y = 1.1;
    iotTowerGroup.add(server);

    // Glowing level rings
    const levelRings = [];
    const ringGeom = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = 0.5 + i * 0.6;
      iotTowerGroup.add(ring);
      levelRings.push(ring);
    }

    // Orbiting Radar/Telemetry dish on top
    const radarGeom = new THREE.TorusGeometry(0.65, 0.05, 8, 32);
    const radarMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8 });
    const iotRadar = new THREE.Mesh(radarGeom, radarMat);
    iotRadar.position.set(0, 2.6, 0);
    iotRadar.rotation.x = Math.PI / 4;
    iotTowerGroup.add(iotRadar);

    // Orbiter telemetry packet spheres
    const iotPackets = [];
    const packetGeom = new THREE.SphereGeometry(0.18, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    for (let i = 0; i < 3; i++) {
      const packet = new THREE.Mesh(packetGeom, packetMat);
      iotTowerGroup.add(packet);
      iotPackets.push(packet);
    }

    // Technical conduits/pipes connecting tower into platform disk base
    const pipeGeom = new THREE.CylinderGeometry(0.08, 0.08, 12, 8);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
    const pipe1 = new THREE.Mesh(pipeGeom, pipeMat);
    pipe1.position.set(-0.8, -6.0, -0.8);
    iotTowerGroup.add(pipe1);
    const pipe2 = new THREE.Mesh(pipeGeom, pipeMat);
    pipe2.position.set(0.8, -6.0, 0.8);
    iotTowerGroup.add(pipe2);

    // Beacon 4: Skills obelisk (Pyramid structure + Server cabinets + Orbits)
    const skillsGroup = new THREE.Group();
    skillsGroup.position.set(0, 0, 25);
    beaconsGroup.add(skillsGroup);

    // The central obelisk pyramid
    const coneGeom = new THREE.ConeGeometry(1.5, 3.5, 4);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true
    });
    const skillCone = new THREE.Mesh(coneGeom, coneMat);
    skillCone.position.set(0, 2.5, 0);
    skillsGroup.add(skillCone);

    // Orbits around obelisk
    const orbitSpheres = [];
    const orbitCount = 3;
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, 2.5, 0);
    skillsGroup.add(orbitGroup);
    
    for (let i = 0; i < orbitCount; i++) {
      const sphGeom = new THREE.SphereGeometry(0.3, 8, 8);
      const sphMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
      const sph = new THREE.Mesh(sphGeom, sphMat);
      orbitGroup.add(sph);
      orbitSpheres.push(sph);
    }

    // Modern IT Server Cabinets on either side of obelisk
    const cabinetGeom = new THREE.BoxGeometry(1.5, 3.8, 1.2);
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.1 });
    
    const cabinetL = new THREE.Mesh(cabinetGeom, cabinetMat);
    cabinetL.position.set(-3.2, 1.9, -0.5);
    skillsGroup.add(cabinetL);

    const cabinetR = new THREE.Mesh(cabinetGeom, cabinetMat);
    cabinetR.position.set(3.2, 1.9, -0.5);
    skillsGroup.add(cabinetR);

    // LED server status blinkers
    const blinkGeom = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const blinkMatG = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const blinkMatR = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    for (let row = 0; row < 6; row++) {
      const ledL = new THREE.Mesh(blinkGeom, Math.random() > 0.45 ? blinkMatG : blinkMatR);
      ledL.position.set(-2.42, 0.6 + row * 0.5, 0.15);
      skillsGroup.add(ledL);

      const ledR = new THREE.Mesh(blinkGeom, Math.random() > 0.45 ? blinkMatG : blinkMatR);
      ledR.position.set(2.42, 0.6 + row * 0.5, 0.15);
      skillsGroup.add(ledR);
    }

    // Beacon 5: Home (Rotating rings)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 2, 0);
    beaconsGroup.add(ringGroup);

    const rGeom1 = new THREE.TorusGeometry(1.5, 0.08, 16, 64);
    const rMat1 = new THREE.MeshStandardMaterial({ color: currentTheme.color });
    const ring1 = new THREE.Mesh(rGeom1, rMat1);
    ringGroup.add(ring1);

    const rGeom2 = new THREE.TorusGeometry(1.1, 0.06, 16, 64);
    const ring2 = new THREE.Mesh(rGeom2, rMat1);
    ring2.rotation.x = Math.PI / 2;
    ringGroup.add(ring2);

    // 7. 3D HIGH-DEFINITION HUMAN PLAYER CHARACTER (PROCEDURAL ASSEMBLY)
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 1.6, 0); // Center height (legs on floor)
    scene.add(playerGroup);

    // Human Materials matching Patrick's features from his profile photo
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1d, roughness: 0.75 }); // Realistic dark skin tone
    const jeansMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 }); // Charcoal/black dress trousers
    const blazerMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 }); // Black suit blazer
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }); // Dark blue dress shirt
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }); // Shirt collar accents / white shoe trim
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.95 }); // Black textured hair & soles
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Eye whites
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x27170c }); // Dark brown eyes
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Glowing blue lapel pin (emblem)
    const glassesMat = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // Cyber neon glass frames (optional accent)

    // Torso (Black suit blazer jacket)
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.45), blazerMat);
    torsoMesh.position.y = 0.45;
    playerGroup.add(torsoMesh);

    // Inner Shirt (Dark blue collared dress shirt inside blazer)
    const shirtMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.75, 0.46), shirtMat);
    shirtMesh.position.set(0, 0.525, 0.02);
    playerGroup.add(shirtMesh);

    // Shirt collar V-neck shape
    const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.1), whiteMat);
    collarL.position.set(-0.08, 0.825, 0.21);
    collarL.rotation.z = -0.3;
    playerGroup.add(collarL);

    const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.1), whiteMat);
    collarR.position.set(0.08, 0.825, 0.21);
    collarR.rotation.z = 0.3;
    playerGroup.add(collarR);

    // Lapel Pin emblem (from GSU/Honor Society)
    const lapelPin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 8), pinMat);
    lapelPin.position.set(-0.16, 0.65, 0.23);
    lapelPin.rotation.x = Math.PI / 2;
    playerGroup.add(lapelPin);

    // Head (Flesh sphere with dark skin tone)
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinMat);
    headMesh.position.y = 1.25;
    playerGroup.add(headMesh);

    // Human Facial Features
    // Nose
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.08), skinMat);
    nose.position.set(0, 1.25, 0.28);
    playerGroup.add(nose);

    // Eyes (Sclera + Dark Brown Iris)
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
    eyeL.position.set(-0.085, 1.28, 0.25);
    playerGroup.add(eyeL);
    const irisL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), irisMat);
    irisL.position.set(-0.085, 1.28, 0.28);
    playerGroup.add(irisL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
    eyeR.position.set(0.085, 1.28, 0.25);
    playerGroup.add(eyeR);
    const irisR = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), irisMat);
    irisR.position.set(0.085, 1.28, 0.28);
    playerGroup.add(irisR);

    // Warm Smile Lips
    const smile = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: 0x1b0a02 }));
    smile.position.set(0, 1.16, 0.27);
    playerGroup.add(smile);

    // Glasses / Visor (cyber highlight framing eyes)
    const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.07), glassesMat);
    visorMesh.position.set(0, 1.28, 0.29);
    playerGroup.add(visorMesh);

    // Styled Short Curly/Textured Afro Hair (represented by overlapping compact sphere curls)
    const hairGroup = new THREE.Group();
    hairGroup.position.set(0, 1.38, 0);
    playerGroup.add(hairGroup);

    const mainHair = new THREE.Mesh(new THREE.SphereGeometry(0.29, 12, 12), darkMat);
    mainHair.position.set(0, 0.04, -0.04);
    hairGroup.add(mainHair);

    // Generate 22 mini textured curls for HD realism
    for (let i = 0; i < 22; i++) {
      const curl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), darkMat);
      const theta = (Math.random() * Math.PI * 0.5) + 0.1; // only top/sides
      const phi = Math.random() * Math.PI * 2;
      curl.position.set(
        Math.sin(theta) * Math.cos(phi) * 0.28,
        Math.cos(theta) * 0.28 + 0.05,
        Math.sin(theta) * Math.sin(phi) * 0.28 - 0.04
      );
      hairGroup.add(curl);
    }

    // Left Arm Group (holds blazer sleeve + skin hand)
    const leftArmMesh = new THREE.Group();
    leftArmMesh.position.set(-0.5, 0.8, 0);
    playerGroup.add(leftArmMesh);

    const leftArmSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), blazerMat);
    leftArmSleeve.position.y = -0.3;
    leftArmMesh.add(leftArmSleeve);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), skinMat);
    leftForearm.position.y = -0.7;
    leftArmMesh.add(leftForearm);

    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), skinMat);
    leftHand.position.y = -0.9;
    leftArmMesh.add(leftHand);

    // Right Arm Group (holds blazer sleeve + skin hand)
    const rightArmMesh = new THREE.Group();
    rightArmMesh.position.set(0.5, 0.8, 0);
    playerGroup.add(rightArmMesh);

    const rightArmSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), blazerMat);
    rightArmSleeve.position.y = -0.3;
    rightArmMesh.add(rightArmSleeve);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), skinMat);
    rightForearm.position.y = -0.7;
    rightArmMesh.add(rightForearm);

    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), skinMat);
    rightHand.position.y = -0.9;
    rightArmMesh.add(rightHand);

    // Left Leg Group (holds dress pants + shoes)
    const leftLegMesh = new THREE.Group();
    leftLegMesh.position.set(-0.24, 0.0, 0);
    playerGroup.add(leftLegMesh);

    const leftLegJeans = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.8, 8), jeansMat);
    leftLegJeans.position.y = -0.4;
    leftLegMesh.add(leftLegJeans);

    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.35), darkMat);
    leftShoe.position.set(0, -0.85, 0.06);
    leftLegMesh.add(leftShoe);
    const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.04, 0.36), whiteMat);
    leftSole.position.set(0, -0.93, 0.06);
    leftLegMesh.add(leftSole);

    // Right Leg Group (holds dress pants + shoes)
    const rightLegMesh = new THREE.Group();
    rightLegMesh.position.set(0.24, 0.0, 0);
    playerGroup.add(rightLegMesh);

    const rightLegJeans = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.8, 8), jeansMat);
    rightLegJeans.position.y = -0.4;
    rightLegMesh.add(rightLegJeans);

    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.35), darkMat);
    rightShoe.position.set(0, -0.85, 0.06);
    rightLegMesh.add(rightShoe);
    const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.04, 0.36), whiteMat);
    rightSole.position.set(0, -0.93, 0.06);
    rightLegMesh.add(rightSole);
    // Spotlight pointing down from player to create ground glow
    const playerLight = new THREE.PointLight(currentTheme.color, 2.5, 10);
    playerLight.position.set(0, 1.2, 0);
    playerGroup.add(playerLight);

    // Spawn Human NPCs
    const npcs = [];
    const spawnHumanNpc = (name, x, z, rotationY, outfitColor, hairColor, hasGlasses = false) => {
      const npcGroup = new THREE.Group();
      npcGroup.position.set(x, 1.6, z);
      npcGroup.rotation.y = rotationY;
      scene.add(npcGroup);

      const isPatrick = name.includes("PATRICK");
      const skinM = new THREE.MeshStandardMaterial({ 
        color: isPatrick ? 0x4a2e1d : 0xe0ac69, 
        roughness: isPatrick ? 0.75 : 0.6 
      });
      const jeansM = new THREE.MeshStandardMaterial({ 
        color: isPatrick ? 0x18181b : 0x1e3a8a, 
        roughness: isPatrick ? 0.85 : 0.8 
      });
      const torsoM = new THREE.MeshStandardMaterial({ 
        color: isPatrick ? 0x09090b : outfitColor, 
        roughness: isPatrick ? 0.6 : 0.5 
      });
      const hairM = new THREE.MeshStandardMaterial({ 
        color: isPatrick ? 0x0a0a0a : hairColor, 
        roughness: isPatrick ? 0.95 : 0.9 
      });

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.45), torsoM);
      torso.position.y = 0.45;
      npcGroup.add(torso);

      if (isPatrick) {
        // Inner blue shirt inside suit blazer
        const shirtMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.75, 0.46), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 }));
        shirtMesh.position.set(0, 0.525, 0.02);
        npcGroup.add(shirtMesh);

        // Collar white trim
        const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        collarL.position.set(-0.08, 0.825, 0.21);
        collarL.rotation.z = -0.3;
        npcGroup.add(collarL);

        const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        collarR.position.set(0.08, 0.825, 0.21);
        collarR.rotation.z = 0.3;
        npcGroup.add(collarR);

        // Lapel Pin
        const lapelPin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        lapelPin.position.set(-0.16, 0.65, 0.23);
        lapelPin.rotation.x = Math.PI / 2;
        npcGroup.add(lapelPin);
      }

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinM);
      head.position.y = 1.25;
      npcGroup.add(head);

      // Facial nose & eyes
      const noseObj = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.08), skinM);
      noseObj.position.set(0, 1.25, 0.28);
      npcGroup.add(noseObj);

      const npcEyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const npcIrisMat = new THREE.MeshBasicMaterial({ color: isPatrick ? 0x27170c : 0x2563eb });

      const eyeLObj = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), npcEyeMat);
      eyeLObj.position.set(-0.085, 1.28, 0.25);
      npcGroup.add(eyeLObj);
      const irisLObj = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), npcIrisMat);
      irisLObj.position.set(-0.085, 1.28, 0.28);
      npcGroup.add(irisLObj);

      const eyeRObj = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), npcEyeMat);
      eyeRObj.position.set(0.085, 1.28, 0.25);
      npcGroup.add(eyeRObj);
      const irisRObj = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), npcIrisMat);
      irisRObj.position.set(0.085, 1.28, 0.28);
      npcGroup.add(irisRObj);

      if (isPatrick) {
        const smile = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: 0x1b0a02 }));
        smile.position.set(0, 1.16, 0.27);
        npcGroup.add(smile);
      }

      if (hasGlasses) {
        const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.07), glassesMat);
        glasses.position.set(0, 1.28, 0.29);
        npcGroup.add(glasses);
      }

      // Styled Hair Group
      const hairGroup = new THREE.Group();
      hairGroup.position.set(0, 1.38, 0);
      npcGroup.add(hairGroup);

      const mainHair = new THREE.Mesh(new THREE.SphereGeometry(0.29, 12, 12), hairM);
      mainHair.position.set(0, 0.04, -0.04);
      hairGroup.add(mainHair);

      if (isPatrick) {
        // Generate curly texture for Patrick's NPC hair
        for (let i = 0; i < 22; i++) {
          const curl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), hairM);
          const theta = (Math.random() * Math.PI * 0.5) + 0.1;
          const phi = Math.random() * Math.PI * 2;
          curl.position.set(
            Math.sin(theta) * Math.cos(phi) * 0.28,
            Math.cos(theta) * 0.28 + 0.05,
            Math.sin(theta) * Math.sin(phi) * 0.28 - 0.04
          );
          hairGroup.add(curl);
        }
      } else {
        // Normal fringe locks for other NPCs
        for (let i = 0; i < 5; i++) {
          const lock = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), hairM);
          lock.position.set(-0.12 + i * 0.06, 0.12, 0.1);
          lock.rotation.x = 0.5;
          hairGroup.add(lock);
        }
      }

      // Left Arm
      const leftArm = new THREE.Group();
      leftArm.position.set(-0.5, 0.8, 0);
      npcGroup.add(leftArm);
      const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), torsoM);
      sleeveL.position.y = -0.3;
      leftArm.add(sleeveL);
      const foreL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), skinM);
      foreL.position.y = -0.7;
      leftArm.add(foreL);

      // Right Arm
      const rightArm = new THREE.Group();
      rightArm.position.set(0.5, 0.8, 0);
      npcGroup.add(rightArm);
      const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8), torsoM);
      sleeveR.position.y = -0.3;
      rightArm.add(sleeveR);
      const foreR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), skinM);
      foreR.position.y = -0.7;
      rightArm.add(foreR);

      // Left Leg
      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.8, 8), jeansM);
      leftLeg.position.set(-0.24, -0.4, 0);
      npcGroup.add(leftLeg);

      // Right Leg
      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.8, 8), jeansM);
      rightLeg.position.set(0.24, -0.4, 0);
      npcGroup.add(rightLeg);

      return {
        name,
        group: npcGroup,
        leftArm,
        rightArm
      };
    };

    // Spawn Human NPCs
    npcs.push(spawnHumanNpc("PATRICK (HOST)", 0, 4, Math.PI, 0x0f172a, 0x1c1917, true)); // Patrick developer near home rings
    npcs.push(spawnHumanNpc("SEC-ANALYST NPC", -23, 2.5, Math.PI / 2, 0x1e293b, 0x7c2d12, false)); // Analyst looking at hacking desk
    npcs.push(spawnHumanNpc("IOT-ENGINEER NPC", 23, 2.2, -Math.PI / 2, 0xeab308, 0xd97706, false)); // Yellow high-vis vest engineer

    // Floating names above NPCs
    const createNpcName = (npcName, x, y, z) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(10, 15, 30, 0.75)";
      ctx.fillRect(0, 0, 256, 64);
      ctx.font = "Bold 24px 'Inter', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(npcName, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(x, y, z);
      sprite.scale.set(2.4, 0.6, 1);
      scene.add(sprite);
    };

    createNpcName("PATRICK (HOST)", 0, 3.1, 4);
    createNpcName("SEC-ANALYST NPC", -23, 3.1, 2.5);
    createNpcName("IOT-ENGINEER NPC", 23, 3.1, 2.2);

    // 7.5 INTERACTIVE PHYSICS LETTER BLOCKS ("PATRICK")
    const letterBlocks = [];
    const blockGeom = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const letters = ['P', 'A', 'T', 'R', 'I', 'C', 'K'];
    const letterColors = [0xff0055, 0x00ffcc, 0xffcc00, 0x9900ff, 0xff5500, 0x00aaff, 0xff00ff];
    
    letters.forEach((char, index) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      
      ctx.fillStyle = "rgba(10, 15, 30, 0.95)";
      ctx.fillRect(0, 0, 128, 128);
      
      ctx.strokeStyle = `#${letterColors[index].toString(16).padStart(6, '0')}`;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, 118, 118);
      
      ctx.font = "Bold 84px 'Outfit', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 12;
      ctx.fillText(char, 64, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      const blockMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.15,
        metalness: 0.1,
        emissive: new THREE.Color(letterColors[index]),
        emissiveIntensity: 0.15
      });
      
      const blockMesh = new THREE.Mesh(blockGeom, blockMat);
      
      const spawnX = -2.1 + index * 0.7;
      const spawnZ = -4.5;
      const spawnY = 0.35;
      
      blockMesh.position.set(spawnX, spawnY, spawnZ);
      scene.add(blockMesh);
      
      letterBlocks.push({
        mesh: blockMesh,
        char,
        startX: spawnX,
        startY: spawnY,
        startZ: spawnZ,
        x: spawnX,
        y: spawnY,
        z: spawnZ,
        vx: 0,
        vy: 0,
        vz: 0,
        omegaX: 0,
        omegaY: 0,
        omegaZ: 0,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        radius: 0.45,
        color: letterColors[index]
      });
    });

    // 8. CERTIFICATE BADGES SCATTERED (Collectibles)
    const badgeData = [
      { id: "aws", x: 12, z: -12, name: "AWS Cloud Badge", color: 0xffa500, collected: false },
      { id: "codepath", x: -12, z: -12, name: "CodePath Honors Badge", color: 0x00ffff, collected: false },
      { id: "google", x: -12, z: 12, name: "Google Cyber Badge", color: 0x00ff00, collected: false },
      { id: "ibm", x: 12, z: 12, name: "IBM Specialist Badge", color: 0xff00ff, collected: false },
      { id: "secplus", x: 0, z: -15, name: "CompTIA Sec+ Intel", color: 0xffffff, collected: false }
    ];

    const badgesGroup3D = new THREE.Group();
    scene.add(badgesGroup3D);

    const activeBadges3D = [];

    badgeData.forEach(badge => {
      const outerRingGeom = new THREE.TorusGeometry(0.6, 0.06, 8, 32);
      const badgeMat = new THREE.MeshBasicMaterial({ color: badge.color });
      const badgeOuter = new THREE.Mesh(outerRingGeom, badgeMat);
      badgeOuter.position.set(badge.x, 0.8, badge.z);
      
      const innerSphereGeom = new THREE.OctahedronGeometry(0.3, 0);
      const innerSphere = new THREE.Mesh(innerSphereGeom, badgeMat);
      badgeOuter.add(innerSphere);

      badgesGroup3D.add(badgeOuter);
      activeBadges3D.push({ mesh: badgeOuter, config: badge });
    });
    badgesRef.current = activeBadges3D;

    // Keyboard handlers
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      
      // Prevent browser scroll when playing
      if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }

      if (key === "w" || e.key === "ArrowUp") keysRef.current.w = true;
      if (key === "a" || e.key === "ArrowLeft") keysRef.current.a = true;
      if (key === "s" || e.key === "ArrowDown") keysRef.current.s = true;
      if (key === "d" || e.key === "ArrowRight") keysRef.current.d = true;

      // GTA Action Keys
      if (e.key === " ") {
        triggerJump();
      }
      if (key === "e") {
        triggerLaser();
      }
      if (e.key === "shift") {
        triggerRoll();
      }
    };

    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === "w" || e.key === "ArrowUp") keysRef.current.w = false;
      if (key === "a" || e.key === "ArrowLeft") keysRef.current.a = false;
      if (key === "s" || e.key === "ArrowDown") keysRef.current.s = false;
      if (key === "d" || e.key === "ArrowRight") keysRef.current.d = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // 9. ANIMATION LOOP
    const clock = new THREE.Clock();
    let animId = null;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // 1. Invincibility timer countdown
      if (invincibilityTimer > 0) {
        invincibilityTimer -= delta;
        // flash player mesh visibility for feedback
        playerGroup.visible = Math.floor(clock.getElapsedTime() * 15) % 2 === 0;
      } else {
        playerGroup.visible = true;
      }

      // 2. Dodge Roll physics translation
      if (isRolling) {
        rollTimer -= delta;
        playerGroup.position.x += rollDirX * 18.0 * delta;
        playerGroup.position.z += rollDirZ * 18.0 * delta;

        // Roll spin animation on the torso
        torsoMesh.rotation.x += 16 * delta;
        if (rollTimer <= 0) {
          isRolling = false;
          torsoMesh.rotation.x = 0;
        }
      }

      // 3. Jump physics resolution
      if (isJumping) {
        playerVelocityY -= 24 * delta; // Gravity
        playerGroup.position.y += playerVelocityY * delta;

        // Pose limbs for jump action
        leftLegMesh.rotation.x = -0.6;
        rightLegMesh.rotation.x = 0.6;
        leftArmMesh.rotation.x = -Math.PI * 0.7;
        rightArmMesh.rotation.x = -Math.PI * 0.7;

        if (playerGroup.position.y <= 1.6) {
          playerGroup.position.y = 1.6;
          isJumping = false;
          playerVelocityY = 0;
        }
      }

      // 4. Visor charge attack animation
      if (isPunching) {
        punchTimer -= delta;
        rightArmMesh.rotation.x = -Math.PI / 2;
        rightArmMesh.position.z = 0.4;
        if (punchTimer <= 0) {
          isPunching = false;
          rightArmMesh.rotation.x = 0;
          rightArmMesh.position.z = 0;
        }
      }

      // 5. Explosion particles updates
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.mesh.position.addScaledVector(p.velocity, delta);
        p.velocity.y -= 9.8 * delta; // apply gravity to particles
        p.life -= delta;
        if (p.mesh.material) {
          p.mesh.material.opacity = Math.max(0, p.life / 0.5);
        }
        if (p.life <= 0) {
          scene.remove(p.mesh);
          particles.splice(i, 1);
        }
      }

      // 6. Laser bullets path updating
      for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];
        laser.mesh.position.x += laser.velocity.x * delta;
        laser.mesh.position.z += laser.velocity.z * delta;
        laser.life -= delta;

        if (laser.life <= 0) {
          scene.remove(laser.mesh);
          lasers.splice(i, 1);
        }
      }

      // 7. Malware Bot NPCs patrolling, shooting detection, and player contact damage
      bots.forEach(bot => {
        if (!bot.alive) {
          bot.respawnTimer -= delta;
          if (bot.respawnTimer <= 0) {
            bot.alive = true;
            bot.mesh.position.set(bot.startX, 0.8, bot.startZ);
            scene.add(bot.mesh);
            bot.mesh.visible = true;
            createExplosion(bot.startX, 0.8, bot.startZ, 0xef4444);
          }
          return;
        }

        // Bob up/down and spin
        bot.mesh.position.y = 0.8 + Math.sin(clock.getElapsedTime() * 5 + bot.id) * 0.12;
        bot.body.rotation.y += 2.0 * delta;

        // Move along patrolling range
        if (bot.axis === "x") {
          bot.mesh.position.x += bot.speed * bot.dir * delta;
          if (bot.mesh.position.x >= bot.maxVal) {
            bot.mesh.position.x = bot.maxVal;
            bot.dir = -1;
          } else if (bot.mesh.position.x <= bot.minVal) {
            bot.mesh.position.x = bot.minVal;
            bot.dir = 1;
          }
        } else {
          bot.mesh.position.z += bot.speed * bot.dir * delta;
          if (bot.mesh.position.z >= bot.maxVal) {
            bot.mesh.position.z = bot.maxVal;
            bot.dir = -1;
          } else if (bot.mesh.position.z <= bot.minVal) {
            bot.mesh.position.z = bot.minVal;
            bot.dir = 1;
          }
        }

        // Laser collisions check
        const botX = bot.mesh.position.x;
        const botZ = bot.mesh.position.z;
        for (let lIdx = lasers.length - 1; lIdx >= 0; lIdx--) {
          const l = lasers[lIdx];
          const distToLaser = Math.sqrt(
            (l.mesh.position.x - botX) * (l.mesh.position.x - botX) +
            (l.mesh.position.z - botZ) * (l.mesh.position.z - botZ)
          );

          if (distToLaser < 1.3) {
            // Blast bot!
            bot.alive = false;
            scene.remove(bot.mesh);
            bot.respawnTimer = 5.0; // 5s respawn timer
            
            // Remove laser
            scene.remove(l.mesh);
            lasers.splice(lIdx, 1);

            // Trigger explosion and score XP
            createExplosion(botX, bot.mesh.position.y, botZ, 0xef4444);
            setXp(prev => prev + 50);
            notify("Threat neutralized! Malware Bot destroyed. +50 XP");
            break;
          }
        }

        // Player collisions check
        const playerX = playerGroup.position.x;
        const playerZ = playerGroup.position.z;
        const distToPlayer = Math.sqrt(
          (playerX - botX) * (playerX - botX) +
          (playerZ - botZ) * (playerZ - botZ)
        );

        if (distToPlayer < 1.4 && bot.alive && invincibilityTimer <= 0) {
          // Breached damage!
          invincibilityTimer = 1.2; // 1.2s flash feedback
          setHp(prev => Math.max(0, prev - 15));
          notify("Warning: System breached by Malware Bot! Integrity -15 HP");

          // Knockback player away from bot
          const dx = playerX - botX;
          const dz = playerZ - botZ;
          const len = Math.sqrt(dx * dx + dz * dz) || 1;
          playerGroup.position.x += (dx / len) * 2.5;
          playerGroup.position.z += (dz / len) * 2.5;
        }
      });
      // Waving hand and animation for Patrick Host NPC when player is near
      npcs.forEach(npc => {
        if (npc.name === "PATRICK (HOST)") {
          const playerX = playerGroup.position.x;
          const playerZ = playerGroup.position.z;
          const dist = Math.sqrt(
            (playerX - npc.group.position.x) * (playerX - npc.group.position.x) + 
            (playerZ - npc.group.position.z) * (playerZ - npc.group.position.z)
          );
          
          if (dist < 4.5) {
            // Wave right arm up and down
            npc.rightArm.rotation.z = -Math.PI * 0.75 + Math.sin(clock.getElapsedTime() * 8) * 0.25;
            npc.rightArm.rotation.x = -Math.PI * 0.2;
          } else {
            // Idle arm resting down
            npc.rightArm.rotation.z += (0 - npc.rightArm.rotation.z) * 0.15;
            npc.rightArm.rotation.x += (0 - npc.rightArm.rotation.x) * 0.15;
          }
        }
      });

      // Blink red warning beacons on building rooftops
      const beaconIntensity = Math.sin(clock.getElapsedTime() * 4.5) * 0.4 + 0.6;
      redBeacons.forEach(b => {
        b.material.color.setRGB(beaconIntensity, 0, 0);
      });

      // GSU textbooks rotation
      gsuBooksSub.rotation.y += 0.3 * delta;

      // ScanSafe phone swing and shield spin
      phoneSubGroup.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.1;
      scansafeShield.rotation.y += 1.2 * delta;
      scansafeShield.position.y = 3.4 + Math.sin(clock.getElapsedTime() * 4) * 0.12;

      // Scan bar screen slide
      scanBar.position.y = 1.3 + Math.sin(clock.getElapsedTime() * 3) * 0.9;

      // IoT Server levels and packet orbits
      iotRadar.rotation.y += 0.8 * delta;
      iotPackets.forEach((packet, idx) => {
        const angle = clock.getElapsedTime() * 2 + (idx * Math.PI * 2 / 3);
        packet.position.set(Math.cos(angle) * 1.4, 1.2 + Math.sin(angle * 2) * 0.4, Math.sin(angle) * 1.4);
      });

      skillCone.rotation.y += 0.3 * delta;

      // Cone orbits positioning
      orbitSpheres.forEach((sph, index) => {
        const offset = (index / orbitCount) * Math.PI * 2;
        const angle = clock.getElapsedTime() * 1.5 + offset;
        sph.position.set(Math.cos(angle) * 3, Math.sin(angle) * 0.6, Math.sin(angle) * 3);
      });

      ringGroup.rotation.y += 0.4 * delta;
      ringGroup.rotation.z += 0.2 * delta;

      // Animate badges rotation
      badgesRef.current.forEach(badgeObj => {
        if (!badgeObj.config.collected) {
          badgeObj.mesh.rotation.y += 1.5 * delta;
          badgeObj.mesh.position.y = 0.8 + Math.sin(clock.getElapsedTime() * 3 + badgeObj.config.x) * 0.15;
        }
      });

      // Player controls resolution
      let moveX = 0;
      let moveZ = 0;
      const speed = 10;

      // Lock standard WASD/Joystick movement during active Dodge Roll
      if (!isRolling) {
        // Joystick inputs override keyboard
        if (joystickVectorRef.current.x !== 0 || joystickVectorRef.current.y !== 0) {
          moveX = joystickVectorRef.current.x;
          moveZ = joystickVectorRef.current.y;
        } else {
          if (keysRef.current.w) moveZ = -1;
          if (keysRef.current.s) moveZ = 1;
          if (keysRef.current.a) moveX = -1;
          if (keysRef.current.d) moveX = 1;
        }
      }

      // Normalize speed vectors and apply movement
      if (moveX !== 0 || moveZ !== 0) {
        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
        const normX = moveX / length;
        const normZ = moveZ / length;

        playerGroup.position.x += normX * speed * delta;
        playerGroup.position.z += normZ * speed * delta;

        // Rotate character to face the direction of movement
        const targetAngle = Math.atan2(normX, normZ);
        playerGroup.rotation.y = targetAngle;

        // Only apply normal walk limb swings if not executing jumps/rolls/attacks
        if (!isJumping && !isRolling && !isPunching) {
          leftLegMesh.rotation.x = Math.sin(clock.getElapsedTime() * 12) * 0.5;
          rightLegMesh.rotation.x = -Math.sin(clock.getElapsedTime() * 12) * 0.5;
          leftArmMesh.rotation.x = -Math.sin(clock.getElapsedTime() * 12) * 0.5;
          rightArmMesh.rotation.x = Math.sin(clock.getElapsedTime() * 12) * 0.5;
        }
      } else {
        // Idle limbs return to rest (if no active animation overrides)
        if (!isJumping && !isRolling && !isPunching) {
          leftLegMesh.rotation.x += (0 - leftLegMesh.rotation.x) * 0.1;
          rightLegMesh.rotation.x += (0 - rightLegMesh.rotation.x) * 0.1;
          leftArmMesh.rotation.x += (0 - leftArmMesh.rotation.x) * 0.1;
          rightArmMesh.rotation.x += (0 - rightArmMesh.rotation.x) * 0.1;

          // Gentle breathing bobbing for head and chest
          const bob = Math.sin(clock.getElapsedTime() * 3) * 0.02;
          torsoMesh.position.y = 0.5 + bob;
          headMesh.position.y = 1.3 + bob;
          visorMesh.position.y = 1.3 + bob;
        }
      }

      // Update Interactive Letter Blocks Physics
      letterBlocks.forEach((block, idx) => {
        // Apply physics kinematics
        block.x += block.vx * delta;
        block.z += block.vz * delta;
        block.y += block.vy * delta;
        
        // Gravity if kicked upwards
        if (block.y > 0.35) {
          block.vy -= 9.8 * delta;
        } else {
          block.y = 0.35;
          block.vy = -block.vy * 0.45; // Bounce coefficient
          if (Math.abs(block.vy) < 0.2) block.vy = 0;
        }
        
        // Sliders friction dampening
        block.vx *= 0.94;
        block.vz *= 0.94;
        if (Math.abs(block.vx) < 0.05) block.vx = 0;
        if (Math.abs(block.vz) < 0.05) block.vz = 0;
        
        // Rotations dampening and update
        block.rotX += block.omegaX * delta;
        block.rotY += block.omegaY * delta;
        block.rotZ += block.omegaZ * delta;
        block.omegaX *= 0.94;
        block.omegaY *= 0.94;
        block.omegaZ *= 0.94;
        
        block.mesh.position.set(block.x, block.y, block.z);
        block.mesh.rotation.set(block.rotX, block.rotY, block.rotZ);
        
        // Collision with Player
        const plX = playerGroup.position.x;
        const plZ = playerGroup.position.z;
        const dx = block.x - plX;
        const dz = block.z - plZ;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const touchDist = 0.45 + 0.45; // player radius + block radius
        
        if (dist < touchDist) {
          // Push vector
          const pushX = dx / (dist || 1);
          const pushZ = dz / (dist || 1);
          
          // Transfer velocity based on player activity
          const speed = Math.max(3.2, (isRolling ? 14 : 6));
          block.vx = pushX * speed;
          block.vz = pushZ * speed;
          
          // Bounce in air if jumping or rolling
          if (isJumping || isRolling) {
            block.vy = 4.2;
          }
          
          // Spin
          block.omegaX = (Math.random() - 0.5) * 14;
          block.omegaY = (Math.random() - 0.5) * 14;
          block.omegaZ = (Math.random() - 0.5) * 14;
          
          // Move outside player radius
          block.x = plX + pushX * touchDist;
          block.z = plZ + pushZ * touchDist;
          
          // Play a cute retro bounce synth pluck
          audioManager.triggerSynth(200 + idx * 40, "sine", 0.08);
          
          // Create small dust particles at collision
          createExplosion(block.x, block.y, block.z, block.color);
        }
        
        // Boundary collision with islands
        let onIsland = false;
        islands.forEach(island => {
          const idist = Math.sqrt((block.x - island.x) * (block.x - island.x) + (block.z - island.z) * (block.z - island.z));
          if (idist <= island.radius - 0.1) {
            onIsland = true;
          }
        });
        
        if (!onIsland) {
          // If block falls off, reset it back to starting position with a spark
          createExplosion(block.x, block.y, block.z, 0xff0000);
          block.x = block.startX;
          block.y = 2.5; // fall from ceiling
          block.z = block.startZ;
          block.vx = 0;
          block.vy = 0;
          block.vz = 0;
          block.omegaX = 0;
          block.omegaY = 0;
          block.omegaZ = 0;
          block.rotX = 0;
          block.rotY = 0;
          block.rotZ = 0;
        }
        
        // Collision with other letter blocks (block-to-block bouncing!)
        for (let j = idx + 1; j < letterBlocks.length; j++) {
          const other = letterBlocks[j];
          const bdx = other.x - block.x;
          const bdz = other.z - block.z;
          const bdist = Math.sqrt(bdx * bdx + bdz * bdz);
          const minD = 0.72; // block size overlap
          if (bdist < minD) {
            const overlap = minD - bdist;
            const nx = bdx / (bdist || 1);
            const nz = bdz / (bdist || 1);
            
            // Push apart
            block.x -= nx * overlap * 0.5;
            block.z -= nz * overlap * 0.5;
            other.x += nx * overlap * 0.5;
            other.z += nz * overlap * 0.5;
            
            // Swap velocities (elastic-ish collision)
            const tempVx = block.vx;
            const tempVz = block.vz;
            block.vx = other.vx * 0.8;
            block.vz = other.vz * 0.8;
            other.vx = tempVx * 0.8;
            other.vz = tempVz * 0.8;
            
            block.omegaY = (Math.random() - 0.5) * 6;
            other.omegaY = (Math.random() - 0.5) * 6;
          }
        }
      });

      // 10. COLLISION & FALLING RESPONDERS
      // Islands boundary checks
      let onIsland = false;
      const pX = playerGroup.position.x;
      const pZ = playerGroup.position.z;

      islands.forEach(island => {
        const dist = Math.sqrt((pX - island.x) * (pX - island.x) + (pZ - island.z) * (pZ - island.z));
        if (dist <= island.radius) {
          onIsland = true;
        }
      });

      // Bridge pathways alignment check
      if (!onIsland) {
        // Bridges are lines: (0, 0) to (0, -25), (0, 0) to (25, 0), etc.
        const widthTolerant = 1.6;
        if (Math.abs(pX) < widthTolerant && pZ >= -25 && pZ <= 25) {
          onIsland = true;
        }
        if (Math.abs(pZ) < widthTolerant && pX >= -25 && pX <= 25) {
          onIsland = true;
        }
      }

      // Walking off trigger: slow drop & respawn
      if (!onIsland) {
        playerGroup.position.y -= 12 * delta;
        if (playerGroup.position.y < -15) {
          // Reset positioning
          playerGroup.position.set(0, 1.6, 0);
          setHp(prev => Math.max(10, prev - 10)); // Lose HP
          notify("Glitch detected! Character respawned at center.");
        }
      } else {
        // Lock player y to normal level
        if (playerGroup.position.y < 1.6) {
          playerGroup.position.y = 1.6;
        }
      }

      // Bind positions to Ref coordinates
      playerPosRef.current.x = playerGroup.position.x;
      playerPosRef.current.z = playerGroup.position.z;

      // Camera chasing player smoothly
      camera.position.x += (playerGroup.position.x - camera.position.x) * 0.05;
      camera.position.z += (playerGroup.position.z + 14 - camera.position.z) * 0.05;

      // Camera look direction
      camera.lookAt(playerGroup.position.x, playerGroup.position.y - 0.2, playerGroup.position.z);

      // Proximity triggers to Open HUD Panel cards
      let nearAny = null;
      islands.forEach((island, index) => {
        const dist = Math.sqrt((pX - island.x) * (pX - island.x) + (pZ - island.z) * (pZ - island.z));
        if (dist < 5) {
          if (index === 0) nearAny = "home";
          if (index === 1) nearAny = "gsu";
          if (index === 2) nearAny = "scansafe";
          if (index === 3) nearAny = "iot";
          if (index === 4) nearAny = "skills";
        }
      });
      setActiveStation(nearAny);

      // Collectible badges check
      badgesRef.current.forEach(badgeObj => {
        if (!badgeObj.config.collected) {
          const mPos = badgeObj.mesh.position;
          const dist = Math.sqrt((pX - mPos.x) * (pX - mPos.x) + (pZ - mPos.z) * (pZ - mPos.z));
          if (dist < 1.4) {
            badgeObj.config.collected = true;
            badgeObj.mesh.visible = false;
            
            // Increment badges and play chime
            setBadgesScore(prev => prev + 1);
            setXp(prev => prev + 50); // XP rewards
            audioManager.playChime();
            notify(`Acquired: ${badgeObj.config.name}! +50 XP`);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. CLEANUP ON UNMOUNT
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(animId);
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, skin]); // Re-render if world initializes

  // Mobile virtual joystick logic handler
  const joystickRef = useRef(null);
  const handleTouchStart = (e) => {
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!joystickRef.current) return;
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    
    // Joystick center point
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Displacements
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 45;

    // Cap vector length
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    // Set Ref vector coordinates scaled to unit speed
    joystickVectorRef.current.x = dx / maxRadius;
    joystickVectorRef.current.y = dy / maxRadius;

    // Visual knob feedback
    const knob = joystickRef.current.querySelector(".joystick-knob");
    if (knob) {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  };

  const handleTouchEnd = () => {
    joystickVectorRef.current = { x: 0, y: 0 };
    const knob = joystickRef.current.querySelector(".joystick-knob");
    if (knob) {
      knob.style.transform = "translate(0px, 0px)";
    }
  };

  // Render method dispatcher
  if (gameState === "STARTUP") {
    return (
      <div className="game-startup-overlay">
        <div className="startup-panel">
          <FaGamepad style={{ fontSize: "3.5rem", color: "#10b981", marginBottom: "15px" }} />
          <h2 style={{ fontWeight: "bold" }}>Enter 3D Open World Portfolio</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Explore Patrick's academic achievements, research quests, and security capabilities in a real-time floating WebGL grid.
          </p>

          <h5 style={{ marginTop: "25px", fontWeight: "bold" }}>Select Your Character Theme Skin:</h5>
          <div className="skin-grid">
            <div className={`skin-card skin-green ${skin === 'hacker' ? 'selected' : ''}`} onClick={() => setSkin("hacker")}>
              <div className="skin-preview-sphere"></div>
              <strong>Matrix Hacker</strong>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Electric Green Theme</span>
            </div>

            <div className={`skin-card skin-blue ${skin === 'agent' ? 'selected' : ''}`} onClick={() => setSkin("agent")}>
              <div className="skin-preview-sphere"></div>
              <strong>Cyber-Agent</strong>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Laser Blue Theme</span>
            </div>

            <div className={`skin-card skin-purple ${skin === 'specialist' ? 'selected' : ''}`} onClick={() => setSkin("specialist")}>
              <div className="skin-preview-sphere"></div>
              <strong>Specialist</strong>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Neon Purple Theme</span>
            </div>
          </div>

          <button
            className="hud-btn"
            style={{ padding: "12px 30px", fontSize: "1rem", fontWeight: "bold", background: currentTheme.hexStr, color: "#000000" }}
            onClick={() => {
              setGameState("PLAYING");
              audioManager.start();
              setIsAudioPlaying(true);
            }}
          >
            Launch Cyber Environment
          </button>
          
          <div style={{ marginTop: "20px" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>
              <FaArrowLeft /> Back to Standard Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game3d-root">
      {/* 3D WebGL render mount */}
      <div className="webgl-canvas" ref={mountRef}></div>

      {/* Star notifications */}
      {notifyText && (
        <div className="hud-achievement-popup">
          <FaTrophy /> {notifyText}
        </div>
      )}

      {/* Phishing Game Screen Overlay */}
      {isPhishingActive && (
        <div className="phish-game-overlay hud-interactive secured">
          <div className="d-flex justify-content-between align-items-center">
            <h4 style={{ margin: 0, fontWeight: "bold", color: "#10b981" }}>ScanSafe Phishing Lab</h4>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Heuristics: {currentPromptIdx + 1}/{phishingPrompts.length}</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "5px" }}>
            Evaluate the URL. Trigger rules to BLOCK or ALLOW the traffic query.
          </p>

          <div className="phish-game-terminal">
            <div>TARGET_URL:</div>
            <div className="purple" style={{ wordBreak: "break-all", fontWeight: "bold", margin: "10px 0" }}>
              {phishingPrompts[currentPromptIdx].url}
            </div>
            {gameFeedback && (
              <div className={`mt-2 ${gameFeedback.status === 'success' ? 'text-success' : 'text-danger'}`} style={{ fontSize: "0.8rem" }}>
                {gameFeedback.text}
              </div>
            )}
          </div>

          <div className="phish-btn-group">
            <button className="btn-game-block" onClick={() => handlePhishAnswer(true)}>
              BLOCK (Phish)
            </button>
            <button className="btn-game-allow" onClick={() => handlePhishAnswer(false)}>
              ALLOW (Safe)
            </button>
          </div>
          <button
            className="hud-btn"
            style={{ marginTop: "15px", width: "100%", borderColor: "rgba(255,255,255,0.15)", color: "#94a3b8" }}
            onClick={() => setIsPhishingActive(false)}
          >
            Abort Simulator
          </button>
        </div>
      )}

      {/* Heads Up Display Overlay (HUD) */}
      <div className="game-hud">
        {/* Top HUD elements */}
        <div className="hud-top-bar hud-interactive">
          {/* Player profile stats */}
          <div className="hud-player-stats" style={{ borderColor: currentTheme.hexStr }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong style={{ color: currentTheme.hexStr }}>{currentTheme.name}</strong>
              <span style={{ color: "#38bdf8" }}>Lv. 2 (Sophomore)</span>
            </div>
            
            {/* HP Bar */}
            <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: "bold" }}>SYSTEM HP: {hp}%</div>
            <div className="stat-bar-container" style={{ height: "6px", marginBottom: "8px" }}>
              <div className="stat-bar-fill hp-bar" style={{ width: `${hp}%` }}></div>
            </div>

            {/* XP Bar */}
            <div style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: "bold" }}>SECURITY XP: {xp}</div>
            <div className="stat-bar-container" style={{ height: "6px" }}>
              <div className="stat-bar-fill xp-bar" style={{ width: `${Math.min(100, xp / 3)}%` }}></div>
            </div>

            {/* Audio synth controller */}
            <div className="hud-audio-bar">
              <button className="hud-btn" onClick={toggleAudio}>
                {isAudioPlaying ? <FaPause /> : <FaPlay />} &nbsp;Worship Pad
              </button>
              <button className="hud-btn" onClick={toggleMute}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
          </div>

          {/* Minimap panel */}
          <div className="hud-minimap-panel" style={{ borderColor: currentTheme.hexStr }}>
            <div>SPACE COMPASS</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              X: {playerPosRef.current.x.toFixed(1)} | Z: {playerPosRef.current.z.toFixed(1)}
            </div>
            <div className="minimap-compass" style={{ borderColor: currentTheme.hexStr }}>
              <span>N</span>
              <div
                className="minimap-needle"
                style={{
                  transform: `rotate(${Math.atan2(playerPosRef.current.x, playerPosRef.current.z) * (180 / Math.PI)}deg)`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Dynamic Station Info Cards Overlay */}
        {activeStation && !isPhishingActive && (
          <div className="hud-station-card hud-interactive" style={{ borderColor: currentTheme.hexStr, maxWidth: "560px", width: "90%" }}>
            <button className="station-card-close" onClick={() => setActiveStation(null)}>×</button>
            
            {/* Title & Subtitle */}
            <h4 style={{ fontWeight: "bold", borderBottom: `2px solid ${currentTheme.hexStr}`, paddingBottom: "8px", margin: "0 0 4px 0" }}>
              {stationDetails[activeStation].title}
            </h4>
            <h6 style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0 0 15px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
              {stationDetails[activeStation].subtitle}
            </h6>

            {/* Narrative Dialogue Area (Patrick Speaking) */}
            <div className="hud-narration-box" style={{ display: "flex", gap: "15px", alignItems: "flex-start", backgroundColor: "rgba(15, 23, 42, 0.6)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "15px" }}>
              <div className="avatar-portrait-wrapper" style={{ flexShrink: 0, textAlign: "center" }}>
                <img 
                  src={personalAvatar} 
                  alt="Patrick" 
                  style={{ 
                    width: "64px", 
                    height: "64px", 
                    borderRadius: "50%", 
                    border: `2px solid ${currentTheme.hexStr}`,
                    boxShadow: `0 0 10px ${currentTheme.hexStr}`,
                    objectFit: "cover",
                    backgroundColor: "#000"
                  }} 
                />
                <div style={{ fontSize: "0.65rem", color: currentTheme.hexStr, fontWeight: "bold", marginTop: "4px", textTransform: "uppercase" }}>
                  Patrick
                </div>
              </div>
              <div className="dialogue-bubble" style={{ position: "relative", flexGrow: 1, fontSize: "0.85rem", fontStyle: "italic", color: "#e2e8f0", lineHeight: "1.4" }}>
                "{stationDetails[activeStation].avatarQuote}"
              </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "6px" }}>
              <button 
                className={`hud-tab-btn ${activeCardTab === "story" ? "active" : ""}`} 
                style={{ 
                  color: activeCardTab === "story" ? "#fff" : "#94a3b8",
                  borderBottom: activeCardTab === "story" ? `2px solid ${currentTheme.hexStr}` : "none",
                  backgroundColor: activeCardTab === "story" ? "rgba(255,255,255,0.05)" : "transparent",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                  outline: "none"
                }}
                onClick={() => setActiveCardTab("story")}
              >
                MY STORY
              </button>
              <button 
                className={`hud-tab-btn ${activeCardTab === "value" ? "active" : ""}`} 
                style={{ 
                  color: activeCardTab === "value" ? "#fff" : "#94a3b8",
                  borderBottom: activeCardTab === "value" ? `2px solid ${currentTheme.hexStr}` : "none",
                  backgroundColor: activeCardTab === "value" ? "rgba(255,255,255,0.05)" : "transparent",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                  outline: "none"
                }}
                onClick={() => setActiveCardTab("value")}
              >
                WHY HIRE ME
              </button>
              <button 
                className={`hud-tab-btn ${activeCardTab === "tech" ? "active" : ""}`} 
                style={{ 
                  color: activeCardTab === "tech" ? "#fff" : "#94a3b8",
                  borderBottom: activeCardTab === "tech" ? `2px solid ${currentTheme.hexStr}` : "none",
                  backgroundColor: activeCardTab === "tech" ? "rgba(255,255,255,0.05)" : "transparent",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: "none",
                  outline: "none"
                }}
                onClick={() => setActiveCardTab("tech")}
              >
                TECH MASTERIES
              </button>
            </div>

            {/* Tab Contents */}
            <div style={{ fontSize: "0.85rem", lineHeight: "1.5", maxHeight: "160px", overflowY: "auto", paddingRight: "5px" }}>
              {activeCardTab === "story" && (
                <div style={{ color: "#cbd5e1" }}>
                  {stationDetails[activeStation].story}
                </div>
              )}
              {activeCardTab === "value" && (
                <div style={{ color: "#e2e8f0" }}>
                  {stationDetails[activeStation].value.split("\n").map((valLine, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "flex-start" }}>
                      <span style={{ color: currentTheme.hexStr }}>🛡️</span>
                      <span>{valLine.replace(/^•\s*/, "")}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeCardTab === "tech" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {stationDetails[activeStation].tech.split(", ").map((techTag, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.06)", 
                        border: `1px solid rgba(255, 255, 255, 0.1)`, 
                        borderRadius: "15px", 
                        padding: "3px 10px", 
                        fontSize: "0.75rem",
                        color: "#93c5fd"
                      }}
                    >
                      {techTag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Special simulator buttons */}
            {stationDetails[activeStation].hasGame && (
              <div style={{ marginTop: "15px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "10px" }}>
                <button 
                  className="hud-btn" 
                  style={{ width: "100%", borderColor: currentTheme.hexStr, backgroundColor: "rgba(239, 68, 68, 0.15)" }} 
                  onClick={() => startPhishingGame()}
                >
                  <FaGamepad /> Launch Phishing Simulator Game (+150 XP)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom instructions banner / mobile control pads */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
          <div className="hud-interactive">
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }} onClick={() => audioManager.stop()}>
              <button className="hud-btn">
                <FaArrowLeft /> Exit 3D Environment
              </button>
            </Link>
          </div>

          {/* Desktop keyboard hint */}
          <div className="keyboard-hint-banner">
            <div>KEYBOARD CONTROLS: <strong>WASD</strong> / <strong>ARROW KEYS</strong> to navigate</div>
            <div style={{ color: "#64748b", fontSize: "0.72rem", marginTop: "4px" }}>
              Walk near interactive beacons or collect floating certification rings to gain XP!
            </div>
          </div>

          {/* Player indicators */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div className="hud-player-stats" style={{ minWidth: "auto", padding: "10px 15px" }}>
              <div style={{ fontSize: "0.75rem", color: "#a78bfa" }}>
                <FaTrophy /> BADGES: <strong>{badgesScore}/5</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Joystick & Action Controls for mobile screens */}
      {window.innerWidth <= 768 && (
        <>
          <div
            className="mobile-controls"
            ref={joystickRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="joystick-knob"></div>
          </div>

          <div className="mobile-action-btn-container">
            <button 
              className="btn-mobile-action" 
              style={{ 
                backgroundColor: "rgba(56, 189, 248, 0.25)", 
                borderColor: "#38bdf8", 
                boxShadow: "0 0 10px rgba(56, 189, 248, 0.4)",
                fontSize: "0.72rem",
                fontWeight: "bold",
                color: "#ffffff"
              }} 
              onTouchStart={() => triggerJumpRef.current && triggerJumpRef.current()}
            >
              JUMP
            </button>
            <button 
              className="btn-mobile-action" 
              style={{ 
                backgroundColor: "rgba(239, 68, 68, 0.25)", 
                borderColor: "#ef4444", 
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                fontSize: "0.72rem",
                fontWeight: "bold",
                color: "#ffffff"
              }} 
              onTouchStart={() => triggerLaserRef.current && triggerLaserRef.current()}
            >
              FIRE
            </button>
            <button 
              className="btn-mobile-action" 
              style={{ 
                backgroundColor: "rgba(139, 92, 246, 0.25)", 
                borderColor: "#8b5cf6", 
                boxShadow: "0 0 10px rgba(139, 92, 246, 0.4)",
                fontSize: "0.72rem",
                fontWeight: "bold",
                color: "#ffffff"
              }} 
              onTouchStart={() => triggerRollRef.current && triggerRollRef.current()}
            >
              ROLL
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Game3D;
