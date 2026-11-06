// All site copy lives here so sections stay presentational.
// Every claim and number traces to the November 2026 AfroTech resumes
// (Resumes/AfroTech_Print_2026_Updated). Items marked "master only" come from
// Patrick_Selby_MASTER.tex and are kept because nothing in AfroTech contradicts them.

export const profile = {
  name: "Patrick Ennin Selby",
  first: "Patrick",
  handle: "patrickselby.vercel.app",
  initials: "PES",
  role: "Cybersecurity student",
  status: "open to summer 2027 internships",
  currently: "B.S. Cybersecurity, Grambling State, expected May 2028",
  tagline: [
    "A cybersecurity sophomore at Grambling State University, originally from Ghana.",
    "I build security tools and measure how well they work.",
  ],
  email: "patrickselby256@gmail.com",
  links: {
    github: "https://github.com/pat-selby",
    linkedin: "https://www.linkedin.com/in/pat-selby",
    x: "https://x.com/selby_patrick05",
  },
};

export const about = {
  bio: [
    "I'm Patrick, a cybersecurity sophomore at Grambling State University with a minor in Computer Information Systems and a 3.88 GPA. I was born and raised in Ghana.",
    "I like tools that show their numbers. UniQR reads QR codes off my screen without a phone. It decodes 96.8% of 1,064 damaged test codes with zero wrong decodes, and porting it to C++20 cut the median scan from 115 to 5 ms.",
    "At Grambling's AIoT Lab I built ScanSafe, which checks a URL for phishing risk without sending it to an outside reputation service. On a 28-URL baseline it caught 85% of commodity phishing but only 30% of sophisticated attacks. That gap is the part I find most interesting.",
    "In summer 2026 I was an AI4ALL Ignite Machine Learning Research Fellow, benchmarking ways to make language-model inference faster and lighter with a four-person team.",
  ],
  skills: [
    {
      group: "Languages",
      items: ["Python", "C++20", "TypeScript", "SQL", "Bash", "Kotlin"],
    },
    {
      group: "Security",
      items: [
        "MITRE ATT&CK",
        "Log correlation",
        "Incident triage",
        "STRIDE",
        "Wireshark",
        "MQTT",
        "HMAC",
        "TLS/mTLS",
        "Technical runbooks",
      ],
    },
    {
      group: "Systems & ML",
      items: ["CUDA", "PyTorch", "Multithreading", "Isolation Forest", "Linux", "Windows Server"],
    },
    {
      group: "Apps, cloud & tooling",
      items: [
        "React",
        "PostgreSQL",
        "OpenCV",
        "Flask",
        "AWS S3, Lambda, IAM",
        "pytest",
        "CMake / CTest",
        "GitHub Actions CI",
        "Git & GitHub",
      ],
    },
  ],
};

export const education = {
  school: "Grambling State University",
  degree: "B.S. Cybersecurity, Minor in Computer Information Systems",
  detail: "GPA 3.88 / 4.00",
  dates: "Expected May 2028",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Operating Systems",
    "Software Security",
    "Networking",
    "Computer Systems Architecture",
  ],
};

// Master only. Credential URLs lifted from the earlier resume PDF, so every
// badge on the site points at the same proof an employer would get.
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
    name: "IBM SkillsBuild",
    issuer: "AI · Cybersecurity · Data · Digital World Skills",
    href: "https://www.credly.com/users/patrick-selby",
  },
];

// Master only, except the two campus groups, which are on the AfroTech resumes.
export const affiliations = [
  "Grambling Cybersecurity Alliance",
  "ColorStack",
  "2026 IOBSE Conference",
  "TMCF DevCon Zone 2 Scholar (2026)",
  "NSBE",
  "IEEE",
  "Cloud Security Alliance",
];

