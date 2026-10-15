"use client";

/**
 * The sections the home page is built from; the inner pages reuse them.
 *
 * Every section is a `.s` (equal space above and below its content) with a
 * centred heading (`SectionHead`), and its content is symmetric: equal
 * columns, equal card padding, featured items in the centre. The films are
 * pre-rendered video (Film); motion is CSS (lib/motion).
 */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  Activity, Apple, ArrowRight, CalendarDays, Cpu, Globe2, Leaf, MapPin, Mic, Play, Scissors, Stethoscope, Ticket,
  type LucideIcon,
} from "lucide-react";
import {
  BEYOND, BEYOND_LINE, EDITIONS, EVENT, FILMS, HOME, LEADERS, LOUNGE, MASTERCLASS, NEW, ORGANIZERS, PARTNERS_FOR, PASSES, PAST_FACULTY,
  PROGRAM_NOTE, REVIEW, SHOTS, TIERS, TRACKS, UI,
} from "@/content/site";
import { useLocale, useT } from "@/lib/locale";
import { CountUp, Parallax, Reveal, ScrollText, Stagger } from "@/lib/motion";
import { asset, page, photo } from "@/lib/paths";
import { FiveOutline } from "./brand";
import { Countdown } from "./chrome";
import { Film } from "./Film";
import { useLightbox } from "./Lightbox";

const ICONS: Record<string, LucideIcon> = { Globe2, Stethoscope, Mic, Ticket, Leaf, Scissors, Activity, Apple, Cpu };

/** Forward arrow in the reading direction. */
export function Fwd({ size = 16 }: { size?: number }) {
  return <ArrowRight size={size} className="u-flip" />;
}

/** A card with a soft light that follows the pointer. */
export function Glow({ children, className = "", style, as = "div" }: { children: ReactNode; className?: string; style?: CSSProperties; as?: "div" | "article" | "li" }) {
  const Tag = as;
  return (
    <Tag className={`glow ${className}`} style={style}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}>
      {children}
    </Tag>
  );
}

/** Keeps "DZAC" and its number on one line, in both directions. */
export const nb = (s: string) => s.replace(/DZAC (\d)/g, "DZAC $1");

/** A section: the same space above and below, content in the centred column. */
export function Section({ children, className = "", id, flush }: { children: ReactNode; className?: string; id?: string; flush?: boolean }) {
  return (
    <section className={`s${flush ? " s-flush" : ""} ${className}`} id={id}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Centred heading: kicker, title, lead, and an optional link, one rhythm everywhere. */
export function SectionHead({ kicker, title, lead, children }: { kicker?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="sh">
      {kicker && <Reveal><p className="kicker">{kicker}</p></Reveal>}
      <Reveal delay={0.1}><h2 className="h2">{nb(title)}</h2></Reveal>
      {lead && <Reveal delay={0.2}><p className="lead">{lead}</p></Reveal>}
      {children && <Reveal delay={0.3} className="sh-act">{children}</Reveal>}
    </header>
  );
}

/* ── Hero ──────────────────────────────────────────────── */

export function Hero() {
  const t = useT();
  const locale = useLocale();
  const open = useLightbox();
  const film = FILMS[0];
  const k = (n: number) => ({ ["--k" as string]: n }) as CSSProperties;
  return (
    <section className="hero">
      <div className="hero-film">
        <Film name={`hero-${locale === "ar" ? "rtl" : "ltr"}`} small="-sm" cover deferred priority
          label={t({ en: "Highlights from DZAC 4", ar: "لقطات من DZAC 4" })} />
      </div>
      <div className="hero-shade" aria-hidden />
      <div className="hero-in">
        <div className="hero-kick" style={k(0)}>
          <span className="pill">{t(EVENT.full)}</span>
          <span className="pill">{t(EVENT.edition)}</span>
        </div>
        <h1 className="hero-title" style={k(1)}>
          <span className="wm" dir="ltr">
            <span className="wm-dzac">DZAC</span>
            <FiveOutline className="wm-five five-draw" />
          </span>
          <span className="sr-only">DZAC 5</span>
        </h1>
        <p className="hero-tag" style={k(2)}>{t(EVENT.tagline)}</p>
        <p className="hero-meta" style={k(3)}>
          <span><CalendarDays size={16} />{t(EVENT.date)}</span>
          <span><MapPin size={16} />{t(EVENT.venue)}</span>
        </p>
        <div className="hero-cta" style={k(4)}>
          <Link href={page(locale, "register")} className="btn btn-primary btn-lg">{t(UI.registerNow)} <Fwd /></Link>
          {film.kind === "file" && (
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => open({ kind: "file", src: asset(film.src), poster: asset(film.poster), title: t(film.title) })}>
              <Play size={15} /> {t(UI.watch)}
            </button>
          )}
        </div>
        <div style={{ ...k(5), width: "100%", display: "grid", justifyItems: "center" }}><Countdown /></div>
      </div>
    </section>
  );
}

/* ── Marquee & statement ───────────────────────────────── */

export function Marquee() {
  const t = useT();
  const words = [...TRACKS.map((x) => t(x.title)), ...BEYOND.map((x) => t(x.title))];
  return (
    <div className="mq" aria-hidden>
      <div className="mq-track">
        {[0, 1].map((k) => (
          <span key={k}>{words.map((w, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 32 }}>{w}<b /></span>)}</span>
        ))}
      </div>
    </div>
  );
}

