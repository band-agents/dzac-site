/**
 * The three Remotion films. scripts/render-films.mjs renders them to video
 * files once; the site plays those files (components/Film.tsx).
 *
 *   HeroReel   DZAC 4 footage cut to light sweeps, slides and fades, under
 *              the stage's wave light. Full-bleed behind the home hero.
 *   OrReel     The masterclass as a live operating-room feed: viewfinder,
 *              REC light, running timecode, a caption per approach.
 *   Sting      The DZAC 5 mark writing itself over converging waves.
 *
 * Footage comes in as paths inside public/ and is read frame-accurately by
 * OffthreadVideo. Each film fades from and to black at its loop point.
 */

import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, springTiming, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { FiveOutline } from "@/components/brand";
import { Dip, GOLD, Grade, INK, Waves, lightSweep } from "./fx";

export type Clip = { src: string; frames: number; caption?: string };

/** Transitions of different kinds in one list; TransitionSeries takes any of them. */
type AnyPresentation = TransitionPresentation<Record<string, unknown>>;
const any = (p: unknown) => p as AnyPresentation;

const FPS = 30;
const TRANS = 16;

export const filmLength = (clips: Clip[], trans = TRANS) => clips.reduce((s, c) => s + c.frames, 0) - trans * (clips.length - 1);

/** One shot: cover-fit footage with a slow push-in. */
function Shot({ clip, push = 0.05 }: { clip: Clip; push?: number }) {
  const f = useCurrentFrame();
  const s = 1.03 + push * (f / clip.frames);
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(clip.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
    </AbsoluteFill>
  );
}

/* ── Hero reel ─────────────────────────────────────────── */

export type HeroReelProps = { clips: Clip[]; rtl: boolean } & Record<string, unknown>;

export function HeroReel({ clips, rtl }: HeroReelProps) {
  const total = filmLength(clips);
  const presentations = [lightSweep(rtl), fade(), slide({ direction: rtl ? "from-left" : "from-right" }), lightSweep(rtl), fade()].map(any);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <TransitionSeries>
        {clips.flatMap((c, i) => [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={c.frames} premountFor={20}>
            <Shot clip={c} />
          </TransitionSeries.Sequence>,
          ...(i < clips.length - 1
            ? [<TransitionSeries.Transition key={`t${i}`} presentation={presentations[i % presentations.length]}
                timing={i % 2 ? springTiming({ durationInFrames: TRANS, config: { damping: 200 } }) : linearTiming({ durationInFrames: TRANS })} />]
            : []),
        ])}
      </TransitionSeries>
      <Grade />
      <Waves period={total} top={0.7} opacity={0.75} />
      <Dip frames={14} total={total} />
    </AbsoluteFill>
  );
}

/* ── Operating-room feed ───────────────────────────────── */

export type OrReelProps = { clips: Clip[]; rtl: boolean; live: string } & Record<string, unknown>;

export function OrReel({ clips, rtl, live }: OrReelProps) {
  const total = filmLength(clips, 14);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <TransitionSeries>
        {clips.flatMap((c, i) => [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={c.frames} premountFor={20}>
            <Shot clip={c} push={0.07} />
            {c.caption && <OrCaption text={c.caption} frames={c.frames} rtl={rtl} />}
          </TransitionSeries.Sequence>,
          ...(i < clips.length - 1
            ? [<TransitionSeries.Transition key={`t${i}`} presentation={any(i % 2 ? wipe({ direction: rtl ? "from-right" : "from-left" }) : lightSweep(rtl))}
                timing={linearTiming({ durationInFrames: 14 })} />]
            : []),
        ])}
      </TransitionSeries>
      <Grade strength={0.7} />
      <Viewfinder total={total} live={live} />
      <Dip frames={10} total={total} />
    </AbsoluteFill>
  );
}

