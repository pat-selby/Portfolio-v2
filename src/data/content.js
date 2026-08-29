// All site copy lives here so sections stay presentational.

export const profile = {
  name: "Patrick Ennin Selby",
  first: "Patrick",
  handle: "patrickselby.vercel.app",
  initials: "PES",
  role: "Cybersecurity Researcher",
  status: "open to summer 2027 internships",
  currently: "building on-device security tools",
  tagline: [
    "A cybersecurity sophomore at Grambling State University, originally from Ghana.",
    "I don't just learn security. I build it.",
  ],
  email: "patrickselby256@gmail.com",
  links: {
    github: "https://github.com/pat-selby",
    linkedin: "https://www.linkedin.com/in/patrick-ennin-selby-136253301",
    x: "https://x.com/selby_patrick05",
  },
};

export const about = {
  bio: [
    "I'm Patrick, a Cybersecurity sophomore (minor: CIS) at Grambling State University, born and raised in Ghana. I carry a 3.88 GPA and a genuine obsession with building things that protect people.",
    "At Grambling State University's AIoT Lab, under Dr. Vasanth Iyer, I built ScanSafe: a cross-platform iOS and Android app that catches QR phishing entirely on-device. The brief was open, just cybersecurity and OpenCV, so I picked the problem, designed all 22 detection rules myself, and benchmarked the engine for the research report.",
    "I am also an AI Fellow with AI4ALL Ignite, where my team trained a Random Forest classifier on 568K transactions to catch credit-card fraud, scoring it on precision and recall rather than accuracy.",
    "My focus is threat modeling, system monitoring, and secure communication for connected devices.",
  ],
  focus: [
    "Mobile security research that ships real code",
    "IoT security, locking down the devices nobody thinks about",
    "Applied ML for security, where the measurement matters as much as the model",
  ],
  skills: [
    {
      group: "Security",
      items: [
        "Threat modeling (STRIDE)",
        "Incident response",
        "Log analysis",
        "Vulnerability assessment",
        "Nmap",
        "Wireshark",
        "Linux CLI",
      ],
    },
    {
      group: "Data & AI",
      items: [
        "Python",
        "SQL",
        "Supervised classification",
        "Random Forest",
        "Precision / recall / F1",
      ],
    },
    {
      group: "Protocols & cloud",
      items: ["TLS/mTLS", "MQTT", "HMAC", "TCP/IP", "AWS Cloud Foundations"],
    },
    {
      group: "Platforms & tools",
      items: ["Swift/SwiftUI", "Kotlin", "OpenCV", "Git & GitHub", "Technical writing"],
    },
  ],
};

export const education = {
  school: "Grambling State University",
  degree: "B.S. Cybersecurity (Minor: CIS)",
  detail: "GPA 3.88 / 4.0",
  dates: "Jan 2025 - Dec 2028",
  coursework: [
    "Attacks, Threats & Vulnerabilities",
    "Data Structures & Algorithms",
    "Discrete Structures",
    "Probability & Statistics",
  ],
};

// Credential URLs lifted from the linked resume PDF, so every badge on the
// site points at the same proof an employer would get from the resume.
export const certifications = [
  {
    name: "CodePath Cybersecurity (CYB102)",
    issuer: "Honors",
    href: "https://drive.google.com/file/d/1LsUNAlsl1sF90s8I7BVB1q14Ou5Zgowg/view?usp=sharing",
  },
  {
    name: "AWS Academy Cloud Foundations",
    issuer: "Credly",
    href: "https://www.credly.com/badges/cf7adf90-a999-404f-9006-d724ab1f9bff/public_url",
  },
  {
    // Two of the eight courses in the Google Cybersecurity Professional
    // Certificate. Named individually so this never reads as the full cert.
    name: "Google Cybersecurity: Foundations of Cybersecurity",
    issuer: "Coursera",
    href: "https://coursera.org/share/7eaea79e8d3ddb5f4081d6be7732fd63",
  },
  {
    name: "Google Cybersecurity: Play It Safe",
    issuer: "Coursera",
    href: "https://coursera.org/share/998a31d3d1742ab6f7d65a6afcd63e91",
  },
  {
    name: "IBM SkillsBuild: AI",
    issuer: "IBM",
    href: "https://www.credly.com/badges/cfa24246-d433-4402-9991-05f090e0edab/public_url",
  },
  {
    name: "IBM SkillsBuild: Cybersecurity",
    issuer: "IBM",
    href: "https://www.credly.com/badges/c5383299-b317-47d8-83b2-f6efddbf0c77/public_url",
  },
  {
    name: "IBM SkillsBuild: Data",
    issuer: "IBM",
    href: "https://www.credly.com/badges/8ab62037-66d8-4e13-b0c5-b306543d4bf1/public_url",
  },
  {
    name: "IBM SkillsBuild: Digital World Skills",
    issuer: "IBM",
    href: "https://www.credly.com/badges/8c09d3af-06c3-4617-8c4e-a89d9fdc897f/public_url",
  },
];