export const experience = [
  {
    id: "ai4all",
    org: "AI4ALL Ignite",
    team: "Remote",
    role: "Machine Learning Research Fellow",
    dates: "Jun 2026 - Aug 2026",
    logo: "ai4all_logo",
    bullets: [
      "Investigated language-model inference performance by profiling KV-cache overhead and dynamic batching, identifying 3 bottlenecks and reducing response latency by 25%.",
      "Built PyTorch/CUDA harnesses for multi-head attention, increasing tensor-core utilization by 28% under high concurrency.",
      "Benchmarked quantization, kernel fusion, KV-cache compression, and dynamic batching with a four-person team, reducing GPU memory usage by 34% and increasing throughput 2.4x in a co-authored technical report.",
    ],
    tools: ["Python", "PyTorch", "CUDA"],
  },
  {
    id: "codepath-swe",
    org: "CodePath",
    team: "Remote",
    role: "Software Engineering Fellow",
    dates: "Feb 2026 - May 2026",
    logo: "codepath_logo.png",
    bullets: [
      "Built a security-log processing pipeline to automate event intake, using Python and PostgreSQL to ingest 150K+ unstructured logs and reduce ingestion time by 85%.",
      "Architected multithreaded regex analysis across 50K concurrent event streams, cutting intrusion-detection latency by 35% in the security-event pipeline.",
      "Debugged and validated 14 backend modules with pytest, achieving 95% branch coverage and catching 14 critical bugs before deployment.",
    ],
    tools: ["Python", "PostgreSQL", "Multithreading", "pytest"],
  },
  {
    // Same program, security face (Cyber resume). FACTS.md: one face per view.
    id: "codepath-cyber",
    org: "CodePath",
    team: "Remote",
    role: "Threat Detection Analyst",
    dates: "Feb 2026 - May 2026",
    logo: "codepath_logo.png",
    bullets: [
      "Investigated a Windows privilege-escalation scenario by correlating 4 event sources, reconstructing token theft and service installation, and mapping findings to MITRE ATT&CK T1134.001.",
      "Developed time-window correlation logic linking privilege adjustments and service installations to distinguish suspicious activity from routine administration.",
      "Documented attack evidence and correlation logic in a triage runbook to support repeatable investigations.",
    ],
    tools: ["MITRE ATT&CK", "Log correlation", "Incident triage"],
  },
  {
    id: "aiot",
    org: "Grambling State University",
    team: "AIoT Lab, Grambling, LA",
    role: "Security Research Assistant",
    dates: "Mar 2026 - May 2026",
    logo: "aiot_lab.png",
    bullets: [
      "Built ScanSafe to assess phishing risk without sending URLs to external reputation services, implementing a 22-rule Python engine, Flask prototype, and Kotlin companion with engine evaluation under 5 ms.",
      "Established a 28-URL evaluation baseline with 85% commodity-phishing detection, 30% sophisticated-attack detection, and about 8% false positives to expose coverage gaps.",
    ],
    tools: ["Python", "Flask", "Kotlin"],
  },
  {
    id: "hydroficient",
    org: "Hydroficient (via Extern)",
    team: "Remote, Certificate of Completion",
    certHref: "https://drive.google.com/file/d/1ykKCIxiV0DH0MTabyHMP_0dvTANDq1wj/view?usp=sharing",
    role: "IoT Security Extern",
    dates: "Feb 2026 - Mar 2026",
    logo: "iot_externship.png",
    bullets: [
      "Assessed connected-device security for an MQTT fleet using STRIDE threat modeling, prioritizing 2 high-severity risks by likelihood and impact.",
      "Implemented timestamps, monotonic counters, and HMAC checks to reject replayed messages, with per-device certificates over mutual TLS to authenticate connections.",
      "Developed an Isolation Forest telemetry detector to surface abnormal device traffic and prioritize investigation of suspicious behavior.",
    ],
    tools: ["MQTT", "STRIDE", "HMAC", "TLS/mTLS", "Isolation Forest"],
  },
  {
    id: "cyberforce",
    org: "DOE CyberForce Competition",
    team: "Grambling State University team",
    role: "Blue Team Member",
    dates: "Nov 2025",
    logo: "cyberforce_logo",
    bullets: [
      "Defended enterprise and industrial-control infrastructure in DOE CyberForce with a six-member team, maintaining 97% availability across 6 critical services and placing in the top 10% nationally.",
      "Investigated 23 host and network events with Wireshark, logs, and command-line tools, identifying 8 high-confidence incidents and remediating 14 security misconfigurations.",
      "Automated 3 recurring checks with Python and Bash, cutting environment-validation time from approximately 20 minutes to under 5 minutes during live adversarial activity.",
    ],
    tools: ["Wireshark", "Python", "Bash"],
  },
  {
    // Master only. Pitched, not built. Labelled so it can never read as shipped work.
    id: "trustlight",
    org: "TrustLight",
    team: "PROPEL Future of Tech Innovation Challenge, GSU",
    role: "Creator & Research Lead",
    dates: "Feb 2026",
    concept: true,
    logo: null,
    bullets: [
      "Pitched a concept for AI-assisted emergency-alert verification.",
      "Built the case on a STEEP risk model synthesized from 20+ peer-reviewed sources, showing how a false alert outruns official correction across five platforms.",
    ],
    tools: ["STEEP analysis", "Research synthesis", "Technical writing"],
  },
];

