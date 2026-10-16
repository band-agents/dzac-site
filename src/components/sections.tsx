"use client";

/**
 * The home page, as designed in Claude Design (DZAC 5.dc.html), in the
 * conference's own colours: deep navy, DZAC royal blue and cyan, with the
 * masterclass in navy and gold. Inner pages reuse these sections.
 *
 * Motion is CSS scroll-driven (globals.css, "Motion") and pre-rendered
 * Remotion films / short loops played natively (Film). Nothing waits on
 * JavaScript to be visible.
 */

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, Plus } from "lucide-react";
import {
  BEYOND, EVENT, LEADERS, LOUNGE, MASTERCLASS, NEW, ORGANIZERS, PASSES, PAST_FACULTY, TIERS, TRACKS, UI, type L,
} from "@/content/site";
import { EDITIONS_D, FILMS_D, H } from "@/content/home";
import { P, SESSIONS } from "@/content/programme";
import { useLocale, useT } from "@/lib/locale";
import { CountUp, Reveal, ScrollText } from "@/lib/motion";
import { asset, page } from "@/lib/paths";
import { icsFile } from "@/lib/store";
import { Countdown, Clock } from "./chrome";
import { Film } from "./Film";
import { useLightbox } from "./Lightbox";
import { Rail } from "./Rail";

/** Forward arrow in the reading direction. */
export function Fwd({ size = 16 }: { size?: number }) {
  return <ArrowRight size={size} className="u-flip" />;
}

/** Keeps "DZAC" and its number on one line, in both directions. */
export const nb = (s: string) => s.replace(/DZAC (\d)/g, "DZAC $1");

/** Kept for the inner pages: a card that is just a card now. */
export function Glow({ children, className = "", style, as = "div" }: { children: ReactNode; className?: string; style?: CSSProperties; as?: "div" | "article" | "li" }) {
  const Tag = as;
  return <Tag className={`card ${className}`} style={style}>{children}</Tag>;
}

