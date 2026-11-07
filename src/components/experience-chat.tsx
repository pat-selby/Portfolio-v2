"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { CheckCheck } from "lucide-react";

import { chat, profile, type Role } from "@/lib/content";
import { cn } from "@/lib/utils";

const AVATAR = "/assets/about_avatar.webp";
// How much page scroll each message gets, in viewport heights.
const VH_PER_MESSAGE = 24;

// Resume points are verb-first ("Built a..."); in a chat Patrick says "I built a...".
const firstPerson = (point: string) => `I ${point.charAt(0).toLowerCase()}${point.slice(1)}`;

type Item =
  | { from: "visitor"; text: string }
  | { from: "me"; kind: "text"; text: string; email?: boolean }
  | { from: "me"; kind: "role"; role: Role };

/** The whole conversation, in order: ask, intro, each role, reactions, sign-off. */
function buildScript(roles: Role[]): Item[] {
  const items: Item[] = [
    { from: "visitor", text: chat.ask },
    { from: "me", kind: "text", text: chat.intro },
  ];
  roles.forEach((r, i) => {
    items.push({ from: "me", kind: "role", role: r });
    r.points.forEach((pt) => items.push({ from: "me", kind: "text", text: firstPerson(pt) }));
    if (i < roles.length - 1) items.push({ from: "visitor", text: chat.reactions[i % chat.reactions.length] });
  });
  items.push({ from: "visitor", text: chat.closeAsk });
  items.push({ from: "me", kind: "text", text: chat.closeReply, email: true });
  return items;
}

function Avatar() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={AVATAR} alt="" className="size-8 shrink-0 rounded-full object-cover object-top" />;
}

function Bubble({ from, children, time }: { from: "me" | "visitor"; children: ReactNode; time?: string }) {
  const mine = from === "me";
  return (
    <div
      className={cn(
        "max-w-[min(440px,74vw)] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm",
        mine ? "rounded-bl-md bg-white text-foreground" : "rounded-br-md bg-primary text-primary-foreground"
      )}
    >
      {children}
      {time && (
        <div className={cn("mt-1 flex items-center justify-end gap-1 text-[11px]", mine ? "text-muted-foreground" : "text-white/75")}>
          {time}
          {!mine && <CheckCheck className="size-3.5" />}
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 shadow-sm" aria-label="Patrick is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground/70"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

function RoleCard({ role }: { role: Role }) {
  return (
    <Bubble from="me" time={role.dates}>
      <div className="flex items-center gap-3">
        {role.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={role.logo} alt="" className="size-11 rounded-xl border border-border bg-white object-contain p-0.5" />
        ) : (
          <span className="grid size-11 place-items-center rounded-xl bg-muted font-semibold text-muted-foreground">{role.org.slice(0, 1)}</span>
        )}
        <div>
          <div className="font-semibold">{role.org}</div>
          <div className="text-sm text-muted-foreground">{role.role}</div>
        </div>
      </div>
    </Bubble>
  );
}

/**
 * Renders one message at a given progress f (0 to 1) through its own slice of
 * scroll. Patrick's messages show typing dots, then type out letter by letter;
 * role cards slide in with their logo; visitor messages pop in.
 */
function Message({ item, f }: { item: Item; f: number }) {
  if (item.from === "visitor") {
    return (
      <div className="flex justify-end">
        <motion.div
          initial={false}
          animate={{ scale: f > 0.15 ? 1 : 0.6, opacity: f > 0.15 ? 1 : 0, y: f > 0.15 ? 0 : 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          style={{ transformOrigin: "bottom right" }}
        >
          <Bubble from="visitor" time="now">
            {item.text}
          </Bubble>
        </motion.div>
      </div>
    );
  }

  const typing = f < 0.25;
  const t = Math.min(Math.max((f - 0.25) / 0.6, 0), 1);
  return (
    <div className="flex items-end gap-2.5">
      <Avatar />
      {typing ? (
        <TypingDots />
      ) : item.kind === "role" ? (
        <motion.div
          initial={{ x: -40, rotate: -3, opacity: 0 }}
          animate={{ x: 0, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <RoleCard role={item.role} />
        </motion.div>
      ) : (
        <Bubble from="me">
          {item.text.slice(0, Math.ceil(item.text.length * t))}
          {t < 1 && <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-primary" />}
          {item.email && t >= 1 && (
            <>
              {" "}
              <a href={`mailto:${profile.email}`} className="font-medium text-primary underline-offset-4 hover:underline">
                {profile.email}
              </a>
            </>
          )}
        </Bubble>
      )}
    </div>
  );
}

function ChatHeader({ status }: { status: "online" | "typing" }) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-white/90 px-5 py-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={AVATAR} alt="Patrick Selby" className="size-10 rounded-full object-cover object-top" />
      <div>
        <div className="font-semibold leading-tight">Patrick Selby</div>
        <div className={cn("text-xs transition-colors", status === "typing" ? "text-primary" : "text-emerald-600")}>
          {status === "typing" ? "typing…" : "online"}
        </div>
      </div>
    </div>
  );
}

const frame =
  "flex flex-col overflow-hidden rounded-[32px] border border-border bg-[#eef1f5] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]";
const wallpaper = "bg-[radial-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:16px_16px]";

/**
 * Experience told as a chat that follows your scroll. The phone pins in place;
 * scrolling plays the conversation one message at a time, typing as you go,
 * so the reader always knows what is happening. Without JS or with reduced
 * motion, the full conversation shows as a normal list.
 */
export function ExperienceChat({ roles, header }: { roles: Role[]; header: ReactNode }) {
  const items = useMemo(() => buildScript(roles), [roles]);
  const reduce = useReducedMotion();
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => setAnimate(!reduce), [reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Round so React re-renders in small steps, not on every pixel.
    setT(Math.round(p * items.length * 50) / 50);
  });

  // The outer div is the same element in both modes, so the scroll tracker
  // (which binds on mount) keeps watching it after the switch to animated.
  if (!animate) {
    return (
      <div ref={sectionRef} className="relative">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 lg:grid-cols-[300px_1fr]">
        <div>{header}</div>
        <div className={frame}>
          <ChatHeader status="online" />
          <div className={cn("space-y-3 px-4 py-6", wallpaper)}>
            {items.map((it, i) => (
              <Message key={i} item={it} f={1} />
            ))}
          </div>
        </div>
      </div>
      </div>
    );
  }

  const current = Math.min(Math.floor(t), items.length - 1);
  const f = t >= items.length ? 1 : t - Math.floor(t);
  const cur = items[current];
  const status = cur.from === "me" && f < 0.85 && t < items.length ? "typing" : "online";
  const done = Math.min(current, items.length);

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${items.length * VH_PER_MESSAGE + 100}vh` }}>
      <div className="sticky top-14 mx-auto grid h-[calc(100dvh-3.5rem)] max-w-6xl gap-10 px-5 pt-6 pb-20 lg:pb-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden self-center lg:block">
          {header}
          {/* How far through the conversation you are. */}
          <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(t / items.length, 1) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Message {Math.min(current + 1, items.length)} of {items.length}
          </p>
        </div>
        <div className={cn(frame, "mx-auto h-full w-full max-w-[560px]")}>
          <ChatHeader status={status} />
          {/* Newest message sits at the bottom; older ones drift up and out, like a real chat. */}
          <div className={cn("flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-4 py-5", wallpaper)}>
            {/* One keyed list, so a delivered message never remounts and replays its entrance. */}
            {items.slice(0, done + 1).map((it, i) => (
              <Message key={i} item={it} f={i < current ? 1 : f} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