export const leadership = [
  {
    id: "gca",
    org: "Grambling Cybersecurity Alliance",
    team: "Grambling State University",
    role: "Technical Development Chair",
    dates: "Jan 2026 - Present",
    current: true,
    logo: null,
    bullets: [
      "Organized 18 Hack The Box and TryHackMe prep sessions; all 3 competitors placed in the top 10%, and the team was selected for DOE's 2026 CyberForce Competition.",
      "Wrote 10 walkthroughs, preparing 15 first-time competitors for 4 CTFs and hackathons.",
    ],
    tools: [],
  },
  {
    id: "tigerhacks",
    org: "TigerHacks",
    team: "Grambling, LA",
    role: "Organizer",
    dates: "Aug 2026",
    logo: null,
    bullets: [
      "Led a 60-participant hackathon, securing 4 sponsors, $3,500 in funding and prizes, and 8 industry mentors.",
    ],
    tools: [],
  },
  {
    id: "colorstack",
    org: "ColorStack Grambling",
    team: "Grambling State University",
    role: "Events Committee Member",
    dates: "Aug 2025 - Present",
    current: true,
    logo: "colorstack_logo",
    bullets: [
      "Co-organized 4 career events reaching 200+ students and reviewed 40 peers' resumes, with 65% securing tech internship interviews.",
    ],
    tools: [],
  },
  {
    // Cyber resume wording.
    id: "gca-cyber",
    org: "Grambling Cybersecurity Alliance",
    team: "Grambling State University",
    role: "Technical Development Chair",
    dates: "Jan 2026 - Present",
    current: true,
    logo: null,
    bullets: [
      "Organized 18 technical preparation sessions and wrote 10 walkthroughs, preparing 15 first-time competitors for 4 CTFs and hackathons.",
    ],
    tools: [],
  },
  {
    // SWE resume wording.
    id: "gca-swe",
    org: "Grambling Cybersecurity Alliance",
    team: "Grambling State University",
    role: "Technical Development Chair",
    dates: "Jan 2026 - Present",
    current: true,
    logo: null,
    bullets: [
      "Organized 18 Hack The Box and TryHackMe prep sessions; all 3 competitors placed in the top 10%, and the team was selected for DOE's 2026 CyberForce Competition.",
    ],
    tools: [],
  },
  {
    // Cyber resume wording.
    id: "colorstack-cyber",
    org: "ColorStack Grambling",
    team: "Grambling State University",
    role: "Events Committee Member",
    dates: "Aug 2025 - Present",
    current: true,
    logo: "colorstack_logo",
    bullets: [
      "Co-organized 4 campus career events reaching 200+ students and reviewed 40 peers' resumes to support technical career preparation.",
    ],
    tools: [],
  },
];