/** A section band: light (paper) or dark (navy), with the design's page margins. */
export function Section({ children, className = "", id, tone = "light", flush }: {
  children: ReactNode; className?: string; id?: string; tone?: "light" | "dark" | "blue" | "gold"; flush?: boolean;
}) {
  return (
    <section className={`band t-${tone}${flush ? " flush" : ""} ${className}`} id={id}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Eyebrow, title, and an optional link at the far end: the design's section head. */
export function SectionHead({ kicker, title, lead, children, rule }: { kicker?: string; title: string; lead?: string; children?: ReactNode; rule?: boolean }) {
  return (
    <header className={`sh${rule ? " sh-rule" : ""}`}>
      <div className="sh-main">
        {kicker && <Reveal><p className="eyebrow">{kicker}</p></Reveal>}
        <Reveal delay={0.1}><h2 className="h2">{nb(title)}</h2></Reveal>
        {lead && <Reveal delay={0.2}><p className="lead">{lead}</p></Reveal>}
      </div>
      {children && <Reveal delay={0.2} className="sh-act">{children}</Reveal>}
    </header>
  );
}

const k = (n: number) => ({ ["--k" as string]: n }) as CSSProperties;

/* ── Hero ──────────────────────────────────────────────── */

export function Hero() {
  const t = useT();
  const locale = useLocale();
  const open = useLightbox();
  return (
    <section className="hero t-dark">
      <div className="hero-media">
        <Film name={`hero-${locale === "ar" ? "rtl" : "ltr"}`} small="-sm" cover deferred priority label={t({ en: "Highlights from DZAC 4", ar: "لقطات من DZAC 4" })} />
      </div>
      <div className="hero-tint" aria-hidden />
      <div className="hero-five" aria-hidden>5</div>
      <div className="hero-in wrap">
        <p className="hero-eyebrow" style={k(0)}><i className="pulse" />{t(H.heroEyebrow)}</p>
        <div className="hero-head">
          <h1 className="hero-title" style={k(1)} dir="ltr"><span>DZAC</span><sup>05</sup><span className="sr-only"> 5</span></h1>
          <p className="hero-tag" style={k(2)}>{t(EVENT.tagline)}</p>
        </div>
        <div className="hero-facts" style={k(3)}>
          <div><span className="lbl">{t(H.when)}</span><span className="val">{t(EVENT.date)}</span></div>
          <div><span className="lbl">{t(H.where)}</span><span className="val">{t(EVENT.venue)}</span></div>
          <div><span className="lbl">{t(H.opensIn)}</span><Clock /></div>
        </div>
        <div className="hero-cta" style={k(4)}>
          <Link href={page(locale, "register")} className="btn btn-light btn-lg">{t(UI.registerNow)} <Fwd /></Link>
          <Link href={page(locale, "apply")} className="btn btn-line btn-lg">{t(H.findPass)}</Link>
          <button type="button" className="play-link" onClick={() => open({ kind: "drive", id: FILMS_D[0].drive!, title: t(FILMS_D[0].title) })}>
            <span className="play-dot"><Play size={12} /></span>{t(H.watchReveal)}
          </button>
        </div>
      </div>
      <div className="hero-cue" aria-hidden><i /></div>
    </section>
  );
}

/* ── Marquee & intro ───────────────────────────────────── */

export function Marquee() {
  const t = useT();
  const words = [...TRACKS.map((x) => t(x.title)), ...BEYOND.map((x) => t(x.title))];
  return (
    <div className="mq t-dark" aria-hidden>
      <div className="mq-track">
        {[0, 1].map((n) => (
          <span key={n}>{words.map((w, i) => <span key={i} className="mq-item">{w}<b>✦</b></span>)}</span>
        ))}
      </div>
    </div>
  );
}

export function Intro() {
  const t = useT();
  return (
    <section className="band t-light intro">
      <div className="wrap intro-grid">
        <div className="intro-copy">
          <Reveal><p className="eyebrow">{t(H.introEyebrow)}</p></Reveal>
          <ScrollText className="intro-body" text={t(H.introBody)} />
        </div>
        <div className="facts">
          {H.facts.map((f, i) => (
            <Reveal key={i} delay={i * 0.1} className="fact">
              <CountUp to={f.n} className="fact-n" />
              <span className="fact-l">{t(f.l)}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── What's new ────────────────────────────────────────── */

export function WhatsNew() {
  const t = useT();
  return (
    <Section className="news-band flush">
      <header className="sh sh-rule sh-inline">
        <Reveal><h2 className="h2">{t(H.newTitle)}</h2></Reveal>
        <Reveal delay={0.1}><p className="eyebrow">{t(H.newEyebrow)}</p></Reveal>
      </header>
      <Rail className="news" label={t(H.newTitle)}>
        {NEW.map((n, i) => (
          <article key={i} className="news-item">
            <span className="num">0{i + 1}</span>
            <h3>{t(n.title)}</h3>
            <p>{t(n.body)}</p>
          </article>
        ))}
      </Rail>
    </Section>
  );
}

/* ── Programme: six tracks that open into their sessions, then Beyond ─ */

export function Tracks({ link = true }: { link?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Section tone="dark" className="prog">
      <SectionHead kicker={t(H.progEyebrow)} title={t(H.progTitle)}>
        {link && <Link href={page(locale, "program")} className="tlink">{t(H.fullProgramme)} <Fwd size={14} /></Link>}
      </SectionHead>
      <ol className="tracks">
        {TRACKS.map((tr) => {
          const on = open === tr.n;
          return (
            <li key={tr.n} className={`track${on ? " is-open" : ""}`}>
              <button type="button" className="track-row" aria-expanded={on} onClick={() => setOpen(on ? null : tr.n)}>
                <span className="track-n">{tr.n}</span>
                <span className="track-name">{t(tr.title)}</span>
                <span className="track-count">{t(P.talks)}</span>
                <span className="track-plus" aria-hidden><Plus size={18} /></span>
              </button>
              <div className="track-body" role="region">
                <ul>
                  {(SESSIONS[tr.n] ?? []).map((s, i) => (
                    <li key={i}>
                      <span className="sess-i">{tr.n}.{i + 1}</span>
                      <span className="sess-t" dir="ltr">{s.title}</span>
                      <span className="sess-s" dir="ltr">{s.speaker || t(P.tbc)}</span>
                    </li>
                  ))}
                  <li className="sess-disc"><span className="sess-i">{tr.n}.4</span><span className="sess-t">{t(P.discussion)}</span><span /></li>
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
      <Beyond inline />
    </Section>
  );
}

/** Beyond andrology: the Elegant script, then five themes. */
export function Beyond({ inline }: { inline?: boolean }) {
  const t = useT();
  const body = (
    <div className="beyond">
      <Reveal className="beyond-head">
        <span className="script" dir="ltr">Beyond</span>
        <h3 className="h3">{t(H.beyondTitle)}</h3>
        <p className="lead">{t(H.beyondCaption)}</p>
      </Reveal>
      <Rail className="beyond-grid" label={t(H.beyondTitle)}>
        {BEYOND.map((b, i) => (
          <article key={i} className="beyond-item">
            <span className="num">0{i + 1}</span>
            <b>{t(b.title)}</b>
            <span>{t(b.body)}</span>
          </article>
        ))}
      </Rail>
    </div>
  );
  return inline ? body : <Section tone="dark">{body}</Section>;
}

/* ── Masterclass: the OR film, the count, the facts ─────── */

export function Masterclass({ link = true }: { link?: boolean }) {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="mc t-gold">
      <div className="mc-media">
        <Film name={`or-${locale}`} cover label={t({ en: "The masterclass operating room, as a live feed", ar: "غرفة عمليات الماستر كلاس كبث مباشر" })} />
        <span className="live"><i className="pulse red" />{t(H.liveOR)}</span>
      </div>
      <div className="mc-copy">
        <Reveal><p className="eyebrow">{t(H.mcEyebrow)}</p></Reveal>
        <Reveal delay={0.1}><h2 className="h2">{t(H.mcTitle)}</h2></Reveal>
        <Reveal delay={0.15} className="mc-count">
          <CountUp to={MASTERCLASS.count} className="mc-num" />
          <span>{t(H.mcLive)}</span>
        </Reveal>
        <Reveal delay={0.2} as="ul" className="dash-list">
          {MASTERCLASS.points.map((x, i) => <li key={i}>{t(x)}</li>)}
          <li>{t(MASTERCLASS.approach)}</li>
        </Reveal>
        <Reveal delay={0.25} className="mc-fee">
          <div>
            <span className="lbl">{t(H.fee)}</span>
            <b dir="ltr">5,000 €<sup>*</sup></b>
          </div>
          <div className="row">
            <Link href={`${page(locale, "apply")}?intent=masterclass`} className="btn btn-gold">{t(H.reserveSeat)}</Link>
            {link && <Link href={page(locale, "masterclass")} className="btn btn-line">{t(H.details)}</Link>}
          </div>
        </Reveal>
        <p className="note-sm">* {t(H.currencyNote)}</p>
      </div>
    </section>
  );
}

/* ── Leadership ────────────────────────────────────────── */

export function Faculty({ past = true, head = true }: { past?: boolean; head?: boolean }) {
  const t = useT();
  const locale = useLocale();
  return (
    <Section className={head ? "" : "flush"}>
      {head && (
        <SectionHead kicker={t(H.facEyebrow)} title={t(H.facTitle)}>
          <Link href={page(locale, "faculty")} className="tlink">{t(H.allFaculty)} <Fwd size={14} /></Link>
        </SectionHead>
      )}
      <Rail className="leaders" label={t(H.facTitle)}>
        {LEADERS.map((l, i) => (
          <article key={i} className="leader">
            <div className="leader-ph">
              {l.photo
                ? <img src={asset(l.photo.replace("/photos/", "/photos/sm/"))} alt={t(l.name)} loading="lazy" decoding="async" />
                : <span className="leader-init" aria-hidden>{l.name.en.replace(/^(Prof\. Dr\.|Prof\.|Dr\.)\s*/, "").split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}</span>}
            </div>
            <span className="lbl">{t(l.role)}</span>
            <b>{t(l.name)}</b>
          </article>
        ))}
      </Rail>
      <Reveal className="orgs">
        {ORGANIZERS.map((o, i) => (
          <div key={i}><span className="lbl">{t(o.role)}</span><b>{t(o.name)}</b></div>
        ))}
      </Reveal>
      {past && (
        <Reveal className="past">
          <span className="past-l">{t(H.pastFaculty)}</span>
          <div className="past-names">{PAST_FACULTY.map((p, i) => <span key={i}>{t(p.name)}</span>)}</div>
        </Reveal>
      )}
    </Section>
  );
}

/* ── DZAC 4 in review: a film that opens to full bleed as you scroll ─ */

export function Review() {
  const t = useT();
  const locale = useLocale();
  const stats: { n: string; l: L }[] = [
    { n: "8–9 Jan 2026", l: { en: "Two conference days", ar: "يوما المؤتمر" } },
    { n: "2", l: { en: "Venues: Triumph Luxury Hotel and Alexandria Urology Hospital", ar: "مقرّان: فندق تريومف ومستشفى الإسكندرية لجراحة المسالك" } },
    { n: "4th", l: { en: "Edition, «Empowering the Future of Male Health»", ar: "نسخة، بشعار «تمكين مستقبل صحة الرجل»" } },
  ];
  return (
    <section className="review t-dark">
      <div className="review-stage">
        <div className="review-frame">
          <Film name="review" dir="loops" av1={false} cover label={t(H.reviewCaption)} />
          <div className="review-shade" aria-hidden />
          <div className="review-title wrap">
            <p className="eyebrow">{t(H.reviewEyebrow)}</p>
            <h2 className="h2">{t(H.reviewTitle)}</h2>
            <span className="note-sm">{t(H.reviewCaption)}</span>
          </div>
        </div>
      </div>
      <div className="wrap review-stats">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.1} className="rstat"><b dir="ltr">{s.n}</b><span>{t(s.l)}</span></Reveal>
        ))}
        <Reveal delay={0.3} className="rstat rstat-act">
          <Link href={page(locale, "gallery")} className="btn btn-line">{t(H.gallery)}</Link>
          <Link href={page(locale, "films")} className="btn btn-light">{t(H.films)}</Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Five editions: a pinned sideways scroll on desktop, a swipe on phones ─ */

export function Editions() {
  const t = useT();
  return (
    <section className="eds t-light">
      <div className="eds-pin">
        <div className="wrap">
          <SectionHead kicker={t(H.histEyebrow)} title={t(H.histTitle)} />
        </div>
        <Rail className="eds-row" stagger={false} label={t(H.histTitle)}>
          {EDITIONS_D.map((e) => (
            <article key={e.n} className={`ed${e.n === "05" ? " is-now" : ""}`}>
              <span className="ed-n" dir="ltr">{e.n}</span>
              <span className="lbl">{t(e.when)}</span>
              <b>{t(e.place)}</b>
              <span className="ed-note">{t(e.note)}</span>
            </article>
          ))}
        </Rail>
        <div className="eds-bar" aria-hidden><i /></div>
      </div>
    </section>
  );
}

/* ── Men's Lounge: vertical interview loops ──────────────── */

export function Lounge() {
  const t = useT();
  const open = useLightbox();
  return (
    <section className="lounge t-blue">
      <div className="wrap lounge-head">
        <Reveal className="sh-main">
          <p className="eyebrow" dir="ltr">Men’s Lounge Talks</p>
          <h2 className="h2">{t(H.loungeTitle)}</h2>
        </Reveal>
        <Reveal delay={0.1}><p className="lead">{t(H.loungeBody)}</p></Reveal>
      </div>
      <Rail className="reels" stagger={false} label={t(H.loungeTitle)}>
        {LOUNGE.map((r, i) => (
          <button key={r.id} type="button" className="reel" onClick={() => open({ kind: "drive", id: r.id, title: `DZAC 4 · ${i + 1}`, vertical: true })}
            aria-label={t({ en: `Play interview ${i + 1}`, ar: `تشغيل اللقاء ${i + 1}` })} style={k(i)}>
            <div className="reel-media">
              <Film name={`lounge-${i + 1}`} dir="loops" av1={false} cover label="" />
              <span className="reel-ep" dir="ltr">EP {String(i + 1).padStart(2, "0")}</span>
              <span className="reel-play"><Play size={14} /></span>
            </div>
            <span className="reel-cap">{t(H.interview)}</span>
          </button>
        ))}
      </Rail>
    </section>
  );
}

/* ── Films: four cards that preview in view ─────────────── */

export function Films({ head = true }: { head?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const open = useLightbox();
  return (
    <Section tone="dark" className={head ? "" : "flush"}>
      {head && (
        <SectionHead kicker={t(H.filmsEyebrow)} title={t(H.filmsTitle)}>
          <Link href={page(locale, "films")} className="tlink">{t(H.allFilms)} <Fwd size={14} /></Link>
        </SectionHead>
      )}
      <Rail className="films" label={t(H.filmsTitle)}>
        {FILMS_D.map((f) => (
          <button key={f.key} type="button" className="film-card"
            onClick={() => open(f.file ? { kind: "file", src: asset(f.file), poster: asset(`/media/loops/film-${f.key}.webp`), title: t(f.title) } : { kind: "drive", id: f.drive!, title: t(f.title) })}>
            <div className="film-media">
              <Film name={`film-${f.key}`} dir="loops" av1={false} cover label="" />
              <span className="film-play"><Play size={16} /></span>
              <span className="film-kind">{t(f.kind)}</span>
            </div>
            <b>{t(f.title)}</b>
          </button>
        ))}
      </Rail>
    </Section>
  );
}

/* ── Passes ────────────────────────────────────────────── */

export function Passes() {
  const t = useT();
  const locale = useLocale();
  return (
    <Section id="passes">
      <SectionHead kicker={t(H.passEyebrow)} title={t(H.passTitle)} />
      <div className="passes">
        {PASSES.map((p, i) => (
          <article key={p.id} className={`pass pass-${p.id}`} style={k(i)}>
            <div className="pass-top">
              <span className="lbl">{t(p.name)}</span>
              {p.featured && <span className="best">{t(H.bestValue)}</span>}
            </div>
            <span className="pass-price" dir={p.id === "masterclass" ? "ltr" : undefined}>{p.id === "bundle" ? t({ en: "Conference + masterclass", ar: "المؤتمر + الماستركلاس" }) : t(p.price)}</span>
            <ul>{p.points.map((x, j) => <li key={j}>{t(x)}</li>)}</ul>
            <Link href={`${page(locale, "register")}?pass=${p.id}`} className="btn pass-btn">{t(H.choose)}</Link>
          </article>
        ))}
      </div>
      <Reveal className="not-sure">
        {t(H.notSure)} <Link href={page(locale, "apply")}>{t(H.notSureCta)}</Link>
      </Reveal>
    </Section>
  );
}

/* ── Partners ──────────────────────────────────────────── */

export function Tiers({ head = true }: { link?: boolean; head?: boolean }) {
  const t = useT();
  const locale = useLocale();
  return (
    <Section className={`partners${head ? "" : " flush"}`}>
      <div className="part-grid">
        <Reveal className="part-copy">
          {head && <p className="eyebrow">{t(H.partEyebrow)}</p>}
          {head && <h2 className="h2">{nb(t(H.partTitle))}</h2>}
          <p className="lead">{t(H.partBody)}</p>
          <div className="row">
            <Link href={`${page(locale, "apply")}?intent=partner`} className="btn btn-dark">{t(H.becomePartner)}</Link>
            {head && <Link href={page(locale, "partners")} className="btn btn-line">{t(H.compareTiers)}</Link>}
          </div>
        </Reveal>
        <div className="tier-list">
          {TIERS.map((tr, i) => (
            <Reveal key={tr.id} delay={i * 0.1} className={`tier tier-${tr.id}`}>
              <span className="tier-name">{t(tr.name)}</span>
              <span className="tier-line">{tr.points.map((p) => t(p)).join(" · ")}</span>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="orgs orgs-light">
        {ORGANIZERS.map((o, i) => (
          <div key={i}><span className="lbl">{t(o.role)}</span><b>{t(o.name)}</b></div>
        ))}
      </Reveal>
    </Section>
  );
}

/* ── Venue ─────────────────────────────────────────────── */

export function Venue() {
  const t = useT();
  return (
    <section className="venue t-dark">
      <div className="venue-media">
        <Film name="venue" dir="loops" av1={false} cover label={t(H.venueName)} />
      </div>
      <div className="venue-copy">
        <Reveal><p className="eyebrow">{t(H.venueEyebrow)}</p></Reveal>
        <Reveal delay={0.1}><h2 className="h2">{t(H.venueName)}</h2></Reveal>
        <Reveal delay={0.15}><p className="lead">{t(H.venueCity)} · {t(EVENT.date)}</p></Reveal>
        <Reveal delay={0.2} className="row">
          <a className="btn btn-line" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`} target="_blank" rel="noreferrer">{t(H.directions)} <ArrowUpRight size={15} /></a>
          <button type="button" className="btn btn-line" onClick={() => { const a = document.createElement("a"); a.href = icsFile(`DZAC 5 · ${EVENT.full.en}`, EVENT.venue.en); a.download = "DZAC5.ics"; a.click(); }}>{t(H.addCal)}</button>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Final call: the closing film, the countdown, the way in ─ */

export function Final() {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="final t-dark">
      <div className="final-media">
        <Film name="backdrop" small="-sm" cover label="" />
      </div>
      <div className="final-shade" aria-hidden />
      <div className="final-in wrap">
        <Reveal><p className="eyebrow">{t(H.finalEyebrow)}</p></Reveal>
        <Reveal delay={0.1}><h2 className="final-title">{t(EVENT.tagline)}</h2></Reveal>
        <Reveal delay={0.2}><Countdown /></Reveal>
        <Reveal delay={0.3} className="row row-c">
          <Link href={page(locale, "register")} className="btn btn-light btn-lg">{t(UI.registerNow)} <Fwd /></Link>
          <Link href={page(locale, "apply")} className="btn btn-line btn-lg">{t(H.findPass)}</Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Inner page hero ───────────────────────────────────── */

export function PageHero({ kicker, title, lead, bg, children }: { kicker: string; title: string; lead?: string; bg?: string; children?: ReactNode }) {
  return (
    <section className="ph t-dark">
      {bg && <div className="ph-bg" aria-hidden><img src={bg} alt="" decoding="async" /></div>}
      <div className="wrap ph-in">
        <p className="eyebrow" style={k(0)}>{kicker}</p>
        <h1 className="h1" style={k(1)}>{nb(title)}</h1>
        {lead && <p className="lead" style={k(2)}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/* Kept for pages that still import it. */
export function ApplyBand() {
  return null;
}
