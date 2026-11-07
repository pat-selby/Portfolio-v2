// All site copy. Every claim and number comes from Patrick's November 2026
// AfroTech resumes (SWE and Cyber, May 2028). Do not add numbers that are not
// in those files.

export type LensKey = "general" | "cyber" | "swe";

export const profile = {
  name: "Patrick Selby",
  email: "patrickselby256@gmail.com",
  github: "https://github.com/pat-selby",
  linkedin: "https://www.linkedin.com/in/pat-selby",
  x: "https://x.com/selby_patrick05",
  instagram: "https://www.instagram.com/selbyte.pat/" as string | null,
  school: "Grambling State University",
  degree: "B.S. Cybersecurity, Minor in Computer Information Systems",
  gpa: "3.88 / 4.00",
};

export const lenses: Record<
  LensKey,
  {
    label: string;
    headline: string;
    sub: string;
    resume: string;
    projects: string[];
    work: string[];
    leadership: string[];
    skills: { group: string; items: string[] }[];
  }
> = {
  general: {
    label: "General",
    headline: "I fix the pain points I live with.",
    sub: "I love coding, mostly when it solves something that matters to me and the people around me. Lately that means dev tools for my life as a student.",
    resume: "/resume/patrick-selby-resume-swe.pdf",
    projects: ["uniqr", "packetshield", "scansafe", "kairo", "cloudcampus", "risk", "linux-ir"],
    work: ["ai4all", "codepath-swe", "aiot", "hydroficient", "cyberforce"],
    leadership: ["gca", "tigerhacks", "colorstack"],
    skills: [
      { group: "Languages", items: ["Python", "C++20", "TypeScript", "SQL", "Bash", "Kotlin"] },
      { group: "Security", items: ["MITRE ATT&CK", "Log correlation", "STRIDE", "Wireshark", "HMAC", "TLS/mTLS"] },
      { group: "Systems", items: ["CUDA", "PyTorch", "Multithreading", "Linux", "AWS S3, Lambda, IAM"] },
    ],
  },
  cyber: {
    label: "Cyber",
    headline: "I fix security pain points, then test them.",
    sub: "Phishing hidden in QR codes, replayed device messages, noisy Windows logs. I build the fix, then check how well it holds up.",
    resume: "/resume/patrick-selby-resume-cyber.pdf",
    projects: ["scansafe", "cloudcampus", "linux-ir", "risk"],
    work: ["codepath-cyber", "hydroficient", "cyberforce", "aiot"],
    leadership: ["gca-cyber", "colorstack-cyber"],
    skills: [
      { group: "Security", items: ["MITRE ATT&CK", "Log correlation", "Incident triage", "STRIDE", "Isolation Forest", "Runbooks"] },
      { group: "Network & crypto", items: ["Wireshark", "MQTT", "HMAC", "TLS/mTLS", "Per-device certificates"] },
      { group: "Systems & cloud", items: ["Python", "Bash", "Kotlin", "Linux", "Windows Server", "AWS S3, Lambda, IAM"] },
    ],
  },
  swe: {
    label: "SWE",
    headline: "I love coding. Fast tools, mostly.",
    sub: "Python, C++20, and CUDA projects with real benchmarks behind them, plus releases you can download.",
    resume: "/resume/patrick-selby-resume-swe.pdf",
    projects: ["uniqr", "packetshield", "kairo"],
    work: ["codepath-swe", "ai4all"],
    leadership: ["tigerhacks", "colorstack", "gca-swe"],
    skills: [
      { group: "Languages", items: ["Python", "C++20", "TypeScript", "SQL"] },
      { group: "Apps & data", items: ["React", "PostgreSQL", "OpenCV"] },
      { group: "Systems & quality", items: ["Multithreading", "CUDA", "PyTorch", "pytest", "CMake", "CTest", "GitHub Actions CI"] },
    ],
  },
};

export const receipts = [
  { value: "96.8%", label: "of 1,064 damaged QR codes decoded, zero wrong" },
  { value: "115 → 5 ms", label: "median UniQR scan after the C++20 port" },
  { value: "429.5 → 32.1 ms", label: "PacketShield batch on an NVIDIA T4" },
  { value: "85%", label: "commodity phishing caught on a 28-URL baseline" },
  { value: "2nd place", label: "Grambling Hacktoberfest Hack Day, Kairo team" },
];

export type Project = {
  id: string;
  title: string;
  stack: string;
  summary: string;
  result: string;
  image?: string;
  video?: string;
  videoOnClick?: boolean;
  href?: string;
  hrefLabel?: string;
};