function OrCaption({ text, frames, rtl }: { text: string; frames: number; rtl: boolean }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f - 8, fps, config: { damping: 200 } });
  const out = interpolate(f, [frames - 16, frames - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{
      position: "absolute", left: 80, right: 80, bottom: 120, fontFamily: "var(--display)", color: "#fff", opacity: out,
    }}>
      <div style={{ width: 120 * inn, height: 1.5, background: GOLD, marginBottom: 22 }} />
      <div style={{ fontSize: rtl ? 50 : 66, fontWeight: 300, fontStyle: rtl ? "normal" : "italic", lineHeight: rtl ? 1.4 : 1.05, transform: `translateY(${(1 - inn) * 30}px)`, opacity: inn, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>{text}</div>
    </div>
  );
}

/** Camera corners, a blinking REC light and a running timecode. */
function Viewfinder({ total, live }: { total: number; live: string }) {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const on = Math.floor(f / 15) % 2 === 0;
  const secs = Math.floor(f / FPS), fr = f % FPS;
  const tc = `10:${String(24 + Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
  const c = 70, m = 48;
  const corner = (x: number, y: number, sx: number, sy: number) => `M${x} ${y + sy * c} V${y} H${x + sx * c}`;
  const scan = (f % total) / total;
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        {[corner(m, m, 1, 1), corner(W - m, m, -1, 1), corner(m, H - m, 1, -1), corner(W - m, H - m, -1, -1)].map((d) => (
          <path key={d} d={d} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={3} />
        ))}
      </svg>
      <div style={{ position: "absolute", top: 76, left: 84, display: "flex", alignItems: "center", gap: 14, fontFamily: "var(--mono)", fontSize: 22, letterSpacing: "0.22em", color: "#fff" }} dir="ltr">
        <span style={{ width: 16, height: 16, borderRadius: 999, background: "#FF3B3B", opacity: on ? 1 : 0.25, boxShadow: on ? "0 0 18px #FF3B3B" : "none" }} />
        {live}
      </div>
      <div style={{ position: "absolute", top: 76, right: 84, fontFamily: "var(--mono)", fontSize: 22, letterSpacing: "0.08em", color: "rgba(255,255,255,0.85)" }} dir="ltr">{tc}</div>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent ${scan * 100 - 6}%, rgba(59,216,242,0.08) ${scan * 100}%, transparent ${scan * 100 + 0.5}%)` }} />
    </AbsoluteFill>
  );
}

/* ── Sting ─────────────────────────────────────────────── */

export const STING_FRAMES = 240;
export type StingProps = { tagline: string; date: string; rtl: boolean } & Record<string, unknown>;

export function Sting({ tagline, date, rtl }: StingProps) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(f, [14, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const word = spring({ frame: f - 6, fps, config: { damping: 200 } });
  const line = spring({ frame: f - 70, fps, config: { damping: 200 } });
  const meta = spring({ frame: f - 86, fps, config: { damping: 200 } });
  const out = interpolate(f, [STING_FRAMES - 30, STING_FRAMES - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shimmer = interpolate((f % STING_FRAMES), [100, 160], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 90% at 50% 40%, #0B1A3A, ${INK} 70%)`, alignItems: "center", justifyContent: "center" }}>
      <Waves period={STING_FRAMES} top={0.62} spread={0.03} opacity={0.9} />
      <div style={{ opacity: out, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div dir="ltr" style={{ display: "flex", alignItems: "center", gap: 18, transform: `scale(${0.94 + 0.06 * word})` }}>
          <span style={{ fontFamily: "var(--f-serif), Georgia, serif", fontWeight: 300, fontSize: 270, letterSpacing: "0.01em", color: "#F5EFE3", opacity: word, lineHeight: 1 }}>DZAC</span>
          <div style={{ position: "relative", width: 205, height: 280 }}>
            <FiveOutline draw={draw} style={{ width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${shimmer - 12}%, rgba(255,255,255,0.65) ${shimmer}%, transparent ${shimmer + 12}%)`, mixBlendMode: "overlay" }} />
          </div>
        </div>
        <div dir={rtl ? "rtl" : "ltr"} style={{ fontFamily: "var(--display)", fontSize: rtl ? 48 : 62, fontStyle: rtl ? "normal" : "italic", color: "#F5EFE3", opacity: line, transform: `translateY(${(1 - line) * 20}px)`, fontWeight: 300 }}>{tagline}</div>
        <div dir={rtl ? "rtl" : "ltr"} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: rtl ? "var(--text)" : "var(--mono)", fontSize: rtl ? 28 : 22, letterSpacing: rtl ? 0 : "0.3em", textTransform: rtl ? "none" : "uppercase", color: "#E6D5AE", opacity: meta }}>
          <span style={{ width: 70 * meta, height: 1, background: "#E6D5AE" }} />{date}<span style={{ width: 70 * meta, height: 1, background: "#E6D5AE" }} />
        </div>
      </div>
      <Dip frames={10} total={STING_FRAMES} />
    </AbsoluteFill>
  );
}
