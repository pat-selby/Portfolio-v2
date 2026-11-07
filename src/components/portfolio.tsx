"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  leadership,
  lenses,
  pick,
  profile,
  projects,
  receipts,
  work,
  type LensKey,
  type Project,
  type Role,
} from "@/lib/content";
import { cn } from "@/lib/utils";
import { DriftCard, FlyIn, HorizontalScroll, Marquee, SmoothScroll, TiltCard, ZoomIn } from "@/components/scroll-fx";

const LENS_KEYS: LensKey[] = ["general", "cyber", "swe"];
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

/** Slides content up as it enters the viewport. Transform only, so nothing is
 *  ever hidden from a screenshot, a slow device, or a reader with JS off. */
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ y: 28 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Portfolio() {
  // Server renders General; ?lens=cyber is read after mount so a link sent
  // with an application opens on the right view.
  const [lensKey, setLensKey] = useState<LensKey>("general");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("lens");
    if (fromUrl && (LENS_KEYS as string[]).includes(fromUrl)) setLensKey(fromUrl as LensKey);
  }, []);

  const choose = (key: LensKey) => {
    setLensKey(key);
    const url = new URL(window.location.href);
    url.searchParams.set("lens", key);
    window.history.replaceState(null, "", url);
  };

  const lens = lenses[lensKey];
  const shown = pick(projects, lens.projects);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
      <Nav resume={lens.resume} />

      <main id="top" className="overflow-x-clip">
        {/* ---------------------------------------------------- Hero */}
        <section className="relative overflow-hidden">
          {/* Soft Stripe-style color wash behind the hero. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,113,227,0.14),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-5xl px-5 pt-28 pb-14 text-center md:pt-36">
            <Badge variant="secondary" className="mx-auto h-7 rounded-full border border-border bg-white px-3 text-[13px] font-medium">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500" />
              Open to summer 2027 internships
            </Badge>

            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={lensKey}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                className="mx-auto mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tighter text-balance md:text-7xl"
              >
                {lens.headline}
              </motion.h1>
            </AnimatePresence>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {lens.sub}
            </p>

            <div className="mt-8 flex flex-col items-center gap-5">
              <Tabs value={lensKey} onValueChange={(v) => choose(v as LensKey)}>
                <TabsList aria-label="Show my work as" className="h-10 rounded-full bg-muted p-1">
                  {LENS_KEYS.map((key) => (
                    <TabsTrigger key={key} value={key} className="rounded-full px-5 text-sm">
                      {lenses[key].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6 text-[15px] hover:bg-primary/90")}
                >
                  <Mail /> Get in touch
                </a>
                <a
                  href={lens.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full bg-white px-6 text-[15px]")}
                >
                  <Download /> Resume
                </a>
              </div>
            </div>
          </div>

          {/* Product-shot frame: the real UniQR launch video. */}
          <div className="relative mx-auto max-w-5xl px-5 pb-20">
            <ZoomIn className="border border-border bg-[#eff0f3] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
              <video
                src="/assets/uniqr-demo.mp4"
                poster="/assets/uniqr.webp"
                className="mx-auto aspect-video w-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label="UniQR launch video"
              />
            </ZoomIn>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              UniQR reads QR codes on your screen. 28-second launch video.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------- Stats */}
        <section aria-label="Results" className="border-y border-border bg-white py-8">
          <Marquee>
            {receipts.map((r) => (
              <div key={r.value} className="flex w-[300px] shrink-0 flex-col border-r border-border px-8">
                <div className="text-3xl font-semibold tracking-tight text-primary">{r.value}</div>
                <div className="mt-1.5 text-sm leading-snug text-muted-foreground">{r.label}</div>
              </div>
            ))}
          </Marquee>
        </section>

        {/* ------------------------------------------------ Projects */}
        <div id="projects">
          <HorizontalScroll
            key={lensKey}
            count={shown.length}
            header={
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-semibold tracking-tighter md:text-5xl">Selected work.</h2>
                  <p className="mt-3 max-w-xl text-lg text-muted-foreground">Each project, with the result it measured.</p>
                </div>
                <span className="text-sm text-muted-foreground">{shown.length} projects · keep scrolling</span>
              </div>
            }
          >
            {shown.map((p, i) => (
              <div
                key={p.id}
                className={cn("shrink-0 snap-start", i === 0 ? "w-[min(88vw,980px)]" : "w-[min(80vw,520px)]")}
              >
                <DriftCard index={i}>
                  <TiltCard>
                    <ProjectCard project={p} wide={i === 0} />
                  </TiltCard>
                </DriftCard>
              </div>
            ))}
          </HorizontalScroll>
        </div>

        {/* ---------------------------------------------- Experience */}
        <section id="experience" className="bg-white py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[280px_1fr]">
            <div className="self-start lg:sticky lg:top-28">
              <h2 className="text-4xl font-semibold tracking-tighter md:text-5xl">Experience.</h2>
              <p className="mt-3 text-muted-foreground">Fellowships, research and competition work.</p>
            </div>
            <div key={lensKey}>
              {pick(work, lens.work).map((r, i) => (
                <FlyIn key={r.id} from={i % 2 === 0 ? "left" : "right"}>
                  {i > 0 && <Separator className="my-8" />}
                  <RoleBlock role={r} />
                </FlyIn>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------- Leadership and skills */}
        <section className="py-24">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-5">
            <h2 className="text-4xl font-semibold tracking-tighter md:text-5xl">Beyond the code.</h2>
            <span className="text-sm text-muted-foreground">Swipe or scroll sideways</span>
          </div>
          <div
            key={lensKey}
            className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pl-[max(20px,calc((100vw-72rem)/2+20px))] pr-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {pick(leadership, lens.leadership).map((r) => (
              <TiltCard key={r.id} className="w-[min(82vw,380px)] shrink-0 snap-start">
              <article className="h-full rounded-[28px] border border-border bg-white p-7">
                <div className="text-sm text-muted-foreground">Leadership · {r.dates}</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{r.org}</h3>
                <div className="text-sm text-muted-foreground">{r.role}</div>
                <p className="mt-4 leading-relaxed">{r.points[0]}</p>
              </article>
              </TiltCard>
            ))}
            {lens.skills.map((g) => (
              <TiltCard key={g.group} className="w-[min(82vw,340px)] shrink-0 snap-start">
              <article className="h-full rounded-[28px] bg-muted p-7">
                <div className="text-sm text-muted-foreground">Skills</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{g.group}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((sk) => (
                    <Badge key={sk} variant="outline" className="h-7 rounded-full bg-white px-3 text-[13px] font-normal">
                      {sk}
                    </Badge>
                  ))}
                </div>
              </article>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- About */}
        <section id="about" className="bg-white py-24">
          <div className="mx-auto grid max-w-5xl items-center gap-12 px-5 md:grid-cols-[320px_1fr]">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/about_avatar.webp"
                alt="Patrick Selby"
                width={682}
                height={1024}
                className="aspect-[4/5] w-full max-w-[320px] rounded-[28px] object-cover object-top shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)]"
                loading="lazy"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-4xl font-semibold tracking-tighter md:text-5xl">About me.</h2>
              <p className="mt-6 text-lg leading-relaxed">
                I&apos;m a cybersecurity sophomore at {profile.school}, minoring in Computer Information
                Systems, with a {profile.gpa} GPA. I was born and raised in Ghana.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                I like tools that show their numbers. When something works, I want to know how well, and where
                it stops working.
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-muted p-4">
                  <dt className="text-sm text-muted-foreground">Degree</dt>
                  <dd className="mt-1 font-medium">{profile.degree}</dd>
                </div>
                <div className="rounded-2xl bg-muted p-4">
                  <dt className="text-sm text-muted-foreground">Graduation</dt>
                  <dd className="mt-1 font-medium">{profile.grad}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------- Contact */}
        <section id="contact" className="mx-auto max-w-5xl px-5 py-28 text-center">
          <Reveal>
            <h2 className="text-5xl font-semibold tracking-tighter text-balance md:text-6xl">
              Hiring for summer 2027?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Cybersecurity and software internships.</p>
            <a
              href={`mailto:${profile.email}`}
              className="group mt-8 inline-flex items-center gap-2 text-2xl font-medium text-primary md:text-3xl"
            >
              {profile.email}
              <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="mt-8 flex justify-center gap-6 text-[15px]">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                LinkedIn
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
          <span>Patrick Selby · Grambling, LA</span>
          <a href="#top" className="hover:text-foreground">
            Back to top
          </a>
        </div>
      </footer>
      </SmoothScroll>
    </MotionConfig>
  );
}