export const affiliations = [
  "2026 IOBSE Conference",
  "TMCF DevCon Zone 2 Scholar (2026)",
  "ColorStack",
  "NSBE",
  "IEEE",
  "Cloud Security Alliance",
  "S.E.C.U.R.E. Cybersecurity Club (GSU)",
];

export const experience = [
  {
    org: "Grambling State University",
    team: "AIoT Lab, under Dr. Vasanth Iyer, Grambling, LA",
    role: "Research Assistant",
    dates: "Mar 2026 - May 2026",
    current: false,
    logo: "aiot_lab.png",
    bullets: [
      "Built ScanSafe, a cross-platform iOS (Swift/SwiftUI) and Android (Kotlin) app that flags a malicious QR-code link in under 5ms, fast enough to warn the user before the page opens, using a 22-rule heuristic URL engine that runs fully on-device with zero URLs transmitted and zero camera frames stored.",
      "Benchmarked the engine against a 28-URL corpus for an NSF research report, establishing an 85% true-positive rate on commodity phishing.",
      "Used the measured gap on sophisticated attacks to justify a machine-learning phase rather than adding more fixed rules.",
    ],
    tools: ["Swift/SwiftUI", "Kotlin", "OpenCV", "Python", "Git"],
  },
  {
    org: "AI4ALL Ignite",
    team: "National AI program, remote",
    role: "AI Fellow",
    dates: "Jun 2026 - Present",
    current: true,
    logo: null,
    bullets: [
      "Built a credit-card fraud detection model with a 5-person team, training a Random Forest classifier on 568K transactions.",
      "Scored the model on precision, recall, and F1 rather than accuracy, since a model that ignores the rare fraud class still looks correct while missing every actual fraud.",
      "Authored the Datasets and Training/Testing sections of the team research proposal, defining the split and evaluation methodology so results stayed comparable across every teammate's runs.",
    ],
    tools: ["Python", "Random Forest", "scikit-learn", "Model evaluation"],
  },
  {
    org: "Hydroficient (via Extern)",
    team: "Remote, Certificate of Completion",
    certHref: "https://drive.google.com/file/d/1ykKCIxiV0DH0MTabyHMP_0dvTANDq1wj/view?usp=sharing",
    role: "IoT Cyber Defense Extern",
    dates: "Feb 2026 - Mar 2026",
    logo: "iot_externship.png",
    bullets: [
      "Hardened a simulated MQTT telemetry pipeline during a structured externship, mapping the attack surface with STRIDE.",
      "Closed replay attacks with a 3-layer defense of timestamps, sequence counters, and HMAC, so a captured device message cannot be re-sent as valid.",
      "Enforced device identity with TLS/mTLS across the pipeline.",
    ],
    tools: ["MQTT", "STRIDE", "TLS/mTLS", "HMAC", "Wireshark", "Linux"],
  },
  {
    org: "TrustLight",
    team: "PROPEL Future of Tech Innovation Challenge, GSU",
    role: "Creator & Research Lead",
    dates: "Feb 2026",
    // Pitched, not built. Labelled so it can never read as shipped work.
    concept: true,
    logo: null,
    bullets: [
      "Pitched a concept for AI-assisted emergency-alert verification.",
      "Built the case on a STEEP risk model synthesized from 20+ peer-reviewed sources, showing how a false alert outruns official correction across five platforms.",
    ],
    tools: ["STEEP analysis", "Research synthesis", "Technical writing"],
  },
];

// Horizontally-scrolling strip of playable sandboxes.
export const sandboxes = [
  {
    id: "scansafe",
    kicker: "Simulator",
    title: "ScanSafe URL scanner",
    blurb:
      "Paste any URL and watch all 22 on-device heuristics fire in real time, with a live risk score.",
    image: "scansafe_app.png",
    href: "/demos?tab=scansafe",
  },
  {
    id: "risk",
    kicker: "Interactive",
    title: "Threat modeler",
    blurb:
      "Pick assets for a fictional healthcare company and see the risk matrix rebuild itself as you go.",
    image: "risk_assessment.png",
    href: "/demos?tab=risk",
  },
  {
    id: "splunk",
    kicker: "Investigation",
    title: "Splunk incident hunt",
    blurb:
      "Work a simulated breach from first alert to root cause, one query at a time.",
    image: "incident_response.png",
    href: "/demos?tab=splunk",
  },
];

