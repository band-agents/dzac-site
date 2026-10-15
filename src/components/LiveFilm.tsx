"use client";

/**
 * A Remotion film, live in the page.
 *
 * The poster image is there from the first paint, so nothing waits on the
 * film. The Player mounts after hydration, plays only while on screen, and
 * never mounts at all under reduced motion: the poster stays.
 *
 * The Player sits in dir="ltr" because inside a right-to-left page it
 * positions its scaled canvas from the wrong edge and shows only a sliver.
 * The films set their own text direction.
 */

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { useReducedMotion } from "framer-motion";

export function LiveFilm<P extends Record<string, unknown>>({
  component, inputProps, width, height, frames, poster, label, className, style, cover,
}: {
  component: ComponentType<P>; inputProps: P; width: number; height: number; frames: number;
  poster?: string; label: string; className?: string; style?: CSSProperties;
  /** Fill the parent like object-fit: cover, cropping the film's edges. */
  cover?: boolean;
}) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { if (!reduce) setMounted(true); }, [reduce]);

  useEffect(() => {
    const el = box.current;
    if (!mounted || !el) return;
    const io = new IntersectionObserver(([e]) => {
      const p = player.current;
      if (!p) return;
      if (e.isIntersecting) p.play(); else p.pause();
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const on = () => setReady(true);
    p.addEventListener("play", on);
    return () => p.removeEventListener("play", on);
  }, [mounted]);

  const ratio = `${width} / ${height}`;
  return (
    <div ref={box} className={`lf ${cover ? "lf-cover" : ""} ${className ?? ""}`} style={{ ...style, ["--lf-ratio" as string]: ratio }} role="img" aria-label={label} dir="ltr">
      <div className="lf-frame">
        {poster && <img src={poster} alt="" className="lf-poster" style={{ opacity: ready ? 0 : 1 }} />}
        {mounted && (
          <Player
            ref={player}
            component={component as ComponentType<Record<string, unknown>>}
            inputProps={inputProps}
            durationInFrames={frames}
            fps={30}
            compositionWidth={width}
            compositionHeight={height}
            loop
            initiallyMuted
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            acknowledgeRemotionLicense
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          />
        )}
      </div>
    </div>
  );
}