function Nav({ resume }: { resume: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5">
        <a href="#top" className="mr-auto text-[15px] font-semibold tracking-tight">
          Patrick Selby
        </a>
        <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex" aria-label="Sections">
          <a href="#projects" className="hover:text-foreground">
            Work
          </a>
          <a href="#experience" className="hover:text-foreground">
            Experience
          </a>
          <a href="#about" className="hover:text-foreground">
            About
          </a>
        </nav>
        <a
          href={resume}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "sm" }), "h-8 rounded-full px-4 text-[13px]")}
        >
          Resume
        </a>
      </div>
    </header>
  );
}

// The UniQR video already plays in the hero, so its card shows the screenshot.
const HERO_VIDEO_PROJECT = "uniqr";

function ProjectCard({ project, wide }: { project: Project; wide: boolean }) {
  const media = project.video && project.id !== HERO_VIDEO_PROJECT ? (
    <video
      src={project.video}
      poster={project.image}
      className="h-full w-full bg-[#eff0f3] object-contain"
      muted={!project.videoOnClick}
      loop={!project.videoOnClick}
      playsInline
      controls
      preload={project.videoOnClick ? "none" : "metadata"}
      aria-label={`${project.title} demo video`}
    />
  ) : project.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.image}
      alt={`${project.title} screenshot`}
      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover/tilt:scale-[1.06]"
      loading="lazy"
    />
  ) : (
    <div className="flex h-full w-full items-end bg-[linear-gradient(135deg,#e8f1ff_0%,#f5f5f7_60%)] p-8">
      <span className="text-4xl font-semibold tracking-tighter text-[#0071e3]/80 md:text-5xl">{project.title}</span>
    </div>
  );

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white transition-shadow duration-300 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)]",
        wide && "md:grid md:grid-cols-[1.25fr_1fr]"
      )}
    >
      <div className={cn("h-[min(26vh,230px)] overflow-hidden", wide && "md:h-[min(40vh,380px)]")}>{media}</div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="text-[13px] font-medium text-muted-foreground">{project.stack}</div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{project.title}</h3>
        <p className="mt-3 leading-relaxed [@media(max-height:700px)]:hidden">{project.summary}</p>
        <p className="mt-3 font-medium leading-relaxed">{project.result}</p>
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 pt-6 text-[15px] font-medium text-primary"
          >
            {project.hrefLabel}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </div>
    </article>
  );
}

function RoleBlock({ role }: { role: Role }) {
  return (
    <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
      {role.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={role.logo} alt="" width={56} height={56} className="size-14 rounded-2xl border border-border bg-white object-contain p-1" />
      ) : (
        <div className="grid size-14 place-items-center rounded-2xl bg-muted text-lg font-semibold text-muted-foreground">
          {role.org.slice(0, 1)}
        </div>
      )}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-xl font-semibold tracking-tight">{role.org}</h3>
          <span className="text-sm text-muted-foreground">{role.dates}</span>
        </div>
        <div className="text-muted-foreground">{role.role}</div>
        <ul className="mt-4 space-y-2.5 leading-relaxed">
          {role.points.map((pt) => (
            <li key={pt} className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
