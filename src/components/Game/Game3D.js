import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaGamepad, FaTimes, FaChevronRight, FaLightbulb, FaShieldAlt, FaGraduationCap } from "react-icons/fa";
import "./Game3D.css";
import personalAvatar from "../../Assets/personal_cyber_avatar.png";

// ─────────────────────────────────────────────────────────
//  WORLD DATA
// ─────────────────────────────────────────────────────────
const HUB_DATA = {
  home:     { x: 0,    z: 0,    colorHex:"#10b981", colorInt:0x10b981, icon:"🏠", label:"HQ",          tagline:"Start Here" },
  gsu:      { x:-11,   z:-6,    colorHex:"#38bdf8", colorInt:0x38bdf8, icon:"🎓", label:"GSU Campus",   tagline:"3.83 GPA" },
  scansafe: { x: 11,   z:-6,    colorHex:"#a78bfa", colorInt:0xa78bfa, icon:"🔐", label:"ScanSafe Lab", tagline:"NSF Project" },
  iot:      { x: 6.5,  z: 10,   colorHex:"#f59e0b", colorInt:0xf59e0b, icon:"📡", label:"IoT Tower",   tagline:"Secured" },
  skills:   { x:-6.5,  z: 10,   colorHex:"#ec4899", colorInt:0xec4899, icon:"⚔️", label:"Skill Armory", tagline:"5+ Certs" }
};

// BOT script — one short opener per zone
const BOT_SCRIPT = {
  home:     { msg:"👋 Hey! I'm Pat Bot — AI version of Patrick. Walk into any glowing zone to explore his world.", cta:"Explore a Zone" },
  gsu:      { msg:"🎓 GSU, 3.83 GPA. Patrick doesn't just study attacks — he builds defenses before they exist.", cta:"See More" },
  scansafe: { msg:"🔐 ScanSafe blocks phishing in 0ms — no cloud needed. See the BEFORE chaos & AFTER fix →", cta:"Run the Sim" },
  iot:      { msg:"📡 Smart devices = attack surfaces. Patrick locked down the whole MQTT pipeline. See how →", cta:"View Defense" },
  skills:   { msg:"⚔️ Nmap, Splunk, AWS, Kali — Patrick doesn't just list tools. He uses them offensively and defensively.", cta:"See Certs" }
};

// Cinematic story per zone: { before, after }
const CINEMA = {
  scansafe: {
    before: [
      { emoji:"📱", line:"A student taps a SafeLinks URL in their GSU email…" },
      { emoji:"🎣", line:"The link bounces through microsoft-outlook-safelinks.gsu-portal.secure-access.com" },
      { emoji:"💸", line:"Credentials harvested. Bank account drained. Semester ruined." },
      { emoji:"☁️",  line:"Cloud scanners? 200–400ms too slow. Damage already done." }
    ],
    after: [
      { emoji:"🔐", line:"ScanSafe intercepts the URL before it leaves the device." },
      { emoji:"⚡", line:"18 heuristic rules fire in < 1ms — zero cloud, zero latency." },
      { emoji:"🚫", line:"SafeLinks spoof blocked. Student's account stays safe." },
      { emoji:"🏆", line:"NSF-funded. Built by Patrick. Deployed on Android." }
    ]
  },
  iot: {
    before: [
      { emoji:"🌡️", line:"Smart sensors broadcast data over plain MQTT…" },
      { emoji:"🕵️", line:"Attacker on local network intercepts every packet." },
      { emoji:"💥", line:"Fake sensor readings injected — system makes wrong decisions." },
      { emoji:"😱", line:"No auth. No encryption. Critical infrastructure exposed." }
    ],
    after: [
      { emoji:"🔒", line:"Both devices verify each other's identity before any data flows." },
      { emoji:"✍️", line:"Every message is signed — so no one can tamper with it in transit." },
      { emoji:"🧠", line:"A machine learning model spots unusual behavior in real-time." },
      { emoji:"✅", line:"Every attack path mapped. Threat surface reduced to near zero." }
    ]
  },
  gsu: {
    before: [
      { emoji:"📚", line:"Most CS students stop at theory — no real tools built." },
      { emoji:"🤷", line:"Graduating with a degree but zero hands-on security work." },
      { emoji:"❌", line:"Can't answer: 'Show me something you built that defends something real.'" }
    ],
    after: [
      { emoji:"🎓", line:"3.83 GPA + 2 real security projects already in production." },
      { emoji:"🔬", line:"NSF research, IoT externship, 5+ certs — all as a sophomore." },
      { emoji:"🚀", line:"Patrick can answer: 'Here's ScanSafe. Here's the IoT pipeline. Here's the code.'" }
    ]
  },
  skills: {
    before: [
      { emoji:"🔍", line:"Attacker scans your network — you see nothing." },
      { emoji:"📊", line:"Log alerts pile up — no SIEM to correlate them." },
      { emoji:"🌐", line:"Cloud config exposed — no AWS knowledge to lock it down." }
    ],
    after: [
      { emoji:"🗺️", line:"Nmap + Wireshark: Patrick sees what attackers see." },
      { emoji:"📡", line:"Splunk SIEM: real-time correlation, instant incident response." },
      { emoji:"☁️",  line:"AWS Cloud Foundations + Kali Linux: offense informs defense." }
    ]
  }
};