// Horizontally-scrolling strip of playable sandboxes.
export const sandboxes = [
  {
    id: "scansafe",
    kicker: "Simulator",
    title: "ScanSafe URL scanner",
    blurb:
      "Paste a URL and try a simplified version of ScanSafe's rule checks, with a live risk score.",
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
    id: "uniqr",
    title: "UniQR",
    subtitle: "Read on-screen QR codes without a phone",
    image: "uniqr.png",
    // Patrick's 28-second launch video (also posted on LinkedIn).
    video: "uniqr-demo.mp4",
    summary:
      "I built UniQR so I could read a QR code on my own screen without reaching for my phone. The first version uses Python and OpenCV. Later I ported the scanner and Windows app to C++20 with no OpenCV at all.",
    outcome:
      "96.8% of 1,064 damaged codes across 7 formats, zero wrong decodes. Median scan 115 to 5 ms in C++20. 20 releases with pytest and GitHub Actions CI.",
    tags: ["Computer vision", "Python", "C++20"],
    links: [{ label: "GitHub", href: "https://github.com/pat-selby/uniqr" }],
  },
  {
    id: "packetshield",
    title: "PacketShield",
    subtitle: "Does a GPU help with packet inspection?",
    image: null,
    summary:
      "PacketShield tests whether GPU acceleration pays off for network packet inspection. It runs C++20/CUDA signature-matching kernels over 100K-packet batches, with pinned memory and asynchronous transfers.",
    outcome:
      "On an NVIDIA T4, batch runtime fell from 429.5 to 32.1 ms against a multithreaded CPU baseline, with 100% CPU/GPU verdict agreement on the synthetic test batch.",
    tags: ["GPU", "C++20", "CUDA"],
    links: [{ label: "GitHub", href: "https://github.com/pat-selby/packetshield-agentic" }],
  },
  {
    id: "scansafe",
    title: "ScanSafe",
    subtitle: "Phishing-risk checks that keep your URLs to yourself",
    image: "scansafe_app.png",
    summary:
      "ScanSafe scores a URL for phishing risk without sending it to an outside reputation service. It's a 22-rule Python engine with a Flask prototype and a Kotlin companion app, and the engine evaluates a URL in under 5 ms.",
    outcome:
      "28-URL baseline: 85% of commodity phishing caught, 30% of sophisticated attacks, about 8% false positives.",
    tags: ["Phishing detection", "Python", "Research"],
    links: [
      { label: "GitHub", href: "https://github.com/pat-selby/scan-safe" },
      { label: "Live demo", href: "/demos?tab=scansafe", internal: true },
    ],
  },
  {
    // Kairo limits (handoff note, November 1, 2026): user-confirmed 2nd place,
    // four-person team, local React changes in three areas. No claim of backend
    // ownership, merged code, production deployment, or working AI planning.
    id: "kairo",
    title: "Kairo",
    subtitle: "AI research workspace, team hackathon project",
    image: null,
    // Team demo video (69 s, 28 MB): click to play, never autoloaded.
    video: "kairo-demo.mp4",
    videoOnClick: true,
    summary:
      "Kairo is a team-built workspace for planning and running research experiments. My part was local React fixes in three areas, checked against 91 frontend tests, a clean build, and go vet. I documented 2 backend test failures I hit locally. I also prepared a manual-plan demo that ran an experiment against live PostgreSQL in about 18 to 19 seconds.",
    outcome: "2nd place at Grambling's Hacktoberfest Hack Day with a 4-person team.",
    tags: ["Hackathon", "React", "Team project"],
    links: [{ label: "Team repo", href: "https://github.com/Alanperry1/Kario" }],
  },
  {
    id: "cloudcampus",
    title: "CloudCampus",
    subtitle: "Serverless student-document pipeline on AWS",
    image: null,
    summary:
      "An upload to S3 triggers a Lambda function that extracts the document's text, so student paperwork gets processed without anyone retyping it. The IAM role can reach only the bucket and actions the pipeline needs.",
    outcome: "50+ PDFs processed. A 3-hour manual workflow now takes under 30 minutes.",
    tags: ["Cloud", "AWS", "Python"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/pat-selby/cloudcampus-serverless-document-pipeline",
      },
    ],
  },
  {
    // Master only.
    id: "risk",
    title: "IT Risk Assessment & Data Classification",
    subtitle: "BayouCare lab",
    image: "risk_assessment.png",
    summary:
      "I inventoried a simulated organization's assets, sorted its data into sensitivity tiers, and ranked each risk by likelihood and impact to decide which controls come first.",
    outcome: "5+ security controls prioritized",
    tags: ["Risk", "Governance", "Lab"],
    links: [
      { label: "GitHub", href: "https://github.com/pat-selby/bayoucare-risk-classification-lab" },
      { label: "Live demo", href: "/demos?tab=risk", internal: true },
    ],
  },
  {
    // Master only.
    id: "splunk",
    title: "Linux Security Monitoring & Incident Response",
    subtitle: "PineRidge lab",
    image: "incident_response.png",
    summary:
      "Someone was changing protected files on a Linux box. I set auditd watch rules and rebuilt the timeline with ausearch until I found the process responsible.",
    outcome: "Root cause found, with 3 ranked control recommendations and chain-of-custody notes",
    tags: ["Blue team", "Forensics", "Lab"],
    links: [
      { label: "GitHub", href: "https://github.com/pat-selby/pineridge-incident-response-lab" },
      { label: "Live demo", href: "/demos?tab=splunk", internal: true },
    ],
  },
];

