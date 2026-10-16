/**
 * Shared film pieces: the DZAC light-sweep transition, the wave ribbons from
 * the DZAC 4 stage, and the grade that ties footage to the brand.
 *
 * Everything that moves continuously takes its phase from the frame modulo a
 * period that divides the composition, so every film loops without a seam.
 */

import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

/* The DZAC 5 brand, from the conference deck: royal blue, cyan, deep navy, masterclass gold. */
export const CYAN = "#3ED1F2";
export const BLUE = "#0656D4";
export const GOLD = "#C89B4E";
export const INK = "#070D1B";

/* ── Light sweep ───────────────────────────────────────── */

type SweepProps = { rtl: boolean };

const Sweep: FC<TransitionPresentationComponentProps<SweepProps>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * p})`, filter: `brightness(${1 - 0.45 * p})` }}>{children}</AbsoluteFill>
    );
  }
  /* The incoming shot is revealed behind a soft edge that travels across the
     frame, led by a thin band of cyan light. Reading direction sets the side. */
  const angle = passedProps.rtl ? 260 : 100;
  const pos = interpolate(p, [0, 1], [-25, 125]);
  const mask = `linear-gradient(${angle}deg, #000 ${pos - 18}%, transparent ${pos}%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask, transform: `scale(${1.08 - 0.08 * p})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{
        background: `linear-gradient(${angle}deg, transparent ${pos - 10}%, rgba(59,216,242,0.55) ${pos - 2}%, rgba(255,255,255,0.9) ${pos}%, transparent ${pos + 1.5}%)`,
        mixBlendMode: "screen", opacity: Math.sin(Math.PI * p),
      }} />
    </AbsoluteFill>
  );
};

export const lightSweep = (rtl: boolean): TransitionPresentation<SweepProps> => ({ component: Sweep, props: { rtl } });

/* ── Waves ─────────────────────────────────────────────── */

/**
 * Ribbons of light like the curves on the DZAC 4 stage. `period` must divide
 * the composition length so the loop closes; each ribbon moves a whole number
 * of cycles per period.
 */
export function Waves({ period, top = 0.6, spread = 0.045, count = 7, opacity = 1, glow = true }: {
  period: number; top?: number; spread?: number; count?: number; opacity?: number; glow?: boolean;
}) {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const t = (f % period) / period;
  const paths = Array.from({ length: count }, (_, i) => {
    const base = H * (top + i * spread);
    const amp = H * (0.05 + 0.014 * i);
    const lambda = W * (0.85 + 0.12 * i);
    const dir = i % 2 ? 1 : -1;
    const phase = Math.PI * 2 * t * dir * (1 + (i % 3)) + i * 0.8;
    const pts: string[] = [];
    for (let k = 0; k <= 48; k++) {
      const x = -0.08 * W + (k / 48) * 1.16 * W;
      const y = base + amp * Math.sin((Math.PI * 2 * x) / lambda + phase) + amp * 0.32 * Math.sin((Math.PI * 4 * x) / lambda - phase * 2);
      pts.push(`${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return { d: pts.join(" "), w: 1.2 + (i % 3) * 0.9, o: 0.75 - i * 0.07 };
  });
  return (
    <AbsoluteFill style={{ opacity, filter: glow ? "drop-shadow(0 0 10px rgba(59,216,242,0.55))" : undefined }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <linearGradient id="wv" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={BLUE} stopOpacity="0" />
            <stop offset="0.3" stopColor={CYAN} />
            <stop offset="0.7" stopColor="#9BF3FF" />
            <stop offset="1" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((p, i) => <path key={i} d={p.d} fill="none" stroke="url(#wv)" strokeWidth={p.w} opacity={p.o} />)}
      </svg>
    </AbsoluteFill>
  );
}

/** Pulls any footage toward the brand: deep navy shadows, a blue cast, a vignette. */
export function Grade({ strength = 1 }: { strength?: number }) {
  return (
    <>
      <AbsoluteFill style={{ background: BLUE, mixBlendMode: "color", opacity: 0.16 * strength }} />
      <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 45%, transparent 45%, rgba(5,9,20,${0.7 * strength}) 100%)` }} />
    </>
  );
}

/** Fades from and to black over the first and last frames, so a loop restart reads as a cut to black. */
export function Dip({ frames, total }: { frames: number; total: number }) {
  const f = useCurrentFrame();
  const o = Math.max(interpolate(f, [0, frames], [1, 0], { extrapolateRight: "clamp" }), interpolate(f, [total - frames, total - 1], [0, 1], { extrapolateLeft: "clamp" }));
  return <AbsoluteFill style={{ background: INK, opacity: o }} />;
}
