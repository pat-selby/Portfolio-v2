"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CheckCheck } from "lucide-react";

import { chat, profile, type Role } from "@/lib/content";
import { cn } from "@/lib/utils";

const AVATAR = "/assets/about_avatar.webp";

// Resume points are verb-first ("Built a..."); in a chat Patrick says "I built a...".
const firstPerson = (point: string) => `I ${point.charAt(0).toLowerCase()}${point.slice(1)}`;

/**
 * Messages arrive one at a time, like a real conversation: line N may start
 * only after line N-1 has been delivered. `revealed` is how many lines are out.
 */
const Queue = createContext<{ revealed: number; deliver: (i: number) => void; setTyping: (t: boolean) => void }>({
  revealed: Number.MAX_SAFE_INTEGER,
  deliver: () => {},
  setTyping: () => {},
});

type Phase = "shown" | "waiting" | "typing";

/**
 * One chat line. The server renders it fully visible; after mount it waits
 * its turn, shows a typing indicator once it is on screen, then pops in. A
 * line already scrolled past appears at once, so fast scrollers never wait.
 * Reduced motion skips straight to the messages.
 */
function ChatLine({ index, from, children, typingMs = 500 }: { index: number; from: "me" | "visitor"; children: ReactNode; typingMs?: number }) {
  const { revealed, deliver, setTyping } = useContext(Queue);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("shown");

  useEffect(() => {
    if (!reduce) setPhase("waiting");
  }, [reduce]);

  useEffect(() => {
    if (phase !== "waiting" || revealed !== index) return;
    const passed = (ref.current?.getBoundingClientRect().bottom ?? 0) < 0;
    if (passed) {
      setPhase("shown");
      deliver(index);
      return;
    }
    if (!inView) return;
    setPhase("typing");
    if (from === "me") setTyping(true);
  }, [phase, revealed, index, inView, from, deliver, setTyping]);

  // Separate from the effect above, so entering "typing" does not cancel its own timer.
  useEffect(() => {
    if (phase !== "typing") return;
    const t = window.setTimeout(() => {
      setPhase("shown");
      setTyping(false);
      deliver(index);
    }, from === "me" ? typingMs : 200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const mine = from === "me";
  const typing = phase === "typing" && mine;
  return (
    <div ref={ref} className={cn("flex items-end gap-2.5", mine ? "justify-start" : "justify-end", phase === "waiting" && "h-1 overflow-hidden")}>
      {mine && phase !== "waiting" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={AVATAR} alt="" className="size-8 shrink-0 rounded-full object-cover object-top" />
      )}
      <AnimatePresence mode="wait" initial={false}>
        {typing ? (
          <motion.div
            key="typing"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 shadow-sm"
            aria-label="Patrick is typing"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full bg-muted-foreground/70"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </motion.div>
        ) : phase === "shown" ? (
          <motion.div
            key="msg"
            initial={{ scale: 0.85, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ transformOrigin: mine ? "bottom left" : "bottom right" }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Bubble({ from, children, time }: { from: "me" | "visitor"; children: ReactNode; time?: string }) {
  const mine = from === "me";
  return (
    <div
      className={cn(
        "max-w-[min(560px,72vw)] rounded-2xl px-4 py-2.5 leading-relaxed shadow-sm",
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

/** Experience told as a chat: a visitor asks, Patrick answers role by role. */
export function ExperienceChat({ roles }: { roles: Role[] }) {
  const [revealed, setRevealed] = useState(0);
  const [typing, setTyping] = useState(false);
  const deliver = (i: number) => setRevealed((r) => Math.max(r, i + 1));

  // Number lines in the order they are rendered so the queue follows the page.
  let n = 0;
  const next = () => n++;

  return (
    <Queue.Provider value={{ revealed, deliver, setTyping }}>
      <div className="overflow-hidden rounded-[28px] border border-border bg-[#eef1f5] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
        {/* Chat header: who you are talking to, with a live status line. */}
        <div className="flex items-center gap-3 border-b border-border bg-white/90 px-5 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AVATAR} alt="Patrick Selby" className="size-10 rounded-full object-cover object-top" />
          <div>
            <div className="font-semibold leading-tight">Patrick Selby</div>
            <div className={cn("text-xs transition-colors", typing ? "text-primary" : "text-emerald-600")}>
              {typing ? "typing…" : "online"}
            </div>
          </div>
        </div>

        <div className="min-h-[420px] space-y-3 bg-[radial-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:16px_16px] px-4 py-6 md:px-6">
          <ChatLine index={next()} from="visitor">
            <Bubble from="visitor" time="now">
              {chat.ask}
            </Bubble>
          </ChatLine>
          <ChatLine index={next()} from="me" typingMs={900}>
            <Bubble from="me">{chat.intro}</Bubble>
          </ChatLine>

          {roles.map((r) => (
            <div key={r.id} className="space-y-3">
              <ChatLine index={next()} from="me" typingMs={750}>
                <Bubble from="me" time={r.dates}>
                  <div className="flex items-center gap-3">
                    {r.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.logo} alt="" className="size-10 rounded-xl border border-border bg-white object-contain p-0.5" />
                    ) : (
                      <span className="grid size-10 place-items-center rounded-xl bg-muted font-semibold text-muted-foreground">
                        {r.org.slice(0, 1)}
                      </span>
                    )}
                    <div>
                      <div className="font-semibold">{r.org}</div>
                      <div className="text-sm text-muted-foreground">{r.role}</div>
                    </div>
                  </div>
                </Bubble>
              </ChatLine>
              {r.points.map((pt) => (
                <ChatLine key={pt} index={next()} from="me">
                  <Bubble from="me">{firstPerson(pt)}</Bubble>
                </ChatLine>
              ))}
            </div>
          ))}

          <ChatLine index={next()} from="visitor">
            <Bubble from="visitor" time="now">
              {chat.closeAsk}
            </Bubble>
          </ChatLine>
          <ChatLine index={next()} from="me">
            <Bubble from="me">
              {chat.closeReply}{" "}
              <a href={`mailto:${profile.email}`} className="font-medium text-primary underline-offset-4 hover:underline">
                {profile.email}
              </a>
            </Bubble>
          </ChatLine>
        </div>
      </div>
    </Queue.Provider>
  );
}