export const projects: Project[] = [
  {
    id: "uniqr",
    title: "UniQR",
    stack: "Python · C++20 · OpenCV · pytest",
    summary: "I kept asking: if my phone can scan a QR code, why can't my laptop? So I built UniQR. Then I rewrote it in C++20 without OpenCV.",
    result: "96.8% of 1,064 damaged codes across 7 formats, zero wrong decodes. 20 releases with CI.",
    video: "/assets/uniqr-demo.mp4",
    image: "/assets/uniqr.webp",
    href: "https://github.com/pat-selby/uniqr",
    hrefLabel: "Code",
  },
  {
    id: "packetshield",
    title: "PacketShield",
    stack: "C++20 · CUDA · CMake · CTest",
    summary: "I wanted to know if a GPU really helps packet inspection. So I wrote CUDA signature-matching kernels and ran them against a CPU baseline.",
    result: "429.5 to 32.1 ms per batch on an NVIDIA T4, 100% CPU/GPU verdict agreement on the synthetic batch.",
    href: "https://github.com/pat-selby/packetshield-agentic",
    hrefLabel: "Code",
  },
  {
    id: "scansafe",
    title: "ScanSafe",
    stack: "Python · Flask · Kotlin",
    summary: "QR codes can hide phishing links. ScanSafe scores a URL without sending it to an outside service: 22 rules, under 5 ms.",
    result: "85% commodity phishing, 30% sophisticated attacks, about 8% false positives on 28 URLs.",
    image: "/assets/scansafe_app.webp",
    href: "https://github.com/pat-selby/scan-safe",
    hrefLabel: "Code",
  },
  {
    id: "kairo",
    title: "Kairo",
    stack: "Team project · React fixes",
    summary: "A team hackathon build: a workspace for planning and running research experiments. I fixed React issues in three areas and prepared the manual-plan demo.",
    result: "2nd place at Grambling's Hacktoberfest Hack Day with a 4-person team.",
    // Team demo video (69 s, 28 MB): loads only when someone presses play.
    video: "/assets/kairo-demo.mp4",
    videoOnClick: true,
    href: "https://github.com/Alanperry1/Kario",
    hrefLabel: "Team repo",
  },
  {
    id: "cloudcampus",
    title: "CloudCampus",
    stack: "Python · AWS S3 · Lambda · IAM",
    summary: "Student paperwork, without the retyping. An S3 upload triggers a Lambda that pulls out the text, under an IAM role that touches only what it needs.",
    result: "50+ PDFs processed. A 3-hour manual workflow now takes under 30 minutes.",
    href: "https://github.com/pat-selby/cloudcampus-serverless-document-pipeline",
    hrefLabel: "Code",
  },
  {
    id: "risk",
    title: "Risk assessment lab",
    stack: "Asset inventory · Data classification",
    summary: "Inventoried a simulated organization's assets and ranked risks by likelihood and impact.",
    result: "5+ security controls prioritized.",
    image: "/assets/risk_assessment.webp",
    href: "https://github.com/pat-selby/bayoucare-risk-classification-lab",
    hrefLabel: "Code",
  },
  {
    id: "linux-ir",
    title: "Linux incident lab",
    stack: "auditd · ausearch · Linux",
    summary: "Traced changes to protected files with auditd watch rules and an ausearch timeline.",
    result: "Responsible process found, with 3 ranked control recommendations.",
    image: "/assets/incident_response.webp",
    href: "https://github.com/pat-selby/pineridge-incident-response-lab",
    hrefLabel: "Code",
  },
];

export type Role = {
  id: string;
  org: string;
  role: string;
  dates: string;
  logo?: string;
  points: string[];
};