export const projects = [
  {
    id: "scansafe",
    title: "ScanSafe",
    subtitle: "On-device QR phishing detection, iOS and Android",
    image: "scansafe_app.png",
    summary:
      "A cross-platform app that catches phishing links hidden in QR codes entirely on the phone, with no internet needed. It flags a malicious link in under 5ms, fast enough to warn you before the page opens.",
    outcome: "85% true-positive rate on a 28-URL corpus, benchmarked for an NSF research report",
    tags: ["iOS & Android", "Mobile security", "Research"],
    links: [
      { label: "GitHub", href: "https://github.com/pat-selby/scan-safe" },
      { label: "Live demo", href: "/demos?tab=scansafe", internal: true },
    ],
    built:
      "Swift/SwiftUI on iOS and Kotlin on Android, over an OpenCV 4.13 computer-vision pipeline and a 22-rule heuristic URL engine I designed from scratch. No cloud lookups and no pretrained models, so zero URLs are transmitted and zero camera frames are stored.",
    challenge:
      "Cloud reputation APIs are accurate but slow, and they leak every URL you scan. Getting comparable signal from purely local parsing meant designing each of the 22 rules by hand and tuning them against real phishing samples.",
    learned:
      "Benchmarking mattered more than adding rules. Measuring the engine at 85% on commodity phishing exposed exactly where fixed heuristics stop working, which is what justified moving to a machine-learning phase instead of writing rule 23.",
  },
  {
    id: "uniqr",
    title: "UniQR",
    subtitle: "System-wide QR reader for Windows",
    image: "uniqr.png",
    summary:
      "Press one hotkey and every QR code visible anywhere on your screen gets decoded and copied. No reaching for your phone to scan a code your computer is already displaying.",
    outcome: "Decodes 17/17 hostile screen conditions, inverted and tilted codes included",
    tags: ["Windows", "Computer vision", "Tooling"],
    links: [],
    built:
      "Python and OpenCV. Frames come straight off a GDI BitBlt as numpy arrays with no image-file round trip, and both of OpenCV's QR detectors run on every capture because they fail on different things. The tray icon, the global hotkey, and the picker overlay are raw Win32 plus tkinter.",
    challenge:
      "Neither detector can see a light-on-dark code at all, measured at 0% across every rotation, and dark-mode sites and slide decks produce those constantly. Every scan now runs against an inverted copy too, with the expensive tiling and upscaling passes held back for when the cheap ones come back empty.",
    learned:
      "Studying where the detectors returned nothing was worth more than tuning the cases they already handled. Almost all of the hit rate came from naming each failure condition and adding one cheap pass for it.",
  },
  {
    id: "risk",
    title: "IT Risk Assessment & Data Classification",
    subtitle: "BayouCare lab",
    image: "risk_assessment.png",
    summary:
      "I mapped a fictional healthcare company's digital assets, ranked their risks, and recommended the security controls most worth their time and money.",
    outcome: "Full asset inventory with prioritized, costed controls",
    tags: ["Risk", "Governance", "Frameworks"],
    links: [
      { label: "GitHub", href: "https://github.com/pat-selby/bayoucare-risk-classification-lab" },
      { label: "Live demo", href: "/demos?tab=risk", internal: true },
    ],
    built:
      "Inventoried every asset, classified data by sensitivity, then scored each risk on likelihood and impact to rank remediation order.",
    challenge:
      "Every risk looks urgent in isolation. The hard part was defending why a given control should come second, in terms a non-technical budget owner would accept.",
    learned:
      "Security work is mostly prioritization. A recommendation nobody can afford to act on isn't a recommendation.",
  },
  {
    id: "splunk",
    title: "Linux Security Monitoring & Incident Response",
    subtitle: "PineRidge lab",
    image: "incident_response.png",
    summary:
      "I investigated a simulated security incident on Linux, tracing every file change, identifying the culprit process, and writing up exactly how to prevent it next time.",
    outcome: "Root cause traced end to end, with a written prevention plan",
    tags: ["Blue team", "Forensics", "Linux"],
    links: [
      { label: "GitHub", href: "https://github.com/pat-selby/pineridge-incident-response-lab" },
      { label: "Live demo", href: "/demos?tab=splunk", internal: true },
    ],
    built:
      "auditd for file integrity monitoring, Splunk to correlate the logs, and standard Linux tooling to walk the process tree back to the origin.",
    challenge:
      "Audit logs are overwhelmingly noisy. Separating the handful of events that mattered from thousands of routine ones took several passes of filtering.",
    learned:
      "Writing the postmortem is where the investigation actually gets tested. If you can't explain the chain simply, you haven't finished tracing it.",
  },
];
