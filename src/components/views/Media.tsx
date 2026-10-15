"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { FILMS, GALLERY_TAGS, SHOTS, WORKSHOP, type Shot } from "@/content/site";
import { useT } from "@/lib/locale";
import { asset, photo } from "@/lib/paths";
import { useLightbox } from "../Lightbox";

const ALL: (Shot & { set: "photos" | "workshop" })[] = [
  ...SHOTS.map((s) => ({ ...s, set: "photos" as const })),
  ...WORKSHOP.map((s) => ({ ...s, set: "workshop" as const })),
];

export function GalleryView() {
  const t = useT();
  const open = useLightbox();
  const [tag, setTag] = useState<string>("all");
  const list = useMemo(() => (tag === "all" ? ALL : ALL.filter((s) => s.tag === tag)), [tag]);
  const alt = t({ en: "DZAC 4, January 2026", ar: "DZAC 4، يناير 2026" });
  return (
    <>
      <div className="chips" role="tablist" aria-label={t({ en: "Filter photos", ar: "تصفية الصور" })}>
        {GALLERY_TAGS.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={tag === g.id} className={`chip${tag === g.id ? " is-on" : ""}`} onClick={() => setTag(g.id)}>
            {t(g.label)} <span className="u-tnum" style={{ opacity: 0.6 }}>{g.id === "all" ? ALL.length : ALL.filter((s) => s.tag === g.id).length}</span>
          </button>
        ))}
      </div>
      <div className="masonry">
        {list.map((s, i) => (
          <button key={`${s.set}-${s.id}`} type="button" className="rv" aria-label={`${alt} · ${i + 1}`}
            onClick={() => open({ kind: "photos", index: i, list: list.map((x) => ({ src: photo(x.id, "lg", x.set), alt })) })}>
            <img src={photo(s.id, "sm", s.set)} alt="" width={s.w} height={s.h} loading="lazy" decoding="async" style={{ aspectRatio: `${s.w} / ${s.h}` }} />
          </button>
        ))}
      </div>
    </>
  );
}

export function FilmsGrid() {
  const t = useT();
  const open = useLightbox();
  return (
    <div className="films">
      {FILMS.map((f, i) => (
        <button key={f.id} type="button" className="film rv" style={{ ["--i" as string]: i }}
          onClick={() => open(f.kind === "file" ? { kind: "file", src: asset(f.src), poster: asset(f.poster), title: t(f.title) } : { kind: "drive", id: f.drive, title: t(f.title) })}>
          <span className="film-ph"><img src={asset(f.poster)} alt="" loading="lazy" decoding="async" /><span className="film-play"><Play size={22} /></span></span>
          <b>{t(f.title)}</b>
          <small>{t(f.sub)}</small>
        </button>
      ))}
    </div>
  );
}
