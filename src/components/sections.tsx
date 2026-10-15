"use client";

/**
 * The sections the home page is built from; the inner pages reuse them.
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Activity, Apple, ArrowRight, ArrowUpRight, CalendarDays, Check, Cpu, Globe2, Leaf, MapPin, Mic, Play, Scissors, Stethoscope, Ticket,
  type LucideIcon,
} from "lucide-react";
import {
  BEYOND, BEYOND_LINE, EDITIONS, EVENT, FILMS, HOME, LEADERS, LOUNGE, MASTERCLASS, NEW, ORGANIZERS, PARTNERS_FOR, PASSES, PAST_FACULTY,
  PROGRAM_NOTE, REVIEW, TIERS, TRACKS, UI,
} from "@/content/site";
import { useLocale, useT } from "@/lib/locale";
import { CountUp, Item, Parallax, Reveal, ScrollText, Stagger } from "@/lib/motion";
import { asset, page, photo } from "@/lib/paths";
import { HeroReel, OrReel, STING_FRAMES, Sting, filmLength, type Clip } from "@/remotion/films";
import { FiveOutline } from "./brand";
import { Countdown } from "./chrome";
import { LiveFilm } from "./LiveFilm";
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
export const nb = (s: string) => s.replace(/DZAC (\d)/g, "DZAC\u00a0$1");

export function SectionHead({ kicker, title, lead, children }: { kicker?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="shead">
      <div className="shead-row">
        <div style={{ display: "grid", gap: 18 }}>
          {kicker && <Reveal y={10}><p className="kicker">{kicker}</p></Reveal>}
          <Reveal delay={0.05}><h2 className="h2">{nb(title)}</h2></Reveal>
        </div>
        {children}
      </div>
      {lead && <Reveal delay={0.1}><p className="lead">{lead}</p></Reveal>}
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────── */

/** The hero reel: DZAC 4 from the hotel to the group photo. No captions, the hero copy sits over it. */
function useHeroClips(): Clip[] {
  const v = (n: string) => asset(`/media/video/${n}.mp4`);
  return [
    /* Each slot is no longer than its clip, so no shot ever freezes on its last frame. */
    { src: v("r1-hotel"), frames: 52 }, { src: v("r2-registration"), frames: 58 }, { src: v("r3-hall"), frames: 106 },
    { src: v("r4-future"), frames: 86 }, { src: v("r5-podium"), frames: 116 }, { src: v("r6-awards"), frames: 116 },
    { src: v("r7-or"), frames: 72 }, { src: v("r8-audience"), frames: 82 }, { src: v("r9-group"), frames: 118 },
  ];
}

export function Hero() {
  const t = useT();
  const locale = useLocale();
  const clips = useHeroClips();
  const open = useLightbox();
  const film = FILMS[0];
  return (
    <section className="hero">
      <div className="hero-film">
        <LiveFilm component={HeroReel} cover
          inputProps={{ clips, rtl: locale === "ar" }}
          width={1920} height={1080} frames={filmLength(clips)} poster={asset("/media/posters/dzac4-film.webp")}
          label={t({ en: "Highlights from DZAC 4", ar: "لقطات من DZAC 4" })} />
      </div>
      <div className="hero-shade" aria-hidden />
      <div className="wrap hero-in">
        <motion.div className="hero-kick" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <span className="pill">{t(EVENT.full)}</span>
          <span className="pill">{t(EVENT.edition)}</span>
        </motion.div>
        <h1 className="hero-title">
          <span className="wm" dir="ltr">
            <motion.span className="wm-dzac" initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>DZAC</motion.span>
            <FiveOutline className="wm-five five-draw" />
          </span>
          <span className="sr-only">DZAC 5</span>
        </h1>
        <motion.p className="hero-tag" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}>{t(EVENT.tagline)}</motion.p>
        <motion.div className="hero-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7 }}>
          <div style={{ display: "grid", gap: 20 }}>
            <p className="hero-meta">
              <span><CalendarDays size={17} />{t(EVENT.date)}</span>
              <span><MapPin size={17} />{t(EVENT.venue)}</span>
            </p>
            <div className="hero-cta">
              <Link href={page(locale, "register")} className="btn btn-primary btn-lg">{t(UI.registerNow)} <Fwd /></Link>
              {film.kind === "file" && (
                <button type="button" className="btn btn-ghost btn-lg" onClick={() => open({ kind: "file", src: asset(film.src), poster: asset(film.poster), title: t(film.title) })}>
                  <Play size={16} /> {t(UI.watch)}
                </button>
              )}
            </div>
          </div>
          <Countdown />
        </motion.div>
      </div>
      <div className="hero-scroll" aria-hidden><span>{t(UI.scroll)}</span><i /></div>
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
          <span key={k}>{words.map((w, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 28 }}>{w}<b /></span>)}</span>
        ))}
      </div>
    </div>
  );
}

