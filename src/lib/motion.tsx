"use client";

/**
 * Motion primitives. Everything here reveals content that is already in the
 * page: nothing waits on an animation to exist, and reduced motion shows the
 * end state at once.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 24, className, style, as = "div" }: {
  children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties; as?: "div" | "section" | "li" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) return <M className={className} style={style}>{children}</M>;
  return (
    <M className={className} style={style} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: 0.9, delay, ease: EASE }}>
      {children}
    </M>
  );
}

/** Children rise one after another when the group scrolls in. */
export function Stagger({ children, className, each = 0.08, as = "div" }: { children: ReactNode; className?: string; each?: number; as?: "div" | "ul" | "ol" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M className={className} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, margin: "-8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: each } } }}>
      {children}
    </M>
  );
}

export function Item({ children, className, as = "div", style }: { children: ReactNode; className?: string; as?: "div" | "li" | "article"; style?: CSSProperties }) {
  const M = motion[as];
  return (
    <M className={className} style={style} variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}>
      {children}
    </M>
  );
}

/** A number that counts up once, when it first comes into view. */
export function CountUp({ to, duration = 1.6, className }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) { if (reduce) setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);
  return <span ref={ref} className={className}>{v}</span>;
}

/**
 * A paragraph whose words light up as it scrolls through the viewport.
 * Every word is in the DOM at full contrast for readers and search; only its
 * opacity is driven.
 */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} from={i / words.length} to={(i + 1) / words.length} still={!!reduce}>{w}</Word>
      ))}
    </p>
  );
}

function Word({ children, p, from, to, still }: { children: string; p: MotionValue<number>; from: number; to: number; still: boolean }) {
  const o = useTransform(p, [from, to], [0.16, 1]);
  return <><motion.span style={{ opacity: still ? 1 : o }}>{children}</motion.span>{" "}</>;
}

/** Moves its child against the scroll, for depth. */
export function Parallax({ children, amount = 60, className, style }: { children: ReactNode; amount?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return <motion.div ref={ref} className={className} style={{ ...style, y: reduce ? 0 : y }}>{children}</motion.div>;
}

/** 0 → 1 as the element crosses the viewport, smoothed. */
export function useSectionProgress(offset: ["start end" | "start start" | "start center", "end start" | "end end" | "end center"] = ["start end", "end start"]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return { ref, progress: smooth };
}

/** Whether the page has scrolled past `y` pixels. */
export function useScrolled(y = 24) {
  const { scrollY } = useScroll();
  const [s, setS] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setS(v > y));
  return s;
}