/** Pinned at the centre of the screen until every word has lit. */
export function Statement() {
  const t = useT();
  return (
    <section className="stmt">
      <div className="stmt-pin">
        <div className="wrap stmt-in">
          <p className="kicker">{t({ en: "DZAC since its first edition", ar: "DZAC منذ نسخته الأولى" })}</p>
          <ScrollText className="statement" text={t(HOME.statement)} />
        </div>
      </div>
    </section>
  );
}

/* ── What's new ────────────────────────────────────────── */

export function WhatsNew() {
  const t = useT();
  return (
    <Section>
      <SectionHead kicker={t(EVENT.edition)} title={t(HOME.newTitle)} />
      <Stagger className="grid-4">
        {NEW.map((n, i) => {
          const I = ICONS[n.icon] ?? Globe2;
          return (
            <Glow key={i} className="card">
              <span className="card-n u-tnum">0{i + 1}</span>
              <span className="card-i"><I size={22} /></span>
              <h3>{t(n.title)}</h3>
              <p>{t(n.body)}</p>
            </Glow>
          );
        })}
      </Stagger>
    </Section>
  );
}

/* ── Program ───────────────────────────────────────────── */

export function Tracks({ link = true }: { link?: boolean }) {
  const t = useT();
  const locale = useLocale();
  return (
    <Section>
      <SectionHead kicker={t({ en: "Scientific program", ar: "البرنامج العلمي" })} title={t(HOME.programTitle)} lead={t(PROGRAM_NOTE)}>
        {link && <Link href={page(locale, "program")} className="link">{t(UI.seeProgram)} <Fwd /></Link>}
      </SectionHead>
      <Stagger as="ol" className="grid-3">
        {TRACKS.map((tr) => (
          <Glow as="li" key={tr.n} className="card track-card">
            <span className="card-n u-tnum">{tr.n}</span>
            <h3>{t(tr.title)}</h3>
            <p>{t(tr.body)}</p>
          </Glow>
        ))}
      </Stagger>
    </Section>
  );
}

/**
 * Five panels that travel sideways while the section is pinned. The page
 * does not move on until the last panel has fully arrived (globals.css,
 * Motion). Without scroll-driven animation it is a row you swipe.
 */