export const work: Role[] = [
  {
    id: "ai4all",
    org: "AI4ALL Ignite",
    role: "Machine Learning Research Fellow",
    dates: "Jun 2026 to Aug 2026",
    logo: "/assets/ai4all_logo.webp",
    points: [
      "Profiled KV-cache overhead and dynamic batching, found 3 bottlenecks, and cut response latency by 25%.",
      "Built PyTorch/CUDA harnesses for multi-head attention, raising tensor-core utilization by 28% under high concurrency.",
      "Benchmarked quantization, kernel fusion, KV-cache compression and batching with a four-person team: 34% less GPU memory, 2.4x throughput.",
    ],
  },
  {
    id: "codepath-swe",
    org: "CodePath",
    role: "Software Engineering Fellow",
    dates: "Feb 2026 to May 2026",
    logo: "/assets/codepath_logo.webp",
    points: [
      "Built a Python and PostgreSQL pipeline that ingests 150K+ unstructured security logs, cutting ingestion time by 85%.",
      "Architected multithreaded regex analysis across 50K concurrent event streams, cutting intrusion-detection latency by 35%.",
      "Validated 14 backend modules with pytest at 95% branch coverage, catching 14 critical bugs before deployment.",
    ],
  },
  {
    id: "codepath-cyber",
    org: "CodePath",
    role: "Threat Detection Analyst",
    dates: "Feb 2026 to May 2026",
    logo: "/assets/codepath_logo.webp",
    points: [
      "Investigated a Windows privilege-escalation scenario across 4 event sources, mapped to MITRE ATT&CK T1134.001.",
      "Wrote time-window correlation logic separating suspicious privilege changes from routine administration.",
      "Documented the evidence and logic in a triage runbook for repeatable investigations.",
    ],
  },
  {
    id: "aiot",
    org: "Grambling State AIoT Lab",
    role: "Security Research Assistant",
    dates: "Mar 2026 to May 2026",
    logo: "/assets/aiot_lab.webp",
    points: [
      "Built ScanSafe: a 22-rule Python engine, Flask prototype, and Kotlin companion that evaluates a URL in under 5 ms.",
      "Set a 28-URL baseline: 85% commodity phishing, 30% sophisticated attacks, about 8% false positives.",
    ],
  },
  {
    id: "hydroficient",
    org: "Hydroficient (via Extern)",
    role: "IoT Security Extern",
    dates: "Feb 2026 to Mar 2026",
    logo: "/assets/iot_externship.webp",
    points: [
      "Threat-modeled an MQTT fleet with STRIDE and prioritized 2 high-severity risks.",
      "Rejected replayed messages with timestamps, monotonic counters and HMAC, plus per-device certificates over mutual TLS.",
      "Built an Isolation Forest detector to surface abnormal device traffic.",
    ],
  },
  {
    id: "cyberforce",
    org: "DOE CyberForce Competition",
    role: "Blue Team Member",
    dates: "Nov 2025",
    logo: "/assets/cyberforce_logo.webp",
    points: [
      "Defended enterprise and industrial-control infrastructure with a six-member team: 97% availability across 6 services, top 10% nationally.",
      "Investigated 23 host and network events, found 8 high-confidence incidents, fixed 14 misconfigurations.",
      "Automated 3 recurring checks with Python and Bash, cutting validation from about 20 minutes to under 5.",
    ],
  },
];

export const leadership: Role[] = [
  {
    id: "gca",
    org: "Grambling Cybersecurity Alliance",
    role: "Technical Development Chair",
    dates: "Jan 2026 to now",
    points: [
      "Ran 18 Hack The Box and TryHackMe prep sessions. All 3 competitors placed in the top 10%, and the team was selected for DOE's 2026 CyberForce Competition.",
    ],
  },
  {
    id: "gca-cyber",
    org: "Grambling Cybersecurity Alliance",
    role: "Technical Development Chair",
    dates: "Jan 2026 to now",
    points: ["Ran 18 prep sessions and wrote 10 walkthroughs, preparing 15 first-time competitors for 4 CTFs and hackathons."],
  },
  {
    id: "gca-swe",
    org: "Grambling Cybersecurity Alliance",
    role: "Technical Development Chair",
    dates: "Jan 2026 to now",
    points: ["Ran 18 Hack The Box and TryHackMe prep sessions. All 3 competitors placed in the top 10%."],
  },
  {
    id: "tigerhacks",
    org: "TigerHacks",
    role: "Organizer",
    dates: "Aug 2026",
    points: ["Led a 60-participant hackathon with 4 sponsors, $3,500 in funding and prizes, and 8 industry mentors."],
  },
  {
    id: "colorstack",
    org: "ColorStack Grambling",
    role: "Events Committee Member",
    dates: "Aug 2025 to now",
    logo: "/assets/colorstack_logo.webp",
    points: ["Co-organized 4 career events for 200+ students and reviewed 40 peers' resumes; 65% landed tech internship interviews."],
  },
  {
    id: "colorstack-cyber",
    org: "ColorStack Grambling",
    role: "Events Committee Member",
    dates: "Aug 2025 to now",
    logo: "/assets/colorstack_logo.webp",
    points: ["Co-organized 4 campus career events for 200+ students and reviewed 40 peers' resumes."],
  },
];

export const pick = <T extends { id: string }>(list: T[], ids: string[]) =>
  ids.map((id) => list.find((x) => x.id === id)).filter((x): x is T => Boolean(x));

// The experience "chat": a visitor asks, Patrick answers in his own words.
export const chat = {
  ask: "So what have you been working on?",
  intro: "Happy you asked. Here is what I have been up to.",
  closeAsk: "Nice. How do I reach you?",
  closeReply: "Email works best:",
  // Visitor reactions between roles. Reactions only, no claims about Patrick.
  reactions: ["Nice. What else?", "Okay, I am following.", "That sounds fun. Next?", "Wow. Keep going.", "Love that."],
};

// The hero's short intro: what Patrick wants and what he has done so far.
export const intro = {
  greeting: "Hey, I'm Patrick Selby.",
  lookingFor: "Summer 2027 internships in cybersecurity and software.",
  soFar: "UniQR, PacketShield, ScanSafe, and a team 2nd place at Grambling's Hack Day.",
};