// The three ways a visitor can meet Patrick. General is the default; Cyber and
// SWE mirror the AfroTech Cyber and SWE resumes entry for entry.
export const views = {
  general: {
    label: "General me",
    blurb: "The whole picture: security, software, and the groups I help run.",
    tagline: "I build security tools and measure how well they work.",
    experience: ["ai4all", "codepath-swe", "aiot", "hydroficient", "cyberforce", "trustlight"],
    leadership: ["gca", "tigerhacks", "colorstack"],
    projects: ["uniqr", "packetshield", "scansafe", "kairo", "cloudcampus", "risk", "splunk"],
    skills: about.skills,
    coursework: education.coursework,
    resume: "swe",
  },
  cyber: {
    label: "Cyber me",
    blurb: "Detection, IoT security, and phishing-risk research.",
    tagline: "I work on detection, IoT security, and phishing-risk research.",
    experience: ["codepath-cyber", "hydroficient", "cyberforce", "aiot"],
    leadership: ["gca-cyber", "colorstack-cyber"],
    projects: ["scansafe", "cloudcampus", "splunk", "risk"],
    skills: [
      {
        group: "Programming & systems",
        items: ["Python", "Bash", "Kotlin", "Linux", "Windows Server", "Git & GitHub"],
      },
      {
        group: "Security engineering",
        items: [
          "MITRE ATT&CK",
          "Log correlation",
          "Incident triage",
          "STRIDE",
          "Isolation Forest",
          "Technical runbooks",
        ],
      },
      {
        group: "Networking & crypto",
        items: ["Wireshark", "MQTT", "HMAC", "TLS/mTLS", "Per-device certificates"],
      },
      {
        group: "Cloud & applications",
        items: ["AWS S3, Lambda, IAM", "Least privilege", "Flask", "Automated validation"],
      },
    ],
    coursework: [
      "Software Security",
      "Networking",
      "Operating Systems",
      "Computer Systems Architecture",
      "Data Structures & Algorithms",
    ],
    resume: "cyber",
  },
  swe: {
    label: "SWE me",
    blurb: "Fast, tested tools in Python, C++20, and CUDA.",
    tagline: "I build fast, tested tools in Python, C++20, and CUDA.",
    experience: ["codepath-swe", "ai4all"],
    leadership: ["tigerhacks", "colorstack", "gca-swe"],
    projects: ["uniqr", "packetshield", "kairo"],
    skills: [
      { group: "Languages", items: ["Python", "C++20", "TypeScript", "SQL"] },
      { group: "Applications & data", items: ["React", "PostgreSQL", "OpenCV"] },
      {
        group: "Systems & quality",
        items: [
          "Multithreading",
          "CUDA",
          "PyTorch",
          "Git & GitHub",
          "GitHub Actions CI",
          "pytest",
          "CMake",
          "CTest",
        ],
      },
    ],
    coursework: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Operating Systems",
      "Software Security",
    ],
    resume: "swe",
  },
};

// Picks entries by id, in the order the view lists them.
export const pick = (list, ids) => ids.map((id) => list.find((x) => x.id === id)).filter(Boolean);
