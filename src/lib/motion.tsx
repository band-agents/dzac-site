"use client";

/**
 * Motion, without a motion library.
 *
 * Reveals, staggers, parallax and the word-by-word statement are CSS
 * scroll-driven animations (globals.css, "Motion"): the browser runs them on
 * the compositor, tied to scroll position, with no JavaScript per frame.
 * Where a browser lacks scroll timelines, or the visitor prefers reduced
 * motion, everything simply shows in its final state. Nothing here waits on
 * JavaScript to become visible.
 */

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type As = "div" | "section" | "li" | "p" | "span" | "ul" | "ol" | "article" | "header";

/** Rises into place as it scrolls into view. `delay` (seconds) shifts it later in the scroll. */
export function Reveal({ children, delay = 0, className, style, as = "div" }: {
  children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties; as?: As;
}) {
  const Tag = as as ElementType;
  return <Tag className={`rv ${className ?? ""}`} style={{ ...style, ["--i" as string]: Math.round(delay * 10) }}>{children}</Tag>;
}

/** Its children rise one after another (the nth child is shifted n steps). */
export function Stagger({ children, className, as = "div", style }: { children: ReactNode; className?: string; each?: number; as?: As; style?: CSSProperties }) {
  const Tag = as as ElementType;
  return <Tag className={`stg ${className ?? ""}`} style={style}>{children}</Tag>;
}

export function Item({ children, className, as = "div", style }: { children: ReactNode; className?: string; as?: As; style?: CSSProperties }) {
  const Tag = as as ElementType;
  return <Tag className={className} style={style}>{children}</Tag>;
}

/** An image that drifts against the scroll, for depth. The child should be an <img>. */
export function Parallax({ children, className, style }: { children: ReactNode; amount?: number; className?: string; style?: CSSProperties }) {
  return <div className={`px ${className ?? ""}`} style={style}>{children}</div>;
}

/**
 * A paragraph whose words light up in order as its section scrolls. Every
 * word is in the DOM at full contrast where the effect can't run.
 */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={`words ${className ?? ""}`} style={{ ["--n" as string]: words.length }}>
      {words.map((w, i) => <span key={i} style={{ ["--w" as string]: i }}>{w} </span>)}
    </p>
  );
}

/** A number that counts up once, when it first comes into view. */
export function CountUp({ to, duration = 1.6, className }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / (duration * 1000));
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref} className={className}>{v}</span>;
}

/** Whether the page has scrolled past `y` pixels (one passive listener, state only changes at the edge). */
export function useScrolled(y = 24) {
  const [s, setS] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setS(window.scrollY > y)); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [y]);
  return s;
}