export function Statement() {
  const t = useT();
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal y={10}><p className="kicker" style={{ marginBottom: 28 }}>{t({ en: "DZAC since its first edition", ar: "DZAC منذ نسخته الأولى" })}</p></Reveal>
        <ScrollText className="statement" text={t(HOME.statement)} />
      </div>
    </section>
  );
}

/* ── What's new ────────────────────────────────────────── */

export function WhatsNew() {
  const t = useT();
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SectionHead kicker={t(EVENT.edition)} title={t(HOME.newTitle)} />
        <Stagger className="news" each={0.1}>
          {NEW.map((n, i) => {
            const I = ICONS[n.icon] ?? Globe2;
            return (
              <Item key={i}>
                <Glow className="news-card" style={{ height: "100%" }}>
                  <span className="news-n u-tnum">0{i + 1}</span>
                  <span className="news-i"><I size={24} /></span>
                  <h3>{t(n.title)}</h3>
                  <p>{t(n.body)}</p>
                </Glow>
              </Item>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ── Program ───────────────────────────────────────────── */

export function Tracks({ link = true }: { link?: boolean }) {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead kicker={t({ en: "Scientific program", ar: "البرنامج العلمي" })} title={t(HOME.programTitle)} lead={t(PROGRAM_NOTE)}>
          {link && <Reveal><Link href={page(locale, "program")} className="link">{t(UI.seeProgram)} <Fwd /></Link></Reveal>}
        </SectionHead>
        <Stagger as="ol" className="tracks" each={0.07}>
          {TRACKS.map((tr) => (
            <Item as="li" key={tr.n} className="track">
              <span className="track-n u-tnum">{tr.n}</span>
              <h3>{t(tr.title)}</h3>
              <p>{t(tr.body)}</p>
              <ArrowUpRight className="track-arrow" size={22} />
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** Five panels that scroll sideways while the section is pinned (desktop). */
export function Beyond() {
  const t = useT();
  const locale = useLocale();
  const reduce = useReducedMotion();
  const sec = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const measure = () => {
      const w = window.matchMedia("(min-width: 861px)").matches && !reduce;
      setWide(w);
      const r = row.current;
      setDist(w && r ? Math.max(0, r.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: sec, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(p, [0, 1], [0, (locale === "ar" ? 1 : -1) * dist]);

  return (
    <section ref={sec} className="bx" style={{ height: wide ? `calc(100svh + ${dist}px)` : undefined }}>
      <div className="bx-sticky">
        <div className="bx-head">
          <p className="kicker" style={{ marginBottom: 18 }}>{t({ en: "New in DZAC 5", ar: "جديد DZAC 5" })}</p>
          <div className="shead-row">
            <h2 className="h2">{t(HOME.beyondTitle)}</h2>
            <p className="lead" style={{ maxWidth: "40ch" }}>{t(BEYOND_LINE)}</p>
          </div>
        </div>
        <motion.div ref={row} className="bx-row" style={{ x: wide ? x : 0 }}>
          {BEYOND.map((b, i) => {
            const I = ICONS[b.icon] ?? Leaf;
            return (
              <article key={i} className="bx-card">
                <span className="bx-big" aria-hidden>{i + 1}</span>
                <span className="bx-i"><I size={30} /></span>
                <div>
                  <h3>{t(b.title)}</h3>
                  <p>{t(b.body)}</p>
                </div>
              </article>
            );
          })}
        </motion.div>
        <div className="bx-progress" aria-hidden><motion.i style={{ scaleX: p }} /></div>
      </div>
    </section>
  );
}

/* ── Masterclass ───────────────────────────────────────── */

export function Masterclass({ link = true }: { link?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const v = (n: string) => asset(`/media/video/${n}.mp4`);
  const clips: Clip[] = [
    { src: v("m2-or"), frames: 88, caption: t({ en: "Peno-scrotal approach", ar: "المدخل الصفني القضيبي" }) },
    { src: v("m3-or"), frames: 72, caption: t({ en: "Infrapubic approach", ar: "المدخل فوق العانة" }) },
    { src: v("m1-or"), frames: 58, caption: t({ en: "Scrub-in for all participants", ar: "دخول غرفة العمليات للجميع" }) },
    { src: v("m4-team"), frames: 62, caption: t({ en: "International faculty", ar: "محاضرون دوليون" }) },
  ];
  return (
    <section className="sec mc">
      <div className="wrap mc-grid">
        <Reveal y={30} className="mc-film">
          <LiveFilm component={OrReel} inputProps={{ clips, rtl: locale === "ar", live: "LIVE · OR 1" }} width={1080} height={1350}
            frames={filmLength(clips, 14)} poster={asset("/media/posters/masterclass-film.webp")}
            label={t({ en: "The masterclass operating room, as a live feed", ar: "غرفة عمليات الماستر كلاس كبث مباشر" })} />
        </Reveal>
        <div className="mc-copy">
          <Reveal y={10}><p className="kicker">{t(MASTERCLASS.kicker)}</p></Reveal>
          <Reveal delay={0.05}><h2 className="h2">{t(MASTERCLASS.title)}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{t(MASTERCLASS.approach)}</p></Reveal>
          <Reveal delay={0.15} className="mc-count">
            <b className="gold-text"><CountUp to={MASTERCLASS.count} /></b>
            <span>{t(MASTERCLASS.countLabel)}<br /><span style={{ color: "var(--gold2)" }}>{t(MASTERCLASS.scrub)}</span></span>
          </Reveal>
          <Stagger as="ul" className="mc-list">
            {MASTERCLASS.points.map((x, i) => <Item as="li" key={i}><Check size={17} />{t(x)}</Item>)}
          </Stagger>
          <Reveal className="mc-fee">
            <b>{MASTERCLASS.fee}</b>
            <small>{t(UI.provisional)}</small>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>{t(UI.limited)}</span>
          </Reveal>
          <Reveal style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={`${page(locale, "apply")}?intent=masterclass`} className="btn btn-gold btn-lg">{t({ en: "Apply for a seat", ar: "قدّم على مقعد" })} <Fwd /></Link>
            {link && <Link href={page(locale, "masterclass")} className="btn btn-ghost btn-lg">{t(UI.learnMore)}</Link>}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Faculty ───────────────────────────────────────────── */

const initials = (s: string) => s.replace(/^(Prof\.|Dr\.|Prof\. Dr\.)\s*/g, "").replace(/^(Prof\.|Dr\.)\s*/g, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");

export function Faculty({ past = true, head = true }: { past?: boolean; head?: boolean }) {
  const t = useT();
  return (
    <section className="sec">
      <div className="wrap">
        {head && <SectionHead kicker={t({ en: "Faculty", ar: "المحاضرون" })} title={t(HOME.facultyTitle)} />}
        <Stagger className="leaders" each={0.1}>
          {LEADERS.map((l, i) => (
            <Item key={i}>
              <Glow className="leader" as="article" style={{ height: "100%" }}>
                <div className="leader-ph">
                  {l.photo ? <img src={asset(l.photo)} alt={t(l.name)} loading="lazy" /> : <span className="leader-init" aria-hidden>{initials(l.name.en)}</span>}
                </div>
                <div className="leader-tx">
                  <small>{t(l.role)}</small>
                  <b>{t(l.name)}</b>
                </div>
              </Glow>
            </Item>
          ))}
        </Stagger>
        <Reveal className="orgs">
          {ORGANIZERS.map((o, i) => (
            <div key={i} className="org"><small>{t(o.role)}</small><b>{t(o.name)}</b></div>
          ))}
        </Reveal>
        {past && (
          <>
            <Reveal><p className="kicker" style={{ marginTop: 56 }}>{t(HOME.pastFaculty)}</p></Reveal>
            <Stagger as="ul" className="past" each={0.04}>
              {PAST_FACULTY.map((p, i) => <Item as="li" key={i}><b>{t(p.name)}</b><small>{t(p.from)}</small></Item>)}
            </Stagger>
          </>
        )}
      </div>
    </section>
  );
}

/* ── DZAC 4 in review ──────────────────────────────────── */

export function Review() {
  const t = useT();
  const locale = useLocale();
  const shots = [["1721", "rv-a"], ["1233", "rv-b"], ["1585", "rv-c"], ["1481", "rv-d"], ["2025", "rv-e"]] as const;
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead kicker="DZAC 4" title={t(HOME.reviewTitle)}>
          <Reveal><Link href={page(locale, "gallery")} className="link">{t(UI.allPhotos)} <Fwd /></Link></Reveal>
        </SectionHead>
        <div className="rv-grid">
          {shots.map(([id, cls], i) => (
            <Reveal key={id} delay={i * 0.06} className={`rv-ph ${cls}`}>
              <Parallax amount={i % 2 ? 18 : 30} style={{ height: "112%", marginTop: "-6%" }}>
                <img src={photo(id, i < 2 ? "lg" : "sm")} alt="" loading="lazy" />
              </Parallax>
            </Reveal>
          ))}
        </div>
        <Stagger className="rv-stats" each={0.1}>
          {REVIEW.stats.map((s, i) => (
            <Item key={i} className="rv-stat"><b className="grad-text">{s.v}</b><span>{t(s.l)}</span></Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ── Editions ──────────────────────────────────────────── */

export function Editions() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const s = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead kicker={t({ en: "Since the first edition", ar: "منذ النسخة الأولى" })} title={t(HOME.editionsTitle)} />
        <div ref={ref} className="ed">
          <motion.div className="ed-line" aria-hidden style={{ ["--p" as string]: s }}><i /></motion.div>
          {EDITIONS.map((e) => (
            <Reveal key={e.n} className={`ed-item${e.n === 5 ? " is-now" : ""}`} delay={e.n * 0.06}>
              <span className="ed-dot" aria-hidden />
              <span className="ed-n">DZAC {e.n}</span>
              <span className="ed-when">{t(e.when)}</span>
              <b>{t(e.theme)}</b>
              <p>{t(e.where)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Men's Lounge ──────────────────────────────────────── */

export function Lounge() {
  const t = useT();
  const open = useLightbox();
  return (
    <section className="sec">
      <div className="wrap lounge">
        <div style={{ display: "grid", gap: 20 }}>
          <Reveal y={10}><p className="kicker">{t({ en: "Video series", ar: "سلسلة فيديو" })}</p></Reveal>
          <Reveal><h2 className="h2">{t(HOME.loungeTitle)}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{t(HOME.loungeBody)}</p></Reveal>
        </div>
        <Reveal className="reels">
          {LOUNGE.map((r, i) => (
            <button key={r.id} type="button" className="reel" onClick={() => open({ kind: "drive", id: r.id, title: `DZAC 4 · ${i + 1}`, vertical: true })}
              aria-label={t({ en: `Play interview ${i + 1}`, ar: `تشغيل اللقاء ${i + 1}` })}>
              <img src={asset(`/media/lounge/${r.img}.webp`)} alt="" loading="lazy" />
              <span className="reel-play"><Play size={16} /></span>
            </button>
          ))}
        </Reveal>
      </div>
    </section>
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
    <section className="sec-tight">
      <div className="wrap">
        <Reveal y={30}>
          <Glow className="apb">
            <div className="apb-copy">
              <p className="kicker">{t({ en: "Apply · about a minute", ar: "التقديم · حوالي دقيقة" })}</p>
              <h2 className="h2">{t({ en: "Not sure where you fit?", ar: "لست متأكدًا أين مكانك؟" })} <em>{t({ en: "Apply.", ar: "قدّم." })}</em></h2>
              <p className="lead">{t({ en: "A few questions, shaped by your answers. We'll tell you which pass, seat or partnership suits you, and carry your details through.", ar: "أسئلة قليلة تتشكل حسب إجاباتك. سنخبرك بالتذكرة أو المقعد أو الشراكة الأنسب لك، ونكمل ببياناتك." })}</p>
            </div>
            <div className="apb-paths">
              {APPLY_PATHS.map((p, i) => (
                <Link key={p.id} href={`${page(locale, "apply")}?intent=${p.id}`} className="apb-path">
                  <span className="u-tnum">0{i + 1}</span>{t(p.label)}<Fwd size={15} />
                </Link>
              ))}
            </div>
          </Glow>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Passes & partners ─────────────────────────────────── */

export function Passes() {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="sec" id="passes">
      <div className="wrap">
        <SectionHead kicker={t({ en: "Passes", ar: "التذاكر" })} title={t(HOME.passesTitle)} lead={t({ en: "Choose the conference, the masterclass, or both together.", ar: "اختر المؤتمر، أو الماستر كلاس، أو الاثنين معًا." })} />
        <Stagger className="passes" each={0.1}>
          {PASSES.map((p) => (
            <Item key={p.id}>
              <Glow className={`pass${p.featured ? " is-featured" : ""}`} style={{ height: "100%" }}>
                <span className="pass-name">{t(p.name)}</span>
                <span className={`pass-price${p.featured ? " gold-text" : ""}`}>{t(p.price)}</span>
                {p.note && <span className="pass-note">{t(p.note)}</span>}
                {p.id === "masterclass" && <span className="tag">{t(UI.provisional)}</span>}
                <ul>{p.points.map((x, i) => <li key={i}><Check size={16} />{t(x)}</li>)}</ul>
                <Link href={`${page(locale, "register")}?pass=${p.id}`} className={`btn ${p.featured ? "btn-gold" : "btn-ghost"}`}>{t(UI.register)} <Fwd /></Link>
              </Glow>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Tiers({ link = true, head = true }: { link?: boolean; head?: boolean }) {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="sec">
      <div className="wrap">
        {head ? (
          <SectionHead kicker={t({ en: "Partners", ar: "الشركاء" })} title={t(HOME.partnersTitle)} lead={t(PARTNERS_FOR)}>
            {link && <Reveal><Link href={page(locale, "partners")} className="link">{t(UI.becomePartner)} <Fwd /></Link></Reveal>}
          </SectionHead>
        ) : <Reveal><p className="lead" style={{ marginBottom: 36 }}>{t(PARTNERS_FOR)}</p></Reveal>}
        <Stagger className="tiers" each={0.1}>
          {TIERS.map((tr) => (
            <Item key={tr.id}>
              <Glow className="tier" style={{ height: "100%" }}>
                <h3 data-tier={tr.id}>{t(tr.name)}</h3>
                <ul>{tr.points.map((x, i) => <li key={i}>{t(x)}</li>)}</ul>
              </Glow>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ── Venue & final call ────────────────────────────────── */

export function Venue() {
  const t = useT();
  return (
    <section className="sec">
      <div className="wrap venue">
        <Reveal className="venue-ph" y={30}>
          <Parallax amount={24} style={{ height: "114%", marginTop: "-7%" }}><img src={asset("/media/posters/hotel.webp")} alt={t(EVENT.venue)} loading="lazy" /></Parallax>
        </Reveal>
        <div className="venue-copy">
          <Reveal y={10}><p className="kicker">{t(HOME.venueTitle)}</p></Reveal>
          <Reveal><h2 className="h2">{t(EVENT.venue)}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{t(HOME.venueBody)}</p></Reveal>
          <Reveal delay={0.15} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn btn-ghost" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`} target="_blank" rel="noreferrer"><MapPin size={16} /> {t(UI.directions)}</a>
            <span className="btn btn-ghost" style={{ pointerEvents: "none" }}><CalendarDays size={16} /> {t(EVENT.date)}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Final() {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="final" y={40}>
          <div className="final-film">
            <LiveFilm component={Sting} inputProps={{ tagline: t(EVENT.tagline), date: t(EVENT.date), rtl: locale === "ar" }}
              width={1920} height={900} frames={STING_FRAMES} label={`DZAC 5 · ${t(EVENT.tagline)}`} />
          </div>
          <div className="final-copy">
            <div style={{ display: "grid", gap: 10 }}>
              <h2 className="h2">{t(HOME.finalTitle)}</h2>
              <p>{t(HOME.finalBody)}</p>
            </div>
            <Link href={page(locale, "register")} className="btn btn-primary btn-lg">{t(UI.registerNow)} <Fwd /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Inner page hero ───────────────────────────────────── */

export function PageHero({ kicker, title, lead, bg, children }: { kicker: string; title: string; lead?: string; bg?: string; children?: ReactNode }) {
  return (
    <section className="ph">
      {bg && <div className="ph-bg" aria-hidden><img src={bg} alt="" /></div>}
      <div className="wrap ph-in">
        <motion.p className="kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>{kicker}</motion.p>
        <motion.h1 className="h1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>{nb(title)}</motion.h1>
        {lead && <motion.p className="lead" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>{lead}</motion.p>}
        {children}
      </div>
    </section>
  );
}