export function Beyond() {
  const t = useT();
  return (
    <section className="bx" style={{ ["--n" as string]: BEYOND.length }}>
      <div className="bx-pin">
        <SectionHead kicker={t({ en: "New in DZAC 5", ar: "جديد DZAC 5" })} title={t(HOME.beyondTitle)} lead={t(BEYOND_LINE)} />
        <div className="bx-row">
          {BEYOND.map((b, i) => {
            const I = ICONS[b.icon] ?? Leaf;
            return (
              <article key={i} className="bx-card">
                <span className="bx-big" aria-hidden>{i + 1}</span>
                <span className="card-i"><I size={24} /></span>
                <div>
                  <h3>{t(b.title)}</h3>
                  <p>{t(b.body)}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="bx-progress" aria-hidden><i /></div>
      </div>
    </section>
  );
}

/* ── Masterclass: count · film · details ──────────────── */

export function Masterclass({ link = true }: { link?: boolean }) {
  const t = useT();
  const locale = useLocale();
  return (
    <Section className="mc">
      <SectionHead kicker={t(MASTERCLASS.kicker)} title={t(MASTERCLASS.title)} lead={t(MASTERCLASS.approach)} />
      <div className="mc-grid">
        <Reveal className="mc-side">
          <div className="mc-count">
            <b className="gold-text"><CountUp to={MASTERCLASS.count} /></b>
            <span>{t(MASTERCLASS.countLabel)}<em>{t(MASTERCLASS.scrub)}</em></span>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mc-film fm-frame" style={{ position: "relative", overflow: "hidden" }}>
          <Film name={`or-${locale}`} cover label={t({ en: "The masterclass operating room, as a live feed", ar: "غرفة عمليات الماستر كلاس كبث مباشر" })} />
        </Reveal>
        <Reveal delay={0.2} className="mc-side">
          <ul className="mc-list">{MASTERCLASS.points.map((x, i) => <li key={i}>{t(x)}</li>)}</ul>
          <div className="mc-fee">
            <b dir="ltr">{MASTERCLASS.fee}</b>
            <span className="tag">{t(UI.provisional)} · {t(UI.limited)}</span>
          </div>
          <div className="row-c">
            <Link href={`${page(locale, "apply")}?intent=masterclass`} className="btn btn-gold">{t({ en: "Apply for a seat", ar: "قدّم على مقعد" })}</Link>
            {link && <Link href={page(locale, "masterclass")} className="btn btn-ghost">{t(UI.learnMore)}</Link>}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Faculty ───────────────────────────────────────────── */

const initials = (s: string) => s.replace(/^(Prof\.|Dr\.|Prof\. Dr\.)\s*/g, "").replace(/^(Prof\.|Dr\.)\s*/g, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");

export function Faculty({ past = true, head = true }: { past?: boolean; head?: boolean }) {
  const t = useT();
  return (
    <Section flush={!head}>
      {head && <SectionHead kicker={t({ en: "Faculty", ar: "المحاضرون" })} title={t(HOME.facultyTitle)} />}
      <Stagger className="grid-4">
        {LEADERS.map((l, i) => (
          <Glow key={i} className="card leader" as="article">
            <div className="leader-ph">
              {l.photo ? <img src={asset(l.photo.replace("/photos/", "/photos/sm/"))} alt={t(l.name)} loading="lazy" decoding="async" /> : <span className="leader-init" aria-hidden>{initials(l.name.en)}</span>}
            </div>
            <div className="leader-tx">
              <small>{t(l.role)}</small>
              <b>{t(l.name)}</b>
            </div>
          </Glow>
        ))}
      </Stagger>
      <Reveal className="grid-3 orgs">
        {ORGANIZERS.map((o, i) => (
          <div key={i} className="org"><small>{t(o.role)}</small><b>{t(o.name)}</b></div>
        ))}
      </Reveal>
      {past && (
        <>
          <Reveal className="past-h"><p className="kicker">{t(HOME.pastFaculty)}</p></Reveal>
          <Stagger as="ul" className="past">
            {PAST_FACULTY.map((p, i) => <li key={i}><b>{t(p.name)}</b><small>{t(p.from)}</small></li>)}
          </Stagger>
        </>
      )}
    </Section>
  );
}

/* ── DZAC 4 in review: a mirrored mosaic ─────────────────── */

/** Small and large sources for a gallery photo, so the browser picks the size it needs. */
function srcSet(id: string) {
  const s = SHOTS.find((x) => x.id === id);
  return `${photo(id, "sm")} 720w, ${photo(id)} ${s?.w ?? 1200}w`;
}

export function Review() {
  const t = useT();
  const locale = useLocale();
  /* Left column, centre (tall), right column: the two sides mirror each other. */
  const shots = [["1721", ""], ["1481", ""], ["1585", "is-center"], ["1233", ""], ["2025", ""]] as const;
  return (
    <Section>
      <SectionHead kicker="DZAC 4" title={t(HOME.reviewTitle)}>
        <Link href={page(locale, "gallery")} className="link">{t(UI.allPhotos)} <Fwd /></Link>
      </SectionHead>
      <Stagger className="rv-grid">
        {shots.map(([id, cls]) => (
          <div key={id} className={`rv-ph ${cls}`}>
            <Parallax>
              <img src={photo(id, "sm")} srcSet={srcSet(id)} sizes={cls ? "(max-width: 760px) 100vw, 40vw" : "(max-width: 760px) 50vw, 30vw"}
                alt="" loading="lazy" decoding="async" />
            </Parallax>
          </div>
        ))}
      </Stagger>
      <Stagger className="grid-3 rv-stats">
        {REVIEW.stats.map((s, i) => (
          <div key={i} className="rv-stat"><b className="grad-text">{s.v}</b><span>{t(s.l)}</span></div>
        ))}
      </Stagger>
    </Section>
  );
}

/* ── Editions ──────────────────────────────────────────── */

export function Editions() {
  const t = useT();
  return (
    <Section>
      <SectionHead kicker={t({ en: "Since the first edition", ar: "منذ النسخة الأولى" })} title={t(HOME.editionsTitle)} />
      <Stagger className="ed">
        <div className="ed-line" aria-hidden><i /></div>
        {EDITIONS.map((e) => (
          <div key={e.n} className={`ed-item${e.n === 5 ? " is-now" : ""}`}>
            <span className="ed-dot" aria-hidden />
            <span className="ed-n">DZAC {e.n}</span>
            <span className="ed-when">{t(e.when)}</span>
            <b>{t(e.theme)}</b>
            <p>{t(e.where)}</p>
          </div>
        ))}
      </Stagger>
    </Section>
  );
}

/* ── Men's Lounge ──────────────────────────────────────── */

export function Lounge() {
  const t = useT();
  const open = useLightbox();
  return (
    <Section>
      <SectionHead kicker={t({ en: "Video series", ar: "سلسلة فيديو" })} title={t(HOME.loungeTitle)} lead={t(HOME.loungeBody)} />
      <Stagger className="reels">
        {LOUNGE.map((r, i) => (
          <button key={r.id} type="button" className="reel" onClick={() => open({ kind: "drive", id: r.id, title: `DZAC 4 · ${i + 1}`, vertical: true })}
            aria-label={t({ en: `Play interview ${i + 1}`, ar: `تشغيل اللقاء ${i + 1}` })}>
            <img src={asset(`/media/lounge/${r.img}.webp`)} alt="" loading="lazy" decoding="async" />
            <span className="reel-play"><Play size={15} /></span>
          </button>
        ))}
      </Stagger>
    </Section>
  );
}

/* ── Apply ─────────────────────────────────────────────── */

const APPLY_PATHS = [
  { id: "attend", label: { en: "Attend", ar: "الحضور" } },
  { id: "masterclass", label: { en: "Masterclass seat", ar: "مقعد الماستر كلاس" } },
  { id: "speak", label: { en: "Present", ar: "تقديم بحث" } },
  { id: "partner", label: { en: "Partner", ar: "شراكة" } },
  { id: "media", label: { en: "Press", ar: "الإعلام" } },
];

export function ApplyBand() {
  const t = useT();
  const locale = useLocale();
  return (
    <Section>
      <Reveal>
        <Glow className="apb">
          <SectionHead kicker={t({ en: "Apply · about a minute", ar: "التقديم · حوالي دقيقة" })}
            title={`${t({ en: "Not sure where you fit?", ar: "لست متأكدًا أين مكانك؟" })}`}
            lead={t({ en: "A few questions, shaped by your answers. We'll tell you which pass, seat or partnership suits you, and carry your details through.", ar: "أسئلة قليلة تتشكل حسب إجاباتك. سنخبرك بالتذكرة أو المقعد أو الشراكة الأنسب لك، ونكمل ببياناتك." })} />
          <div className="apb-paths">
            {APPLY_PATHS.map((p, i) => (
              <Link key={p.id} href={`${page(locale, "apply")}?intent=${p.id}`} className="apb-path">
                <span className="u-tnum">0{i + 1}</span>{t(p.label)}
              </Link>
            ))}
          </div>
        </Glow>
      </Reveal>
    </Section>
  );
}

/* ── Passes & partners: featured in the centre ───────────── */

export function Passes() {
  const t = useT();
  const locale = useLocale();
  const order = [PASSES[0], PASSES[2], PASSES[1]];
  return (
    <Section id="passes">
      <SectionHead kicker={t({ en: "Passes", ar: "التذاكر" })} title={t(HOME.passesTitle)} lead={t({ en: "Choose the conference, the masterclass, or both together.", ar: "اختر المؤتمر، أو الماستر كلاس، أو الاثنين معًا." })} />
      <Stagger className="grid-3">
        {order.map((p) => (
          <Glow key={p.id} className={`card pass${p.featured ? " is-featured" : ""}`}>
            <span className="pass-name">{t(p.name)}</span>
            <span className={`pass-price${p.featured ? " gold-text" : ""}`}>{t(p.price)}</span>
            {p.note && <span className="pass-note">{t(p.note)}</span>}
            {p.id === "masterclass" && <span className="tag">{t(UI.provisional)}</span>}
            <ul>{p.points.map((x, i) => <li key={i}>{t(x)}</li>)}</ul>
            <Link href={`${page(locale, "register")}?pass=${p.id}`} className={`btn ${p.featured ? "btn-gold" : "btn-ghost"}`}>{t(UI.register)}</Link>
          </Glow>
        ))}
      </Stagger>
    </Section>
  );
}

export function Tiers({ link = true, head = true }: { link?: boolean; head?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const order = [TIERS[1], TIERS[0], TIERS[2]];
  return (
    <Section flush={!head}>
      {head
        ? <SectionHead kicker={t({ en: "Partners", ar: "الشركاء" })} title={t(HOME.partnersTitle)} lead={t(PARTNERS_FOR)}>
            {link && <Link href={page(locale, "partners")} className="link">{t(UI.becomePartner)} <Fwd /></Link>}
          </SectionHead>
        : <header className="sh"><p className="lead">{t(PARTNERS_FOR)}</p></header>}
      <Stagger className="grid-3">
        {order.map((tr) => (
          <Glow key={tr.id} className={`card tier${tr.id === "gold" ? " is-featured" : ""}`}>
            <h3 data-tier={tr.id}>{t(tr.name)}</h3>
            <ul>{tr.points.map((x, i) => <li key={i}>{t(x)}</li>)}</ul>
          </Glow>
        ))}
      </Stagger>
    </Section>
  );
}

/* ── Venue & final call ────────────────────────────────── */

export function Venue() {
  const t = useT();
  return (
    <Section>
      <SectionHead kicker={t(HOME.venueTitle)} title={t(EVENT.venue)} lead={t(HOME.venueBody)} />
      <Reveal className="venue-ph">
        <Parallax><img src={asset("/media/posters/hotel.webp")} alt={t(EVENT.venue)} loading="lazy" decoding="async" /></Parallax>
      </Reveal>
      <Reveal className="row-c venue-act">
        <a className="btn btn-ghost" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`} target="_blank" rel="noreferrer"><MapPin size={15} /> {t(UI.directions)}</a>
        <span className="btn btn-ghost" style={{ pointerEvents: "none" }}><CalendarDays size={15} /> {t(EVENT.date)}</span>
      </Reveal>
    </Section>
  );
}

export function Final() {
  const t = useT();
  const locale = useLocale();
  return (
    <Section>
      <Reveal className="final">
        <div className="final-film fm-frame" style={{ position: "relative" }}>
          <Film name={`sting-${locale}`} cover label={`DZAC 5 · ${t(EVENT.tagline)}`} />
        </div>
        <div className="final-copy">
          <h2 className="h2">{t(HOME.finalTitle)}</h2>
          <p>{t(HOME.finalBody)}</p>
          <div className="row-c">
            <Link href={page(locale, "register")} className="btn btn-primary btn-lg">{t(UI.registerNow)} <Fwd /></Link>
            <Link href={page(locale, "apply")} className="btn btn-ghost btn-lg">{t(UI.apply)}</Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── Inner page hero ───────────────────────────────────── */

export function PageHero({ kicker, title, lead, bg, children }: { kicker: string; title: string; lead?: string; bg?: string; children?: ReactNode }) {
  const k = (n: number) => ({ ["--k" as string]: n }) as CSSProperties;
  return (
    <section className="ph">
      {bg && <div className="ph-bg" aria-hidden><img src={bg} alt="" decoding="async" /></div>}
      <div className="wrap">
        <div className="ph-in hero-in">
          <p className="kicker" style={k(0)}>{kicker}</p>
          <h1 className="h1" style={k(1)}>{nb(title)}</h1>
          {lead && <p className="lead" style={k(2)}>{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
