"use client";

/**
 * A pre-rendered film (scripts/render-films.mjs), played as a native video.
 *
 * The poster is a plain image, there from the first paint. The video loads
 * nothing until it is near the screen, plays only while on screen, and never
 * loads at all under reduced motion or Data Saver. AV1 where the browser can
 * decode it, H.264 everywhere else. `deferred` waits for the page to finish
 * loading first, so the hero film never competes with the first paint.
 */

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/paths";

const AV1 = 'video/mp4; codecs="av01.0.05M.08"';

export function Film({ name, label, className, cover, deferred, small, priority }: {
  /** File stem in public/media/films, e.g. "hero-ltr". */
  name: string;
  label: string;
  className?: string;
  /** Fill the parent and crop, like object-fit: cover. */
  cover?: boolean;
  /** Start only after the page has loaded and gone idle. */
  deferred?: boolean;
  /** A lighter cut for narrow screens: the file stem gets this suffix. */
  small?: string;
  /** Load the poster eagerly with high priority (the hero's largest paint). */
  priority?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = box.current, v = video.current;
    if (!el || !v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    let loaded = false, visible = false, ready = !deferred;
    const stem = small && window.innerWidth < 900 ? `${name}${small}` : name;
    const load = () => {
      if (loaded) return;
      loaded = true;
      v.src = asset(`/media/films/${stem}${v.canPlayType(AV1) ? ".av1" : ""}.mp4`);
      v.load();
    };
    const sync = () => {
      if (!ready) return;
      if (visible) { load(); v.play().catch(() => {}); } else if (loaded) v.pause();
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { rootMargin: "250px 0px" });
    io.observe(el);

    let timer = 0;
    const start = () => { timer = window.setTimeout(() => { ready = true; sync(); }, 400); };
    if (deferred) { if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true }); }

    const onPlay = () => setPlaying(true);
    v.addEventListener("playing", onPlay);
    return () => {
      io.disconnect();
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
      v.removeEventListener("playing", onPlay);
    };
  }, [name, small, deferred]);

  return (
    <div ref={box} className={`fm${cover ? " fm-cover" : ""} ${className ?? ""}`} role="img" aria-label={label}>
      <img className="fm-poster" src={asset(`/media/films/${name}.webp`)} alt="" decoding="async"
        loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} style={{ opacity: playing ? 0 : 1 }} />
      <video ref={video} className="fm-video" muted loop playsInline preload="none" aria-hidden tabIndex={-1} />
    </div>
  );
}
