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
import { CYAN, Dip, GOLD, Grade, INK, Waves, lightSweep } from "./fx";

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
      <div style={{ fontSize: rtl ? 50 : 64, fontWeight: 300, lineHeight: rtl ? 1.4 : 1.02, letterSpacing: rtl ? 0 : "-0.02em", transform: `translateY(${(1 - inn) * 30}px)`, opacity: inn, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>{text}</div>
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
  const word = spring({ frame: f - 6, fps, config: { damping: 200 } });
  const num = spring({ frame: f - 26, fps, config: { damping: 18, mass: 0.7 } });
  const five = interpolate(f, [0, 110], [0, 1], { extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const line = spring({ frame: f - 60, fps, config: { damping: 200 } });
  const meta = spring({ frame: f - 78, fps, config: { damping: 200 } });
  const out = interpolate(f, [STING_FRAMES - 30, STING_FRAMES - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweep = interpolate(f % STING_FRAMES, [96, 170], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(70% 90% at 50% 38%, #0B2A7A 0%, #0A1A44 38%, ${INK} 78%)`, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* The giant Raftel 5 behind, rising and turning from outline to light. */}
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--num)", fontSize: 1180, lineHeight: 0.8,
        color: "transparent", WebkitTextStroke: `2px rgba(62,209,242,${0.18 + 0.22 * five})`, transform: `translateY(${(1 - five) * 140}px) scale(${1.12 - 0.12 * five})`, opacity: out }}>5</div>
      <Waves period={STING_FRAMES} top={0.66} spread={0.028} opacity={0.85} />
      <div style={{ position: "relative", opacity: out, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div dir="ltr" style={{ display: "flex", alignItems: "flex-start", gap: 14, color: "#F2F6FB" }}>
          <span style={{ fontFamily: "\"Host Grotesk\", sans-serif", fontWeight: 300, fontSize: 300, letterSpacing: "-0.04em", lineHeight: 0.82,
            opacity: word, transform: `translateY(${(1 - word) * 40}px)` }}>DZAC</span>
          <span style={{ fontFamily: "var(--num)", fontSize: 128, lineHeight: 1, color: CYAN, marginTop: 6, opacity: num, transform: `translateY(${(1 - num) * -30}px)` }}>05</span>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div dir={rtl ? "rtl" : "ltr"} style={{ fontFamily: "var(--display)", fontSize: rtl ? 52 : 60, fontWeight: 300, color: "#F2F6FB", opacity: line, transform: `translateY(${(1 - line) * 24}px)`, letterSpacing: rtl ? 0 : "-0.01em" }}>{tagline}</div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 10}%, rgba(255,255,255,0.55) ${sweep}%, transparent ${sweep + 10}%)`, mixBlendMode: "overlay" }} />
        </div>
        <div dir={rtl ? "rtl" : "ltr"} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "var(--text)", fontSize: rtl ? 28 : 22, letterSpacing: rtl ? 0 : "0.32em", textTransform: rtl ? "none" : "uppercase", color: CYAN, opacity: meta }}>
          <span style={{ width: 80 * meta, height: 1, background: CYAN }} />{date}<span style={{ width: 80 * meta, height: 1, background: CYAN }} />
        </div>
      </div>
      <Dip frames={10} total={STING_FRAMES} />
    </AbsoluteFill>
  );
}

/* ── Backdrop: the closing section's moving background, no words ── */

export const BACKDROP_FRAMES = 300;

export function Backdrop() {
  const f = useCurrentFrame();
  const t = (f % BACKDROP_FRAMES) / BACKDROP_FRAMES;
  const breathe = 0.5 - 0.5 * Math.cos(t * Math.PI * 2);
  const sweep = -40 + 180 * t;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(70% 90% at 50% 45%, #0B2A7A 0%, #0A1A44 40%, ${INK} 80%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--num)", fontSize: 1250, lineHeight: 0.8,
        color: "transparent", WebkitTextStroke: `2px rgba(62,209,242,${0.16 + 0.14 * breathe})`, transform: `scale(${1 + 0.04 * breathe}) rotate(${-2 + 4 * breathe}deg)` }}>5</div>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${sweep - 14}%, rgba(62,209,242,0.10) ${sweep}%, transparent ${sweep + 14}%)` }} />
      <Waves period={BACKDROP_FRAMES} top={0.58} spread={0.034} opacity={0.9} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 50% 50%, transparent, rgba(7,13,27,0.55))` }} />
    </AbsoluteFill>
  );
}