const PHISHING = [
  { url:"https://gsu-portal.edu/login/secure",                                                          safe:true,  desc:"Valid .edu — Grambling State." },
  { url:"http://microsoft-outlook-safelinks-validation.gsu-portal.secure-access.com",                   safe:false, desc:"Typosquatting SafeLinks outside GSU domain!" },
  { url:"https://github.com/pat-selby/scansafe",                                                        safe:true,  desc:"Official GitHub — verified." },
  { url:"https://aws.amazon.signin.security-alert-aws.net/console",                                     safe:false, desc:"Spoof domain impersonating AWS!" },
  { url:"http://paypal-verification-restore-account.secure-login-3.com",                                safe:false, desc:"Financial phishing credential theft!" }
];

// ─────────────────────────────────────────────────────────
//  AUDIO
// ─────────────────────────────────────────────────────────
class AudioSynth {
  constructor(){ this.ctx=null;this.mg=null;this.oscs=[];this.ci=null;this.idx=0;this.on=false;this.muted=false;this.chords=[[130.81,261.63,329.63,523.25],[98,293.66,392,587.33],[110,220,349.23,440],[87.31,261.63,349.23,523.25]]; }
  init(){ if(this.ctx)return; const AC=window.AudioContext||window.webkitAudioContext; this.ctx=new AC(); this.mg=this.ctx.createGain(); this.mg.gain.value=0; this.mg.connect(this.ctx.destination); }
  start(){ this.init(); if(this.on)return; if(this.ctx.state==="suspended")this.ctx.resume(); this.on=true; this.mg.gain.linearRampToValueAtTime(this.muted?0:0.1,this.ctx.currentTime+1.5); this._play(); this.ci=setInterval(()=>{ this.idx=(this.idx+1)%4; this._play(); },5000); }
  _play(){ if(!this.ctx||!this.on)return; this.oscs.forEach(o=>{try{o.g.gain.linearRampToValueAtTime(0,this.ctx.currentTime+1.1);setTimeout(()=>o.stop(),1200);}catch(e){}}); this.oscs=[]; this.chords[this.idx].forEach((f,i)=>{ const o=this.ctx.createOscillator(),g=this.ctx.createGain(),lp=this.ctx.createBiquadFilter(); o.type=i===0?"sawtooth":"triangle"; o.frequency.value=f; lp.type="lowpass"; lp.frequency.value=i===0?140:320; g.gain.setValueAtTime(0,this.ctx.currentTime); g.gain.linearRampToValueAtTime(i===0?0.07:0.035,this.ctx.currentTime+1.2); o.connect(lp);lp.connect(g);g.connect(this.mg);o.start();o.g=g;this.oscs.push(o); }); }
  chime(){ if(!this.ctx||this.muted)return; const now=this.ctx.currentTime; [523,659,784,1047].forEach((f,i)=>{ const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type="sine"; o.frequency.value=f; g.gain.setValueAtTime(0.035,now+i*0.09); g.gain.exponentialRampToValueAtTime(0.0001,now+i*0.09+0.7); o.connect(g);g.connect(this.mg);o.start(now+i*0.09); setTimeout(()=>{try{o.stop();}catch(e){}},900+i*90); }); }
  sfx(f,t="sine",d=0.12){ if(!this.ctx||this.muted)return; try{ const now=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type=t;o.frequency.value=f;g.gain.setValueAtTime(0.06,now);g.gain.exponentialRampToValueAtTime(0.0001,now+d);o.connect(g);g.connect(this.mg);o.start(now);setTimeout(()=>{try{o.stop();}catch(e){}},d*1000+100);}catch(e){} }
  mute(v){ this.muted=v; if(this.mg) this.mg.gain.linearRampToValueAtTime(v?0:this.on?0.1:0,this.ctx.currentTime+0.3); }
  stop(){ this.on=false;clearInterval(this.ci);if(this.mg)this.mg.gain.value=0;this.oscs.forEach(o=>{try{o.stop();}catch(e){}});this.oscs=[]; }
}
const audio = new AudioSynth();

// ─────────────────────────────────────────────────────────
//  TYPEWRITER HOOK
// ─────────────────────────────────────────────────────────
function useTypewriter(text, speed=28, active=true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(()=>{
    setDisplayed(""); setDone(false);
    if(!active||!text){ setDone(true); return; }
    let i=0;
    const iv = setInterval(()=>{
      i++;
      setDisplayed(text.slice(0,i));
      if(i>=text.length){ clearInterval(iv); setDone(true); }
    }, speed);
    return ()=>clearInterval(iv);
  },[text, active, speed]);
  return { displayed, done };
}

