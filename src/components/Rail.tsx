"use client";

/**
 * A list of cards: an even grid on desktop, a swipe rail on phones.
 *
 * On phones (globals.css, "Phone") the list scrolls sideways with snap
 * points, each card shows a peek of the next, and dots underneath follow the
 * swipe and jump to a card when tapped. Nothing changes on desktop except the
 * dots, which stay hidden.
 */

import { Children, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { useT } from "@/lib/locale";

export function Rail({ children, className = "", as = "div", stagger = true, label }: {
  children: ReactNode; className?: string; as?: "div" | "ol" | "ul"; stagger?: boolean; label?: string;
}) {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);
  const n = Children.count(children);
  const Tag = as as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = el.children[0] as HTMLElement | undefined;
        if (!first) return;
        const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
        /* RTL rails scroll with negative scrollLeft. */
        setAt(Math.min(n - 1, Math.max(0, Math.round(Math.abs(el.scrollLeft) / step))));
      });
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => { el.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [n]);

  const go = (i: number) => {
    const card = ref.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <div className="rail-wrap">
      <Tag ref={ref} className={`rail ${stagger ? "stg " : ""}${className}`} aria-label={label}>{children}</Tag>
      {n > 1 && (
        <div className="rail-dots" role="tablist" aria-label={label ?? t({ en: "Cards", ar: "البطاقات" })}>
          {Array.from({ length: n }, (_, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === at} className={i === at ? "is-on" : ""} onClick={() => go(i)}
              aria-label={t({ en: `Card ${i + 1} of ${n}`, ar: `البطاقة ${i + 1} من ${n}` })} />
          ))}
        </div>
      )}
    </div>
  );
}
