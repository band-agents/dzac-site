"use client";

/**
 * The DZAC 5 mark: "DZAC" set solid, and the 5 drawn the way DZAC 4 drew its
 * 4, as several parallel outline strokes.
 *
 * The outlines come from a mask: the 5's centre line is stroked white at
 * decreasing widths with a black stroke just inside each one, which leaves
 * pairs of hairlines either side of the line. `draw` (0 to 1) runs every
 * stroke's dash together, so the whole 5 writes itself; the same component
 * is used in the page and inside the Remotion films.
 */

import { useId, type CSSProperties } from "react";

export const FIVE_PATH = "M 80 14 H 31 L 27 60 C 39 51 57 49 69 55 C 87 64 91 88 82 104 C 72 124 40 129 20 114";
const VIEW = "-8 -12 124 170";

export function FiveOutline({ draw = 1, lines = 4, gap = 4.6, line = 1.35, fill = "url(#__grad)", className, style, gradient = true }: {
  draw?: number; lines?: number; gap?: number; line?: number; fill?: string; className?: string; style?: CSSProperties; gradient?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const widths = Array.from({ length: lines }, (_, i) => line + 2 * gap * (lines - 1 - i) + 2 * line * (lines - 1 - i));
  const dash = { strokeDasharray: "1 1", strokeDashoffset: 1 - Math.max(0, Math.min(1, draw)) };
  return (
    <svg viewBox={VIEW} className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7CF0FF" />
          <stop offset="0.55" stopColor="#3BD8F2" />
          <stop offset="1" stopColor="#2E6BFF" />
        </linearGradient>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="-8" y="-12" width="124" height="170">
          {widths.map((w, i) => (
            <g key={i}>
              <path d={FIVE_PATH} pathLength={1} fill="none" stroke="#fff" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={dash} />
              {w - 2 * line > 0 && (
                <path d={FIVE_PATH} pathLength={1} fill="none" stroke="#000" strokeWidth={w - 2 * line} strokeLinecap="round" strokeLinejoin="round" style={dash} />
              )}
            </g>
          ))}
        </mask>
      </defs>
      <rect x="-8" y="-12" width="124" height="170" fill={gradient ? `url(#g${id})` : fill} mask={`url(#m${id})`} />
    </svg>
  );
}

/** "DZAC" in the display face, then the outlined 5. Sized by font-size. */
export function Wordmark({ draw = 1, className, style }: { draw?: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={`wm ${className ?? ""}`} style={style} dir="ltr" aria-label="DZAC 5" role="img">
      <span className="wm-dzac" aria-hidden>DZAC</span>
      <FiveOutline draw={draw} className="wm-five" />
    </span>
  );
}

/** The Dar El Zokora mark (circle, moustache, male arrow), from the group's logo. */
export function DzMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return <img src={(process.env.NEXT_PUBLIC_BASE ?? "") + "/brand/dz-mark.svg"} alt="" className={className} style={style} width={116} height={80} />;
}