// ─────────────────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────────────────
export default function Game3D() {
  const mountRef    = useRef(null);
  const cameraRef   = useRef(null);
  const sizeRef     = useRef({ w:800, h:600 });
  const joystickRef = useRef(null);
  const joystickVec = useRef({ x:0, y:0 });
  const prevStation = useRef(null);

  const [gameState,  setGameState]  = useState("STARTUP");
  const [error,      setError]      = useState(null);
  const [xp,         setXp]         = useState(0);
  const [station,    setStation]    = useState(null);
  const [audioOn,    setAudioOn]    = useState(false);
  const [muted,      setMuted]      = useState(false);
  const [toast,      setToast]      = useState(null);
  const [phishOn,    setPhishOn]    = useState(false);
  const [phishIdx,   setPhishIdx]   = useState(0);
  const [phishScore, setPhishScore] = useState(0);
  const [phishFb,    setPhishFb]    = useState(null);
  const [nearZone,   setNearZone]   = useState(null);

  // Bot / cinema state
  const [botMsg,     setBotMsg]     = useState(BOT_SCRIPT.home.msg);
  const [botCta,     setBotCta]     = useState(BOT_SCRIPT.home.cta);
  const [botVisible, setBotVisible] = useState(false);
  const [cinemaZone, setCinemaZone] = useState(null);   // key into CINEMA
  const [cinemaPhase,setCinemaPhase]= useState("before"); // "before"|"after"
  const [cinemaStep, setCinemaStep] = useState(0);
  const [cinemaAuto, setCinemaAuto] = useState(false);

  const { displayed: botTyped, done: botDone } = useTypewriter(botMsg, 22, botVisible);

  const notify = useCallback((txt)=>{ setToast(txt); setTimeout(()=>setToast(null),3200); },[]);

  // ── Bot open on zone enter
  useEffect(()=>{
    if(!station) return;
    const s = BOT_SCRIPT[station];
    if(s){ setBotMsg(s.msg); setBotCta(s.cta); setBotVisible(true); }
    if(CINEMA[station]) setCinemaZone(station);
    else setCinemaZone(null);
    setCinemaPhase("before");
    setCinemaStep(0);
    setCinemaAuto(false);
  },[station]);

  // ── Cinema auto-advance
  useEffect(()=>{
    if(!cinemaAuto||!cinemaZone) return;
    const frames = CINEMA[cinemaZone]?.[cinemaPhase] || [];
    if(cinemaStep >= frames.length - 1){ setCinemaAuto(false); return; }
    const t = setTimeout(()=>setCinemaStep(s=>s+1), 1800);
    return ()=>clearTimeout(t);
  },[cinemaAuto, cinemaZone, cinemaPhase, cinemaStep]);

  const startCinema = ()=>{ setCinemaStep(0); setCinemaAuto(true); };
  const flipPhase = ()=>{
    setCinemaPhase(p=> p==="before"?"after":"before");
    setCinemaStep(0); setCinemaAuto(true);
    audio.chime();
  };

  const toggleAudio = ()=>{
    if(audioOn){audio.stop();setAudioOn(false);}
    else{audio.start();setAudioOn(true);notify("♪ Ambient music on");}
  };

  const startPhish = ()=>{ setPhishOn(true);setPhishIdx(0);setPhishScore(0);setPhishFb(null); };
  const answerPhish = (choseSafe)=>{
    const p=PHISHING[phishIdx]; const ok=(choseSafe===p.safe);
    if(ok){ setPhishScore(s=>s+1); setXp(x=>x+25); setPhishFb({ok,text:"✔ CORRECT — "+p.desc}); }
    else   { setPhishFb({ok,text:"✘ BREACH — "+p.desc}); }
    setTimeout(()=>{
      setPhishFb(null);
      if(phishIdx+1<PHISHING.length){ setPhishIdx(i=>i+1); }
      else{
        setPhishOn(false);
        const fin=phishScore+(ok?1:0);
        if(fin===PHISHING.length){ setXp(x=>x+60); audio.chime(); notify("PERFECT! ScanSafe Badge Unlocked! +85 XP"); }
        else notify(`Lab done! Score: ${fin}/${PHISHING.length}`);
      }
    },2400);
  };

  // ═══════════════════════════════════════════════════════
  //   3-D ENGINE
  // ═══════════════════════════════════════════════════════
  useEffect(()=>{
    if(gameState!=="PLAYING") return;
    try {
      const mountNode=mountRef.current; if(!mountNode) return;
      let W=mountNode.clientWidth||800, H=mountNode.clientHeight||600;
      sizeRef.current={w:W,h:H};

      const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
      renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
      renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      mountNode.innerHTML=""; mountNode.appendChild(renderer.domElement);

      const scene=new THREE.Scene();
      scene.background=new THREE.Color(0x060412);
      scene.fog=new THREE.FogExp2(0x060412,0.016);

      // ── CAMERA (isometric-ish, shows full kingdom) ──
      const camera=new THREE.PerspectiveCamera(54,W/H,0.1,300);
      camera.position.set(0,28,-2);
      camera.lookAt(0,0,3);
      cameraRef.current=camera;

      // ── LIGHTS ──
      scene.add(new THREE.AmbientLight(0x111128,1.8));
      const sun=new THREE.DirectionalLight(0xffffff,1.2);
      sun.position.set(10,20,5); sun.castShadow=true;
      sun.shadow.mapSize.set(1024,1024);
      scene.add(sun);
      [0x38bdf8,0xa78bfa,0x10b981].forEach((c,i)=>{
        const pl=new THREE.PointLight(c,0.6,35);
        pl.position.set(Math.cos(i*2.1)*14,6,Math.sin(i*2.1)*14);
        scene.add(pl);
      });

      // ── FLOOR ──
      const floor=new THREE.Mesh(
        new THREE.CircleGeometry(26,64),
        new THREE.MeshStandardMaterial({color:0x0d0a1f,roughness:0.9,metalness:0.1})
      );
      floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);

      // Grid lines on floor
      const gridHelper=new THREE.GridHelper(50,30,0x1a1040,0x0f0830);
      gridHelper.position.y=0.01; scene.add(gridHelper);

      // ── STAR PARTICLES ──
      const starGeo=new THREE.BufferGeometry();
      const starPos=[];
      for(let i=0;i<600;i++){
        starPos.push((Math.random()-0.5)*200,(Math.random()*60+10),(Math.random()-0.5)*200);
      }
      starGeo.setAttribute("position",new THREE.Float32BufferAttribute(starPos,3));
      scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:0.18,transparent:true,opacity:0.6})));

      // ── HUBS ──
      const hubMeshes={};
      Object.entries(HUB_DATA).forEach(([k,h])=>{
        // Base pad
        const pad=new THREE.Mesh(
          new THREE.CylinderGeometry(2.2,2.4,0.18,32),
          new THREE.MeshStandardMaterial({color:h.colorInt,emissive:h.colorInt,emissiveIntensity:0.35,roughness:0.4})
        );
        pad.position.set(h.x,0.09,h.z); pad.castShadow=true; pad.receiveShadow=true; scene.add(pad);

        // Tower pillar
        const pillarH = k==="home"?3.8:3.2;
        const pillar=new THREE.Mesh(
          new THREE.CylinderGeometry(0.55,0.65,pillarH,10),
          new THREE.MeshStandardMaterial({color:h.colorInt,emissive:h.colorInt,emissiveIntensity:0.5,roughness:0.3,metalness:0.6})
        );
        pillar.position.set(h.x,pillarH/2+0.18,h.z); pillar.castShadow=true; scene.add(pillar);

        // Glowing orb on top
        const orb=new THREE.Mesh(
          new THREE.SphereGeometry(0.72,20,20),
          new THREE.MeshStandardMaterial({color:h.colorInt,emissive:h.colorInt,emissiveIntensity:1.4,roughness:0,metalness:0.2})
        );
        orb.position.set(h.x,pillarH+0.18+0.72,h.z); scene.add(orb);

        // Ring aura
        const ring=new THREE.Mesh(
          new THREE.TorusGeometry(2.5,0.07,8,40),
          new THREE.MeshStandardMaterial({color:h.colorInt,emissive:h.colorInt,emissiveIntensity:2,transparent:true,opacity:0.7})
        );
        ring.rotation.x=Math.PI/2; ring.position.set(h.x,0.28,h.z); scene.add(ring);

        // Point light at orb
        const pl=new THREE.PointLight(h.colorInt,1.2,9);
        pl.position.copy(orb.position); scene.add(pl);

        hubMeshes[k]={ pad, pillar, orb, ring, pl, t:Math.random()*Math.PI*2 };
      });

      // ── PATH CONNECTIONS ──
      Object.values(HUB_DATA).forEach(h=>{
        if(h===HUB_DATA.home) return;
        const pts=[new THREE.Vector3(0,0.05,0),new THREE.Vector3(h.x,0.05,h.z)];
        const line=new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({color:0x2a1a6a,transparent:true,opacity:0.4})
        );
        scene.add(line);
      });

      // ── PLAYER (human-like figure) ──
      const playerGroup=new THREE.Group(); scene.add(playerGroup);

      // Body
      const bodyColor=0x10b981;
      const body=new THREE.Mesh(
        new THREE.CapsuleGeometry(0.28,0.7,6,12),
        new THREE.MeshStandardMaterial({color:bodyColor,emissive:bodyColor,emissiveIntensity:0.4,roughness:0.5})
      );
      body.position.y=0.85; playerGroup.add(body);

      // Head
      const head=new THREE.Mesh(
        new THREE.SphereGeometry(0.22,14,14),
        new THREE.MeshStandardMaterial({color:0xc8936a,roughness:0.7})
      );
      head.position.y=1.65; playerGroup.add(head);

      // Hair
      const hair=new THREE.Mesh(
        new THREE.SphereGeometry(0.235,14,14),
        new THREE.MeshStandardMaterial({color:0x1a0a00,roughness:1})
      );
      hair.position.y=1.72; hair.scale.set(1,0.55,1); playerGroup.add(hair);

      // Left arm
      const armGeo=new THREE.CapsuleGeometry(0.09,0.42,4,8);
      const armMat=new THREE.MeshStandardMaterial({color:bodyColor,emissive:bodyColor,emissiveIntensity:0.3});
      const leftArm=new THREE.Mesh(armGeo,armMat);
      leftArm.position.set(-0.4,0.85,0); leftArm.rotation.z=0.35; playerGroup.add(leftArm);

      const rightArm=new THREE.Mesh(armGeo,armMat);
      rightArm.position.set(0.4,0.85,0); rightArm.rotation.z=-0.35; playerGroup.add(rightArm);

      // Legs
      const legGeo=new THREE.CapsuleGeometry(0.1,0.44,4,8);
      const legMat=new THREE.MeshStandardMaterial({color:0x1a3a5c,roughness:0.8});
      const leftLeg=new THREE.Mesh(legGeo,legMat);
      leftLeg.position.set(-0.18,0.3,0); playerGroup.add(leftLeg);
      const rightLeg=new THREE.Mesh(legGeo,legMat);
      rightLeg.position.set(0.18,0.3,0); playerGroup.add(rightLeg);

      // Shoes
      const shoeGeo=new THREE.BoxGeometry(0.2,0.1,0.32);
      const shoeMat=new THREE.MeshStandardMaterial({color:0x222222});
      const lShoe=new THREE.Mesh(shoeGeo,shoeMat); lShoe.position.set(-0.18,0.07,0.06); playerGroup.add(lShoe);
      const rShoe=new THREE.Mesh(shoeGeo,shoeMat); rShoe.position.set(0.18,0.07,0.06); playerGroup.add(rShoe);

      // Player glow
      const playerGlow=new THREE.PointLight(0x10b981,1.4,5);
      playerGlow.position.y=1; playerGroup.add(playerGlow);

      playerGroup.position.set(0,0,0);

      // ── CONTROLS STATE ──
      const keys={};
      const onKeyDown=e=>{
        keys[e.key.toLowerCase()]=true;
        if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault();
      };
      const onKeyUp=e=>{ keys[e.key.toLowerCase()]=false; };
      window.addEventListener("keydown",onKeyDown);
      window.addEventListener("keyup",onKeyUp);

      // ── CLICK-TO-MOVE ──
      let clickTarget=null;
      const raycaster=new THREE.Raycaster();
      const floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
      const onCanvasClick=e=>{
        const rect=renderer.domElement.getBoundingClientRect();
        const mx=((e.clientX-rect.left)/rect.width)*2-1;
        const my=-((e.clientY-rect.top)/rect.height)*2+1;
        raycaster.setFromCamera(new THREE.Vector2(mx,my),camera);
        const hit=new THREE.Vector3();
        if(raycaster.ray.intersectPlane(floorPlane,hit)){
          clickTarget={x:Math.max(-23,Math.min(23,hit.x)),z:Math.max(-23,Math.min(23,hit.z))};
        }
      };
      renderer.domElement.addEventListener("click",onCanvasClick);

      // ── JOYSTICK ──
      const joyEl=joystickRef.current;
      let joyActive=false; let joyOrigin={x:0,y:0};
      const joyThumb=joyEl?joyEl.querySelector(".g3-joystick-thumb"):null;
      const startJ=e=>{ joyActive=true; clickTarget=null; const tt=e.touches?.[0]||e; joyOrigin={x:tt.clientX,y:tt.clientY}; e.preventDefault(); };
      const moveJ=e=>{
        if(!joyActive) return;
        const tt=e.touches?.[0]||e;
        const dx=tt.clientX-joyOrigin.x; const dy=tt.clientY-joyOrigin.y;
        const len=Math.hypot(dx,dy)||1; const clamp=Math.min(1,len/44);
        joystickVec.current={x:(dx/len)*clamp,y:(dy/len)*clamp};
        if(joyThumb) joyThumb.style.transform=`translate(${(dx/len)*clamp*18}px,${(dy/len)*clamp*18}px)`;
      };
      const endJ=()=>{ joyActive=false; joystickVec.current={x:0,y:0}; if(joyThumb) joyThumb.style.transform=""; };
      if(joyEl){
        joyEl.addEventListener("touchstart",startJ,{passive:false});
        joyEl.addEventListener("touchmove",moveJ,{passive:false});
        joyEl.addEventListener("touchend",endJ);
        joyEl.addEventListener("mousedown",startJ);
        window.addEventListener("mousemove",moveJ);
        window.addEventListener("mouseup",endJ);
      }

      // ── RESIZE ──
      const onResize=()=>{
        W=mountNode.clientWidth||800; H=mountNode.clientHeight||600;
        sizeRef.current={w:W,h:H};
        renderer.setSize(W,H); camera.aspect=W/H; camera.updateProjectionMatrix();
      };
      window.addEventListener("resize",onResize);

      // ── ANIMATION — delta-time + velocity/acceleration ──
      let frame; let t=0; let walkPhase=0;
      let lastTs=performance.now();
      let velX=0, velZ=0;
      const MAX_SPEED=8.0;
      const ACCEL=40;
      const FRICTION=0.80; // multiplied each frame

      const animate=(ts)=>{
        frame=requestAnimationFrame(animate);
        const dt=Math.min((ts-lastTs)/1000,0.05);
        lastTs=ts;
        t+=dt;

        // ── Input direction ──
        let ix=joystickVec.current.x, iz=joystickVec.current.y;
        if(keys["w"]||keys["arrowup"])    iz-=1;
        if(keys["s"]||keys["arrowdown"])  iz+=1;
        if(keys["a"]||keys["arrowleft"])  ix-=1;
        if(keys["d"]||keys["arrowright"]) ix+=1;

        // click-to-move takes over when no key held
        if(clickTarget && Math.abs(ix)+Math.abs(iz)<0.05){
          const tdx=clickTarget.x-playerGroup.position.x;
          const tdz=clickTarget.z-playerGroup.position.z;
          const tdist=Math.hypot(tdx,tdz);
          if(tdist>0.3){ ix=tdx/tdist; iz=tdz/tdist; }
          else { clickTarget=null; }
        }

        // ── Velocity ──
        const hasInput=Math.hypot(ix,iz)>0.05;
        if(hasInput){
          const il=Math.hypot(ix,iz)||1;
          velX+=(ix/il)*ACCEL*dt;
          velZ+=(iz/il)*ACCEL*dt;
          const spd=Math.hypot(velX,velZ);
          if(spd>MAX_SPEED){ velX=velX/spd*MAX_SPEED; velZ=velZ/spd*MAX_SPEED; }
        }
        velX*=FRICTION;
        velZ*=FRICTION;

        const moving=Math.hypot(velX,velZ)>0.08;
        if(moving){
          playerGroup.position.x=Math.max(-23,Math.min(23,playerGroup.position.x+velX*dt));
          playerGroup.position.z=Math.max(-23,Math.min(23,playerGroup.position.z+velZ*dt));
          // smooth rotation toward velocity
          const targetRot=Math.atan2(velX,velZ);
          let rd=targetRot-playerGroup.rotation.y;
          while(rd>Math.PI)  rd-=Math.PI*2;
          while(rd<-Math.PI) rd+=Math.PI*2;
          playerGroup.rotation.y+=rd*Math.min(1,14*dt);
          // walk anim
          walkPhase+=dt*9;
          leftLeg.rotation.x  = Math.sin(walkPhase)*0.65;
          rightLeg.rotation.x = Math.sin(walkPhase+Math.PI)*0.65;
          leftArm.rotation.x  = Math.sin(walkPhase+Math.PI)*0.5;
          rightArm.rotation.x = Math.sin(walkPhase)*0.5;
          body.position.y     = 0.85+Math.sin(walkPhase*2)*0.035;
          head.position.y     = 1.65+Math.sin(walkPhase*2)*0.035;
        } else {
          body.position.y=0.85+Math.sin(t*1.8)*0.02;
          head.position.y=1.65+Math.sin(t*1.8)*0.02;
          leftArm.rotation.x = Math.sin(t*1.1)*0.09;
          rightArm.rotation.x= Math.sin(t*1.1+Math.PI)*0.09;
          leftLeg.rotation.x *=0.85;
          rightLeg.rotation.x*=0.85;
        }

        // Camera — follows loosely overhead so full world stays visible
        const camTx=playerGroup.position.x*0.4;
        const camTz=playerGroup.position.z*0.4;
        camera.position.x+=(camTx-camera.position.x)*Math.min(1,4*dt);
        camera.position.z+=(camTz-camera.position.z)*Math.min(1,4*dt);
        camera.lookAt(playerGroup.position.x,0,playerGroup.position.z);

        // ── Hub animations ──
        Object.entries(hubMeshes).forEach(([k,h])=>{
          h.t+=dt;
          h.orb.position.y=HUB_DATA[k].z>5 ? 3.92+0.18+Math.sin(h.t)*0.18 :
                           k==="home"      ? 3.98+Math.sin(h.t)*0.18 :
                                             3.38+Math.sin(h.t)*0.18;
          h.ring.rotation.z+=dt*0.5;
          h.pl.intensity=1.2+Math.sin(h.t*1.4)*0.4;
        });

        // ── Zone detection ──
        let nearest=null; let nearDist=3.4;
        Object.entries(HUB_DATA).forEach(([k,h])=>{
          const d=Math.hypot(playerGroup.position.x-h.x,playerGroup.position.z-h.z);
          if(d<nearDist){ nearDist=d; nearest=k; }
        });
        if(nearest!==prevStation.current){
          prevStation.current=nearest;
          setStation(nearest);
          setNearZone(nearest);
          if(nearest){ audio.sfx(440,"sine",0.2); setXp(x=>x+10); }
        }

        renderer.render(scene,camera);
      };
      animate(performance.now());

      return ()=>{
        cancelAnimationFrame(frame);
        window.removeEventListener("keydown",onKeyDown);
        window.removeEventListener("keyup",onKeyUp);
        window.removeEventListener("resize",onResize);
        window.removeEventListener("mousemove",moveJ);
        window.removeEventListener("mouseup",endJ);
        renderer.domElement.removeEventListener("click",onCanvasClick);
        renderer.dispose();
        audio.stop();
      };
    } catch(e){ console.error(e); setError(e.message); }
  },[gameState]);

  // ─────────────────────────────────────────────────────────
  //  STARTUP SCREEN
  // ─────────────────────────────────────────────────────────
  if(gameState==="STARTUP") return (
    <div className="g3-startup">
      <div className="g3-startup-bg"/>
      <div className="g3-startup-particles">
        {Array.from({length:24}).map((_,i)=>(
          <div key={i} className="g3-particle" style={{
            left:`${Math.random()*100}%`,
            animationDelay:`${Math.random()*4}s`,
            animationDuration:`${3+Math.random()*4}s`
          }}/>
        ))}
      </div>
      <div className="g3-startup-card">
        <div className="g3-startup-avatar-wrap">
          <div className="g3-startup-holoring"/>
          <img src={personalAvatar} alt="Patrick" className="g3-startup-avatar"/>
          <div className="g3-startup-holo-scan"/>
        </div>
        <div className="g3-startup-tag">INTERACTIVE PORTFOLIO</div>
        <h1 className="g3-startup-name">Patrick Ennin Selby</h1>
        <p className="g3-startup-sub">Cybersecurity Undergraduate · Builder · Defender</p>
        <div className="g3-startup-desc">
          Explore my world. Each zone tells a story — before vs. after I got involved.
          Walk in, see the chaos, then watch me fix it.
        </div>
        <div className="g3-startup-stats">
          <span>🎓 3.83 GPA</span>
          <span>🔐 NSF Research</span>
          <span>⚔️ 5+ Certs</span>
          <span>🌐 GSU · CodePath</span>
        </div>
        <button className="g3-startup-btn" onClick={()=>setGameState("PLAYING")}>
          <FaGamepad/> Enter My World
        </button>
        <Link to="/" className="g3-back-link"><FaArrowLeft/> Back to Portfolio</Link>
      </div>
    </div>
  );

  if(error) return <div className="g3-error"><FaArrowLeft/><Link to="/">Back</Link><p>{error}</p></div>;

  // ─────────────────────────────────────────────────────────
  //  CINEMA PANEL
  // ─────────────────────────────────────────────────────────
  const cinemaFrames = cinemaZone ? (CINEMA[cinemaZone]?.[cinemaPhase] || []) : [];
  const currentFrame = cinemaFrames[cinemaStep] || null;

  // ─────────────────────────────────────────────────────────
  //  ZONE QUICK-INFO (top strip when near zone)
  // ─────────────────────────────────────────────────────────
  const zoneInfo = nearZone ? HUB_DATA[nearZone] : null;

  // ─────────────────────────────────────────────────────────
  //  PLAYING UI
  // ─────────────────────────────────────────────────────────
  return (
    <div className="g3-root">
      {/* 3D Canvas */}
      <div ref={mountRef} className="g3-canvas"/>

      {/* ── TOP BAR ── */}
      <div className="g3-topbar">
        <Link to="/" className="g3-back-pill"><FaArrowLeft/> Portfolio</Link>
        <div className="g3-topbar-title">
          <span className="g3-topbar-crown">👑</span>
          <span>Patrick's World</span>
        </div>
        <div className="g3-topbar-right">
          <div className="g3-xp-badge">⚡ {xp} XP</div>
          <button className="g3-icon-btn" onClick={()=>{ setMuted(m=>{ audio.mute(!m); return !m; }); }} title="Mute">
            {muted?"🔇":"🔊"}
          </button>
          <button className="g3-icon-btn" onClick={toggleAudio} title="Music">
            {audioOn?"⏸":"▶"}
          </button>
        </div>
      </div>

      {/* ── ZONE STRIP (near zone label) ── */}
      {zoneInfo && (
        <div className="g3-zone-strip" style={{borderColor:zoneInfo.colorHex, boxShadow:`0 0 18px ${zoneInfo.colorHex}55`}}>
          <span className="g3-zone-strip-icon">{zoneInfo.icon}</span>
          <span className="g3-zone-strip-label" style={{color:zoneInfo.colorHex}}>{zoneInfo.label}</span>
          <span className="g3-zone-strip-tag">{zoneInfo.tagline}</span>
        </div>
      )}

      {/* ── COMPASS MAP ── */}
      <div className="g3-minimap">
        <div className="g3-minimap-title">🗺 Kingdom</div>
        {Object.entries(HUB_DATA).map(([k,h])=>(
          <div key={k} className={`g3-minimap-dot ${nearZone===k?"active":""}`}
               style={{
                 background:h.colorHex,
                 left:`${(h.x+26)/52*100}%`,
                 top:`${(h.z+26)/52*100}%`,
                 boxShadow: nearZone===k ? `0 0 10px ${h.colorHex}` : "none"
               }}
               title={h.label}/>
        ))}
      </div>

      {/* ── PATRICK BOT ── */}
      {botVisible && (
        <div className="g3-bot">
          <div className="g3-bot-avatar-wrap">
            <div className="g3-bot-holoring"/>
            <img src={personalAvatar} alt="Pat Bot" className="g3-bot-avatar"/>
            <div className="g3-bot-holo-pulse"/>
          </div>
          <div className="g3-bot-bubble">
            <div className="g3-bot-name">Pat Bot <span className="g3-bot-ai">AI</span></div>
            <div className="g3-bot-text">{botTyped}<span className={`g3-bot-cursor ${botDone?"hide":""}`}>|</span></div>
            <div className="g3-bot-actions">
              {cinemaZone && (
                <button className="g3-bot-cta" onClick={startCinema}>
                  {botCta} <FaChevronRight/>
                </button>
              )}
              <button className="g3-bot-close" onClick={()=>setBotVisible(false)}>✕</button>
            </div>
          </div>
        </div>
      )}
      {!botVisible && nearZone && (
        <button className="g3-bot-reopen" onClick={()=>setBotVisible(true)}>
          <img src={personalAvatar} alt="Pat Bot" className="g3-bot-reopen-img"/> Pat Bot
        </button>
      )}

      {/* ── CINEMA PANEL ── */}
      {cinemaZone && currentFrame && (
        <div className="g3-cinema">
          <div className={`g3-cinema-phase-badge ${cinemaPhase==="before"?"danger":"success"}`}>
            {cinemaPhase==="before" ? "⚠ WITHOUT PATRICK" : "✅ WITH PATRICK"}
          </div>
          <div className="g3-cinema-frame" key={`${cinemaZone}-${cinemaPhase}-${cinemaStep}`}>
            <div className="g3-cinema-emoji">{currentFrame.emoji}</div>
            <div className="g3-cinema-line">{currentFrame.line}</div>
          </div>
          <div className="g3-cinema-dots">
            {cinemaFrames.map((_,i)=>(
              <span key={i} className={`g3-cinema-dot ${i===cinemaStep?"active":""}`}
                    onClick={()=>{setCinemaStep(i);setCinemaAuto(false);}}/>
            ))}
          </div>
          <div className="g3-cinema-controls">
            {cinemaStep < cinemaFrames.length-1 ? (
              <button className="g3-cin-btn" onClick={()=>{ setCinemaStep(s=>s+1); }}>Next →</button>
            ) : cinemaPhase==="before" ? (
              <button className="g3-cin-btn success" onClick={flipPhase}>See the Fix ✅</button>
            ) : (
              <div className="g3-cinema-done">
                🏆 Mission Complete!
                {nearZone==="scansafe" && !phishOn && (
                  <button className="g3-cin-btn accent" onClick={startPhish}>Run Phishing Sim →</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PHISHING MINI-GAME ── */}
      {phishOn && (
        <div className="g3-phish">
          <div className="g3-phish-header">
            <span className="g3-phish-title">🔐 ScanSafe Simulator</span>
            <span className="g3-phish-prog">{phishIdx+1}/{PHISHING.length}</span>
            <button className="g3-phish-close" onClick={()=>setPhishOn(false)}><FaTimes/></button>
          </div>
          {phishFb ? (
            <div className={`g3-phish-fb ${phishFb.ok?"ok":"bad"}`}>{phishFb.text}</div>
          ) : (
            <>
              <div className="g3-phish-url">{PHISHING[phishIdx].url}</div>
              <div className="g3-phish-q">Is this URL safe?</div>
              <div className="g3-phish-btns">
                <button className="g3-phish-safe"  onClick={()=>answerPhish(true)}>✔ Safe</button>
                <button className="g3-phish-danger" onClick={()=>answerPhish(false)}>✘ Phishing</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── CONTROLS HINT ── */}
      <div className="g3-controls-hint">
        WASD / Arrows · Click anywhere to walk there · Enter a glowing zone
      </div>

      {/* ── JOYSTICK (mobile) ── */}
      <div ref={joystickRef} className="g3-joystick">
        <div className="g3-joystick-thumb"/>
      </div>

      {/* ── TOAST ── */}
      {toast && <div className="g3-toast">{toast}</div>}
    </div>
  );
}
