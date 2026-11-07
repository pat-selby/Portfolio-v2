"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ReactLenis } from "lenis/react";

import { cn } from "@/lib/utils";

// Shared sideways progress (0 to 1) of the pinned track, so each card can
// react to where it sits in the tour.
const TrackContext = createContext<{ progress: MotionValue<number>; count: number } | null>(null);

// useLayoutEffect warns during SSR; this page prerenders, so fall back there.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Lenis smooth scrolling for the whole page (skipped for reduced motion). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

/** True on wide, motion-friendly screens, where pinned sideways scrolling works well. */
function usePinnedLayout() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide && !reduce;
}

/**
 * Pins its track to the viewport and turns vertical scrolling into sideways
 * movement. The section is exactly as tall as the sideways travel plus one
 * screen, so the track ends where the pin releases. On phones (or with reduced
 * motion) it becomes a plain swipeable row with snap points.
 */
export function HorizontalScroll({
  header,
  children,
  count,
  className,
}: {
  header: ReactNode;
  children: ReactNode;
  count: number;
  className?: string;
}) {
  const pinned = usePinnedLayout();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;
    const measure = () => setTravel(Math.max(track.scrollWidth - window.innerWidth, 0));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, children]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -travel]);

  if (!pinned) {
    return (
      <section className={cn("py-20", className)}>
        <div className="mx-auto max-w-6xl px-5">{header}</div>
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
        <p className="px-5 text-sm text-muted-foreground">Swipe sideways for more.</p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={cn("relative", className)} style={{ height: `calc(100dvh + ${travel}px)` }}>
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden pt-14">
        <div className="mx-auto w-full max-w-6xl px-5">{header}</div>
        <TrackContext.Provider value={{ progress: smooth, count }}>
        <motion.div ref={trackRef} style={{ x }} className="mt-8 flex w-max items-center gap-6 [perspective:1400px] pr-[8vw] pl-[max(20px,calc((100vw-72rem)/2+20px))]">
          {children}
        </motion.div>
        </TrackContext.Provider>
        {/* Progress rail: how far through the sideways tour you are. */}
        <div className="mx-auto mt-8 h-1 w-full max-w-6xl px-5">
          <div className="h-full overflow-hidden rounded-full bg-black/5">
            <motion.div style={{ scaleX: smooth }} className="h-full origin-left rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Endless sideways ticker. Pauses on hover; still for reduced motion. */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-0 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}

/** Scales its child up from 88% as it scrolls into view, like a product reveal. */
export function ZoomIn({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 28]);
  return (
    <motion.div ref={ref} style={{ scale, borderRadius: radius }} className={cn("overflow-hidden", className)}>
      {children}
    </motion.div>
  );
}

/**
 * Carousel drift: inside a pinned track, a card turns toward the viewer and
 * grows as it reaches the middle of the tour, then turns away as it leaves.
 * Outside a pinned track it renders as-is.
 */
export function DriftCard({ index, children, className }: { index: number; children: ReactNode; className?: string }) {
  const ctx = useContext(TrackContext);
  const fallback = useMotionValue(0);
  const progress = ctx?.progress ?? fallback;
  const center = ctx && ctx.count > 1 ? index / (ctx.count - 1) : 0;
  const spread = ctx && ctx.count > 1 ? 1 / (ctx.count - 1) : 1;
  const d = useTransform(progress, (p) => (ctx ? Math.max(-1.5, Math.min(1.5, (p - center) / spread)) : 0));
  const rotateY = useTransform(d, [-1.5, 0, 1.5], [-28, 0, 28]);
  const scale = useTransform(d, [-1.5, 0, 1.5], [0.86, 1, 0.86]);
  const y = useTransform(d, [-1.5, 0, 1.5], [36, 0, 36]);
  const shade = useTransform(d, [-1.5, 0, 1.5], [0.18, 0, 0.18]);
  return (
    <motion.div style={{ rotateY, scale, y }} className={cn("relative [transform-style:preserve-3d]", className)}>
      {children}
      {/* Cards away from the middle dim slightly, like they are turning out of the light. */}
      <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-0 rounded-[28px] bg-[#1d1d1f]" />
    </motion.div>
  );
}

/**
 * Hover tilt with a spotlight: the card leans toward the cursor and a soft
 * light follows the pointer. Springs keep it smooth; touch and reduced motion
 * get a plain card.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(0,113,227,0.14), transparent 60%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 12);
    rx.set((0.5 - py) * 10);
    mx.set(px * 100);
    my.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry }}
      className={cn("group/tilt relative h-full [transform-style:preserve-3d]", className)}
    >
      {children}
      <motion.div
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
      />
    </motion.div>
  );
}

/** Slides a block in from the left or right as it enters the viewport. */
export function FlyIn({ from, children, className }: { from: "left" | "right"; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ x: from === "left" ? -80 : 80, rotate: from === "left" ? -2 : 2 }}
      whileInView={{ x: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}
