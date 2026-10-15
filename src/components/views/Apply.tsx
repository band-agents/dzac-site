"use client";

/**
 * The application form.
 *
 * One question at a time. The steps are rebuilt from the answers so far, so
 * a consultant urologist, a medical student and a pharma company each see a
 * different form. Beside it, a live summary: what you've told us, how long is
 * left, and what DZAC would recommend for you, updating with every answer.
 *
 * Smart touches: choices advance on their own; number keys pick an option and
 * Enter continues; the specialty list filters as you type; the country fills
 * in its dialling code; a likely email typo is offered a fix; the draft saves
 * itself and offers to resume; the result hands its answers to registration or
 * the abstract form on the device, never in the URL.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Camera, Check, CornerDownLeft, Gem, Info, Mic, Pencil, RotateCcw, Search, Sparkles, Stethoscope, Ticket,
  type LucideIcon,
} from "lucide-react";
import {
  APPROACHES, AUDIENCE, COUNTRIES, COVERAGE, FORMATS, GOALS, IMPLANTS, INTENTS, INTERESTS, ORG_TYPES, OUTLETS, PRESENCE, Q, ROLES,
  SPECIALTIES, SURGICAL, TRACK_OPTIONS, YEARS, YESNO, type Intent, type Option,
} from "@/content/apply";
import { UI, type L } from "@/content/site";
import { useLocale, useT } from "@/lib/locale";
import { page } from "@/lib/paths";
import { emailSuggestion, isEmail, isPhone, loadDraft, saveApplication, saveDraft, setPrefill, type Answers } from "@/lib/store";

const ICONS: Record<string, LucideIcon> = { Ticket, Stethoscope, Mic, Gem, Camera };

/* ── Steps ─────────────────────────────────────────────── */

type Step =
  | { id: string; kind: "choice"; title: L; hint?: L; options: Option[]; wide?: boolean }
  | { id: string; kind: "multi"; title: L; hint?: L; options: Option[]; min: number }
  | { id: string; kind: "search"; title: L; options: Option[] }
  | { id: string; kind: "text"; title: L; hint?: L }
  | { id: string; kind: "pitch"; title: L }
  | { id: string; kind: "outlet"; title: L }
  | { id: string; kind: "details"; title: L }
  | { id: string; kind: "review"; title: L };

const str = (a: Answers, k: string) => (typeof a[k] === "string" ? (a[k] as string) : "");
const arr = (a: Answers, k: string) => (Array.isArray(a[k]) ? (a[k] as string[]) : []);
const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

function buildSteps(a: Answers): Step[] {
  const steps: Step[] = [{ id: "intent", kind: "choice", title: Q.intent, options: INTENTS, wide: true }];
  const intent = str(a, "intent") as Intent | "";
  if (!intent) return steps;
  if (intent === "attend") {
    steps.push({ id: "role", kind: "choice", title: Q.role, options: ROLES });
    steps.push({ id: "specialty", kind: "search", title: Q.specialty, options: SPECIALTIES });
    steps.push({ id: "interests", kind: "multi", title: Q.interests, hint: Q.interestsHint, options: INTERESTS, min: 1 });
    if (str(a, "role") === "specialist" && SURGICAL.includes(str(a, "specialty")))
      steps.push({ id: "masterclassToo", kind: "choice", title: Q.masterclassToo, options: YESNO });
  }
  if (intent === "masterclass") {
    steps.push({ id: "specialty", kind: "search", title: Q.specialty, options: SPECIALTIES });
    if (!str(a, "specialty") || SURGICAL.includes(str(a, "specialty"))) {
      steps.push({ id: "years", kind: "choice", title: Q.years, options: YEARS });
      steps.push({ id: "implants", kind: "choice", title: Q.implants, options: IMPLANTS });
      steps.push({ id: "approach", kind: "choice", title: Q.approach, options: APPROACHES });
      steps.push({ id: "goal", kind: "text", title: Q.goal, hint: Q.goalHint });
    }
  }
  if (intent === "speak") {
    steps.push({ id: "track", kind: "choice", title: Q.track, options: TRACK_OPTIONS });
    steps.push({ id: "format", kind: "choice", title: Q.format, options: FORMATS });
    steps.push({ id: "pitch", kind: "pitch", title: Q.pitch });
  }
  if (intent === "partner") {
    steps.push({ id: "orgType", kind: "choice", title: Q.orgType, options: ORG_TYPES });
    steps.push({ id: "goals", kind: "multi", title: Q.goals, options: GOALS, min: 1 });
    steps.push({ id: "presence", kind: "choice", title: Q.presence, options: PRESENCE });
  }
  if (intent === "media") {
    steps.push({ id: "outlet", kind: "choice", title: Q.outlet, options: OUTLETS });
    steps.push({ id: "outletName", kind: "outlet", title: Q.audience });
    steps.push({ id: "coverage", kind: "multi", title: Q.coverage, options: COVERAGE, min: 1 });
  }
  steps.push({ id: "details", kind: "details", title: Q.details });
  steps.push({ id: "review", kind: "review", title: Q.review });
  return steps;
}

const isOrg = (a: Answers) => str(a, "intent") === "partner";
const needsInstitution = (a: Answers) => ["attend", "masterclass", "speak"].includes(str(a, "intent"));

function detailsErrors(a: Answers) {
  return {
    name: str(a, "name").trim().length < 3,
    company: isOrg(a) && str(a, "company").trim().length < 2,
    email: !isEmail(str(a, "email")),
    country: !str(a, "country"),
    phone: !isPhone(str(a, "phone")),
    institution: needsInstitution(a) && str(a, "institution").trim().length < 2,
  };
}

function isValid(step: Step, a: Answers): boolean {
  switch (step.kind) {
    case "choice": case "search": return !!str(a, step.id);
    case "multi": return arr(a, step.id).length >= step.min;
    case "text": return true;
    case "pitch": return str(a, "title").trim().length >= 6 && words(str(a, "summary")) >= 15 && words(str(a, "summary")) <= 150;
    case "outlet": return str(a, "outletName").trim().length >= 2 && !!str(a, "audience");
    case "details": return !Object.values(detailsErrors(a)).some(Boolean);
    case "review": return str(a, "consent") === "yes";
  }
}

/* ── What DZAC recommends ──────────────────────────────── */

type Outcome = { tag: L; title: L; reasons: L[]; tone: "lux" | "cyan" | "quiet" };

function outcome(a: Answers): Outcome | null {
  const intent = str(a, "intent");
  const spec = str(a, "specialty");
  if (intent === "attend") {
    const role = str(a, "role");
    if (!role) return null;
    if (role === "student") return { tone: "cyan", tag: { en: "Your pass", ar: "تذكرتك" }, title: { en: "Conference · student rate", ar: "المؤتمر · سعر الطلاب" }, reasons: [{ en: "The full scientific program at the student rate.", ar: "البرنامج العلمي كاملًا بسعر الطلاب." }, { en: "Bring a valid student ID to the door.", ar: "أحضر كارنيه طالب ساريًا عند الدخول." }] };
    if (role === "resident") return { tone: "cyan", tag: { en: "Your pass", ar: "تذكرتك" }, title: { en: "Conference · resident rate", ar: "المؤتمر · سعر المقيمين" }, reasons: [{ en: "All six tracks and the Beyond andrology sessions.", ar: "المسارات الستة وجلسات ما بعد الذكورة." }, { en: "Early-bird pricing opens first to applicants.", ar: "أسعار الحجز المبكر تبدأ أولًا للمتقدمين." }] };
    const mc = str(a, "masterclassToo");
    if (mc === "yes" || mc === "maybe") return { tone: "lux", tag: { en: "Best fit", ar: "الأنسب لك" }, title: { en: "The Bundle: conference + masterclass", ar: "الباقة: المؤتمر + الماستر كلاس" }, reasons: [{ en: "You'd like live surgery as well as the program.", ar: "تريد الجراحات الحية إلى جانب البرنامج." }, { en: "One combined, discounted fee.", ar: "رسوم واحدة مجمّعة ومخفّضة." }, { en: "Certificate, dinner and priority for DZAC 6.", ar: "شهادة وعشاء وأولوية في DZAC 6." }] };
    return { tone: "cyan", tag: { en: "Your pass", ar: "تذكرتك" }, title: { en: "Conference · specialist", ar: "المؤتمر · أخصائي واستشاري" }, reasons: [{ en: "The full scientific program and the exhibition.", ar: "البرنامج العلمي كاملًا والمعرض." }, ...(SURGICAL.includes(spec) ? [{ en: "The masterclass can be added later while seats last.", ar: "يمكن إضافة الماستر كلاس لاحقًا ما دامت المقاعد متاحة." }] : [])] };
  }
  if (intent === "masterclass") {
    if (!spec) return null;
    if (!SURGICAL.includes(spec)) return { tone: "quiet", tag: { en: "Our suggestion", ar: "اقتراحنا" }, title: { en: "The conference, not the masterclass", ar: "المؤتمر وليس الماستر كلاس" }, reasons: [{ en: "The masterclass is for urologists and andrologists.", ar: "الماستر كلاس لأطباء المسالك البولية والذكورة." }, { en: "Your specialty is well served by the program's tracks.", ar: "تخصصك تخدمه مسارات البرنامج جيدًا." }] };
    const imp = str(a, "implants"), yrs = str(a, "years");
    if (!imp) return { tone: "lux", tag: { en: "Eligible", ar: "مؤهَّل" }, title: { en: "A seat in the masterclass", ar: "مقعد في الماستر كلاس" }, reasons: [{ en: "Your specialty qualifies for the hands-on masterclass.", ar: "تخصصك مؤهَّل للماستر كلاس العملي." }] };
    const senior = imp === "50+" || imp === "11-50" || yrs === "10-20" || yrs === "20+";
    return {
      tone: "lux",
      tag: senior ? { en: "Priority review", ar: "مراجعة ذات أولوية" } : { en: "Eligible", ar: "مؤهَّل" },
      title: senior ? { en: "Strong fit for the masterclass", ar: "مناسب جدًا للماستر كلاس" } : { en: "A seat in the masterclass", ar: "مقعد في الماستر كلاس" },
      reasons: [
        imp === "0" ? { en: "A first hands-on step, with scrub-in for every participant.", ar: "خطوة عملية أولى، مع دخول غرفة العمليات لكل مشارك." } : { en: "Your implant experience lets you get the most from live cases.", ar: "خبرتك في الزراعة تتيح لك الاستفادة القصوى من الحالات الحية." },
        ...(str(a, "approach") ? [{ en: `Cases cover the ${str(a, "approach") === "both" ? "peno-scrotal and infrapubic approaches" : str(a, "approach") === "infrapubic" ? "infrapubic approach" : "peno-scrotal approach"} you chose.`, ar: "الحالات تغطي المدخل الجراحي الذي اخترته." }] : []),
        { en: "Seats are limited; the faculty reviews every application.", ar: "المقاعد محدودة، ويراجع المحاضرون كل طلب." },
      ],
    };
  }
  if (intent === "speak") {
    if (!str(a, "track")) return null;
    return { tone: "cyan", tag: { en: "Next step", ar: "الخطوة التالية" }, title: { en: "A full abstract for the committee", ar: "ملخص كامل للجنة العلمية" }, reasons: [{ en: "Your pitch carries over to the abstract form.", ar: "ما كتبته ينتقل إلى نموذج الملخص." }, { en: "Up to 300 words: background, methods, results, conclusion.", ar: "حتى 300 كلمة: الخلفية والطريقة والنتائج والخلاصة." }] };
  }
  if (intent === "partner") {
    const org = str(a, "orgType");
    if (!org) return null;
    const goals = arr(a, "goals");
    const gold = goals.includes("stage") || goals.includes("screen") || str(a, "presence") === "flagship";
    const academic = org === "university" && !gold;
    const tier = gold ? { en: "Gold", ar: "الذهبية" } : academic ? { en: "Academic", ar: "الأكاديمية" } : { en: "Silver", ar: "الفضية" };
    const why: L[] = [];
    if (goals.includes("stage")) why.push({ en: "A stage talk is part of Gold.", ar: "الكلمة على المنصة ضمن الفئة الذهبية." });
    if (goals.includes("screen")) why.push({ en: "Screen videos come with Gold.", ar: "فيديو الشاشات ضمن الفئة الذهبية." });
    if (goals.includes("booth")) why.push(gold ? { en: "Gold includes the large booth.", ar: "الذهبية تشمل الجناح الكبير." } : { en: "A standard booth is included.", ar: "يشمل جناحًا قياسيًا." });
    if (academic) why.push({ en: "Discounted space, a poster area and student recruitment.", ar: "مساحة مخفّضة ومساحة للبوسترات واستقطاب الطلاب." });
    if (!why.length) why.push({ en: "Logo placement and a social media mention.", ar: "ظهور الشعار وإشارة على السوشيال ميديا." });
    return { tone: gold ? "lux" : "cyan", tag: { en: "Suggested tier", ar: "الفئة المقترحة" }, title: { en: `${tier.en} partner`, ar: `الشراكة ${tier.ar}` }, reasons: why };
  }
  if (intent === "media") {
    if (!str(a, "outlet")) return null;
    return { tone: "cyan", tag: { en: "Request", ar: "الطلب" }, title: { en: "Press accreditation", ar: "اعتماد صحفي" }, reasons: [{ en: "Access for your crew on the day, by name.", ar: "دخول فريقك يوم المؤتمر بالاسم." }, ...(arr(a, "coverage").includes("interviews") ? [{ en: "Interview requests go to the faculty in advance.", ar: "طلبات اللقاءات تُرسل للمحاضرين مسبقًا." }] : [])] };
  }
  return null;
}

/* ── Labels for the summary ────────────────────────────── */

const OPTS: Record<string, Option[]> = {
  intent: INTENTS, role: ROLES, specialty: SPECIALTIES, interests: INTERESTS, masterclassToo: YESNO, years: YEARS, implants: IMPLANTS,
  approach: APPROACHES, track: TRACK_OPTIONS, format: FORMATS, orgType: ORG_TYPES, goals: GOALS, presence: PRESENCE, outlet: OUTLETS,
  audience: AUDIENCE, coverage: COVERAGE, country: COUNTRIES.map((c) => ({ id: c.id, label: c.label })),
};
const SHORT: Record<string, L> = {
  intent: { en: "Applying for", ar: "التقديم على" }, role: { en: "Career", ar: "المرحلة" }, specialty: { en: "Specialty", ar: "التخصص" },
  interests: { en: "Sessions", ar: "الجلسات" }, masterclassToo: { en: "Masterclass", ar: "الماستر كلاس" }, years: { en: "Experience", ar: "الخبرة" },
  implants: { en: "Implants", ar: "عمليات الزراعة" }, approach: { en: "Approach", ar: "المدخل" }, goal: { en: "Goal", ar: "الهدف" },
  track: { en: "Track", ar: "المسار" }, format: { en: "Format", ar: "طريقة العرض" }, title: { en: "Title", ar: "العنوان" },
  orgType: { en: "Organisation", ar: "الجهة" }, goals: { en: "Goals", ar: "الأهداف" }, presence: { en: "Presence", ar: "الحضور" },
  outlet: { en: "Outlet", ar: "الجهة الإعلامية" }, outletName: { en: "Name", ar: "الاسم" }, audience: { en: "Audience", ar: "الجمهور" },
  coverage: { en: "Coverage", ar: "التغطية" }, company: { en: "Company", ar: "الشركة" }, name: { en: "Name", ar: "الاسم" },
  email: { en: "Email", ar: "البريد" }, country: { en: "Country", ar: "الدولة" }, phone: { en: "Mobile", ar: "الموبايل" },
  institution: { en: "Institution", ar: "جهة العمل" },
};
const ORDER = ["intent", "role", "specialty", "interests", "masterclassToo", "years", "implants", "approach", "goal", "track", "format", "title", "orgType", "goals", "presence", "outlet", "outletName", "audience", "coverage", "company", "name", "email", "country", "phone", "institution"];
const STEP_OF: Record<string, string> = { title: "pitch", outletName: "outletName", audience: "outletName", company: "details", name: "details", email: "details", country: "details", phone: "details", institution: "details" };

function display(t: (x: L) => string, key: string, v: string | string[]): string {
  const opts = OPTS[key];
  const one = (id: string) => (opts ? (opts.find((o) => o.id === id) ? t(opts.find((o) => o.id === id)!.label) : id) : id);
  return Array.isArray(v) ? v.map(one).join(" · ") : one(v);
}

/* ── The form ──────────────────────────────────────────── */

export function ApplyView() {
  const t = useT();
  const locale = useLocale();
  const params = useSearchParams();
  const [a, setA] = useState<Answers>({});
  const [i, setI] = useState(0);
  const [tried, setTried] = useState(false);
  const [resume, setResume] = useState<{ answers: Answers; step: number } | null>(null);
  const [code, setCode] = useState("");
  const [query, setQuery] = useState("");
  const ready = useRef(false);

  const steps = useMemo(() => buildSteps(a), [a]);
  const step = steps[Math.min(i, steps.length - 1)];
  const valid = isValid(step, a);
  const result = outcome(a);

  /* Start: a preset intent from the link, or an offer to resume a saved draft. */
  useEffect(() => {
    const preset = params.get("intent");
    const draft = loadDraft();
    if (preset && INTENTS.some((x) => x.id === preset)) { setA({ intent: preset }); setI(1); }
    else if (draft && draft.answers?.intent) setResume(draft);
    ready.current = true;
  }, [params]);

  useEffect(() => { if (ready.current && !code && a.intent) saveDraft({ answers: a, step: i }); }, [a, i, code]);

  const set = useCallback((k: string, v: string | string[]) => setA((x) => {
    const n: Answers = { ...x, [k]: v };
    /* Changing what you're applying for clears the answers that belonged to the old path. */
    if (k === "intent" && x.intent !== v) for (const key of Object.keys(n)) if (!["intent", "name", "email", "phone", "country", "institution", "company"].includes(key)) delete n[key];
    return n;
  }), []);

  const next = useCallback(() => {
    if (!isValid(step, a)) { setTried(true); return; }
    setTried(false);
    if (step.kind === "review") {
      setCode(saveApplication(str(a, "intent"), a));
      saveDraft(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setQuery("");
    setI((n) => Math.min(n + 1, steps.length - 1));
  }, [step, a, steps.length]);
  const back = () => { setTried(false); setI((n) => Math.max(0, n - 1)); };

  /* Pick an option and move on, the way a person answers a question. */
  const choose = (k: string, v: string) => {
    set(k, v);
    const at = i;
    window.setTimeout(() => setI((n) => (n === at ? n + 1 : n)), 320);
  };

  /* Enter continues; number keys pick an option when you're not typing. */
  useEffect(() => {
    if (code) return;
    const on = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && (el as HTMLInputElement).type !== "checkbox") || el.tagName === "SELECT";
      if (e.key === "Enter" && el.tagName !== "TEXTAREA" && el.tagName !== "BUTTON" && step.kind !== "search") { e.preventDefault(); next(); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 9) {
        if (step.kind === "choice" && step.options[n - 1]) choose(step.id, step.options[n - 1].id);
        if (step.kind === "multi" && step.options[n - 1]) {
          const cur = arr(a, step.id), id = step.options[n - 1].id;
          set(step.id, cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
        }
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  });

  if (code) return <Result code={code} a={a} outcome={result} />;

  /* Until the path is chosen, estimate a typical length (seven steps) rather than claim one. */
  const total = a.intent ? steps.length : 7;
  const pct = Math.round((Math.min(i, total - 1) / Math.max(1, total - 1)) * 100);
  const left = Math.max(0, total - 1 - i) * 9;
  const Fwd = locale === "ar" ? ArrowLeft : ArrowRight;
  const Bk = locale === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="ap">
      <div className="ap-main panel">
        {resume && (
          <motion.div className="ap-resume" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <span><RotateCcw size={16} />{t({ en: "You have an application in progress.", ar: "لديك طلب لم يكتمل." })}</span>
            <span style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { setA(resume.answers); setI(resume.step); setResume(null); }}>{t({ en: "Continue", ar: "أكمل" })}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { saveDraft(null); setResume(null); }}>{t({ en: "Start over", ar: "ابدأ من جديد" })}</button>
            </span>
          </motion.div>
        )}
        <div className="ap-top">
          <span className="ap-count u-tnum">{String(Math.min(i, steps.length - 1) + 1).padStart(2, "0")} <i>/</i> {String(total).padStart(2, "0")}</span>
          <span className="ap-bar" aria-hidden><motion.i animate={{ scaleX: pct / 100 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} /></span>
        </div>

        <motion.div key={step.id} className="ap-step" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="q" id="ap-q">{t(step.title)}</h2>
          {"hint" in step && step.hint && <p className="ap-hint">{t(step.hint)}</p>}

          {step.kind === "choice" && (
            <div className={`ap-opts${step.wide ? " is-wide" : ""}`} role="radiogroup" aria-labelledby="ap-q">
              {step.options.map((o, n) => {
                const I = o.icon ? ICONS[o.icon] : null;
                const on = str(a, step.id) === o.id;
                return (
                  <button key={o.id} type="button" role="radio" aria-checked={on} className={`ap-opt${on ? " is-on" : ""}`} onClick={() => choose(step.id, o.id)}>
                    <kbd className="u-tnum">{n + 1}</kbd>
                    {I && <span className="ap-opt-i"><I size={20} /></span>}
                    <span className="ap-opt-t"><b>{t(o.label)}</b>{o.hint && <small>{t(o.hint)}</small>}</span>
                    {on && <Check size={18} className="ap-opt-check" />}
                  </button>
                );
              })}
            </div>
          )}

          {step.kind === "multi" && (
            <div className="ap-chips" role="group" aria-labelledby="ap-q">
              {step.options.map((o, n) => {
                const cur = arr(a, step.id), on = cur.includes(o.id);
                return (
                  <button key={o.id} type="button" aria-pressed={on} className={`ap-chip${on ? " is-on" : ""}`} onClick={() => set(step.id, on ? cur.filter((x) => x !== o.id) : [...cur, o.id])}>
                    {on ? <Check size={14} /> : <kbd className="u-tnum">{n + 1}</kbd>}{t(o.label)}
                  </button>
                );
              })}
            </div>
          )}

          {step.kind === "search" && (() => {
            const q = query.trim().toLowerCase();
            const list = step.options.filter((o) => !q || o.label.en.toLowerCase().includes(q) || o.label.ar.includes(query.trim()));
            return (
              <div style={{ display: "grid", gap: 16 }}>
                <label className="ap-search">
                  <Search size={17} />
                  <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t({ en: "Start typing, or choose below", ar: "ابدأ الكتابة أو اختر من القائمة" })}
                    onKeyDown={(e) => { if (e.key === "Enter" && list[0]) { e.preventDefault(); choose(step.id, list[0].id); } }} aria-label={t(step.title)} />
                </label>
                <div className="ap-chips">
                  {list.map((o) => {
                    const on = str(a, step.id) === o.id;
                    return <button key={o.id} type="button" aria-pressed={on} className={`ap-chip${on ? " is-on" : ""}`} onClick={() => choose(step.id, o.id)}>{on && <Check size={14} />}{t(o.label)}</button>;
                  })}
                  {!list.length && <span className="ap-hint">{t({ en: "No match. Choose “Other”.", ar: "لا نتيجة. اختر «تخصص آخر»." })}</span>}
                </div>
                {str(a, "intent") === "masterclass" && str(a, "specialty") && !SURGICAL.includes(str(a, "specialty")) && (
                  <p className="note"><Info size={16} />{t({ en: "The masterclass is for urologists and andrologists. Continue and we'll suggest the right pass for you.", ar: "الماستر كلاس لأطباء المسالك البولية والذكورة. تابع وسنقترح عليك التذكرة المناسبة." })}</p>
                )}
              </div>
            );
          })()}

          {step.kind === "text" && (
            <label className="field">
              <textarea value={str(a, step.id)} onChange={(e) => set(step.id, e.target.value)} style={{ minHeight: 140 }} placeholder={t({ en: "For example: complex revisions, or my first infrapubic cases", ar: "مثلًا: حالات المراجعة المعقدة، أو أولى حالاتي بالمدخل فوق العانة" })} />
            </label>
          )}

          {step.kind === "pitch" && (
            <div className="form">
              <Field full label={t({ en: "Working title", ar: "عنوان مبدئي" })} bad={tried && str(a, "title").trim().length < 6} err={t({ en: "Add a title", ar: "اكتب العنوان" })}>
                <input value={str(a, "title")} onChange={(e) => set("title", e.target.value)} />
              </Field>
              <Field full label={t({ en: "In a few lines: what did you find, and why does it matter?", ar: "في سطور: ماذا وجدت، ولماذا يهم؟" })} bad={tried && (words(str(a, "summary")) < 15 || words(str(a, "summary")) > 150)} err={t({ en: "Between 15 and 150 words", ar: "من 15 إلى 150 كلمة" })}>
                <textarea value={str(a, "summary")} onChange={(e) => set("summary", e.target.value)} style={{ minHeight: 160 }} />
                <small className="u-tnum" style={{ color: words(str(a, "summary")) > 150 ? "#FF8E8E" : undefined }}>{words(str(a, "summary"))} / 150</small>
              </Field>
            </div>
          )}

          {step.kind === "outlet" && (
            <div style={{ display: "grid", gap: 20 }}>
              <Field label={t({ en: "Program, publication or handle", ar: "اسم البرنامج أو المنصة أو الحساب" })} bad={tried && str(a, "outletName").trim().length < 2} err={t({ en: "Add the name", ar: "اكتب الاسم" })}>
                <input value={str(a, "outletName")} onChange={(e) => set("outletName", e.target.value)} />
              </Field>
              <div className="ap-opts">
                {AUDIENCE.map((o) => {
                  const on = str(a, "audience") === o.id;
                  return <button key={o.id} type="button" role="radio" aria-checked={on} className={`ap-opt${on ? " is-on" : ""}`} onClick={() => set("audience", o.id)}><span className="ap-opt-t"><b>{t(o.label)}</b><small>{t({ en: "Monthly audience", ar: "الجمهور شهريًا" })}</small></span>{on && <Check size={18} className="ap-opt-check" />}</button>;
                })}
              </div>
            </div>
          )}

          {step.kind === "details" && <Details a={a} set={set} tried={tried} />}

          {step.kind === "review" && (
            <div style={{ display: "grid", gap: 18 }}>
              <dl className="summary">
                {ORDER.filter((k) => a[k] && (Array.isArray(a[k]) ? (a[k] as string[]).length : true)).map((k) => (
                  <div key={k}>
                    <dt>{t(SHORT[k])}</dt>
                    <dd style={{ display: "flex", gap: 10, alignItems: "baseline", justifyContent: "flex-end" }}>
                      <span dir={["email", "phone"].includes(k) ? "ltr" : undefined}>{display(t, k, a[k])}</span>
                      <button type="button" className="ap-edit" aria-label={t({ en: "Edit", ar: "تعديل" })}
                        onClick={() => { const id = STEP_OF[k] ?? k; const n = steps.findIndex((s) => s.id === id); if (n >= 0) setI(n); }}><Pencil size={13} /></button>
                    </dd>
                  </div>
                ))}
              </dl>
              <label className={`field${tried && str(a, "consent") !== "yes" ? " is-bad" : ""}`} style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" checked={str(a, "consent") === "yes"} onChange={(e) => set("consent", e.target.checked ? "yes" : "")} style={{ width: 20, minHeight: 20, marginTop: 3 }} />
                <span style={{ fontWeight: 300, color: "var(--text-c)", letterSpacing: 0, fontSize: 14.5 }}>{t({ en: "My details are correct, and DZAC may contact me about this application.", ar: "بياناتي صحيحة، ويمكن لفريق DZAC التواصل معي بخصوص هذا الطلب." })}</span>
              </label>
            </div>
          )}
        </motion.div>

        <div className="nav-row">
          {i > 0 ? <button type="button" className="btn btn-ghost" onClick={back}><Bk size={15} />{t({ en: "Back", ar: "رجوع" })}</button> : <span />}
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {step.kind !== "review" && <span className="ap-enter"><CornerDownLeft size={13} />{t({ en: "Enter", ar: "Enter" })}</span>}
            <button type="button" className="btn btn-primary" onClick={next} style={!valid && !tried ? { opacity: 0.55 } : undefined}>
              {step.kind === "review" ? <><Sparkles size={15} />{t({ en: "Send application", ar: "أرسل الطلب" })}</> : <>{t({ en: "Continue", ar: "متابعة" })}<Fwd size={15} /></>}
            </button>
          </span>
        </div>
      </div>

      <aside className="ap-side" aria-label={t({ en: "Your application so far", ar: "طلبك حتى الآن" })}>
        <div className="ap-ring-row">
          <Ring pct={pct} />
          <div>
            <p className="ap-side-k">{t({ en: "Your application", ar: "طلبك" })}</p>
            <p className="ap-side-t">{left ? t({ en: `About ${left < 60 ? `${left} seconds` : "a minute"} left`, ar: `متبقٍ حوالي ${left < 60 ? `${left} ثانية` : "دقيقة"}` }) : t({ en: "Ready to send", ar: "جاهز للإرسال" })}</p>
          </div>
        </div>
        <ul className="ap-facts">
          {ORDER.filter((k) => a[k] && !["email", "phone", "name", "company", "institution", "country", "goal"].includes(k) && (Array.isArray(a[k]) ? (a[k] as string[]).length : true)).map((k) => (
            <motion.li key={k} layout initial={{ opacity: 0, x: locale === "ar" ? 12 : -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <small>{t(SHORT[k])}</small><span>{display(t, k, a[k])}</span>
            </motion.li>
          ))}
          {!a.intent && <li className="ap-empty">{t({ en: "Your answers will appear here as you go.", ar: "ستظهر إجاباتك هنا أولًا بأول." })}</li>}
        </ul>
        {result && (
          <motion.div key={result.title.en} className={`ap-insight is-${result.tone}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="ap-insight-k"><Sparkles size={13} />{t(result.tag)}</p>
            <p className="ap-insight-t">{t(result.title)}</p>
            <ul>{result.reasons.map((r, n) => <li key={n}>{t(r)}</li>)}</ul>
          </motion.div>
        )}
      </aside>
    </div>
  );
}

function Field({ label, bad, err, full, ok, children }: { label: string; bad?: boolean; err?: string; full?: boolean; ok?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field${bad ? " is-bad" : ""}${full ? " full" : ""}${ok ? " is-ok" : ""}`}>
      <span>{label}{ok && <Check size={13} className="field-ok" />}</span>
      {children}
      {bad && err && <em>{err}</em>}
    </label>
  );
}

function Details({ a, set, tried }: { a: Answers; set: (k: string, v: string) => void; tried: boolean }) {
  const t = useT();
  const bad = detailsErrors(a);
  const suggest = emailSuggestion(str(a, "email"));
  const onCountry = (id: string) => {
    const c = COUNTRIES.find((x) => x.id === id);
    const prev = COUNTRIES.find((x) => x.id === str(a, "country"));
    const phone = str(a, "phone").trim();
    set("country", id);
    /* Fill the dialling code when the number is empty or still just the last country's code. */
    if (c && (!phone || (prev && phone === prev.dial))) set("phone", c.dial === "+" ? "+" : `${c.dial} `);
  };
  return (
    <div className="form">
      {isOrg(a) && (
        <Field full label={t({ en: "Company or institution", ar: "الشركة أو الجهة" })} bad={tried && bad.company} ok={!bad.company} err={t({ en: "Add the company", ar: "اكتب اسم الشركة" })}>
          <input value={str(a, "company")} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
        </Field>
      )}
      <Field full label={isOrg(a) ? t({ en: "Your name", ar: "اسمك" }) : t({ en: "Full name, as on your certificate", ar: "الاسم بالكامل كما يظهر في الشهادة" })} bad={tried && bad.name} ok={!bad.name} err={t({ en: "Please enter your full name", ar: "اكتب اسمك بالكامل" })}>
        <input value={str(a, "name")} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
      </Field>
      <Field label={t({ en: "Email", ar: "البريد الإلكتروني" })} bad={tried && bad.email} ok={!bad.email && !suggest} err={t({ en: "Check the email address", ar: "راجع البريد الإلكتروني" })}>
        <input type="email" dir="ltr" value={str(a, "email")} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        {suggest && (
          <button type="button" className="ap-suggest" onClick={() => set("email", suggest)}>
            {t({ en: "Did you mean", ar: "هل تقصد" })} <b dir="ltr">{suggest}</b>?
          </button>
        )}
      </Field>
      <Field label={t({ en: "Country", ar: "الدولة" })} bad={tried && bad.country} ok={!bad.country} err={t({ en: "Choose a country", ar: "اختر الدولة" })}>
        <select value={str(a, "country")} onChange={(e) => onCountry(e.target.value)} autoComplete="country">
          <option value="">{t({ en: "Choose", ar: "اختر" })}</option>
          {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{t(c.label)}</option>)}
        </select>
      </Field>
      <Field label={t({ en: "Mobile", ar: "الموبايل" })} bad={tried && bad.phone} ok={!bad.phone} err={t({ en: "Check the number", ar: "راجع الرقم" })}>
        <input type="tel" dir="ltr" value={str(a, "phone")} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+20 1X XXXX XXXX" />
      </Field>
      {needsInstitution(a) && (
        <Field label={t({ en: "Hospital, university or clinic", ar: "المستشفى أو الجامعة أو العيادة" })} bad={tried && bad.institution} ok={!bad.institution} err={t({ en: "Please fill this in", ar: "اكتب جهة العمل" })}>
          <input value={str(a, "institution")} onChange={(e) => set("institution", e.target.value)} autoComplete="organization" />
        </Field>
      )}
    </div>
  );
}

/** Progress as a fine ring that fills. */
function Ring({ pct }: { pct: number }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="ap-ring" aria-hidden>
      <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1.5" />
      <motion.circle cx="32" cy="32" r={r} fill="none" stroke="url(#apg)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} transform="rotate(-90 32 32)" />
      <defs><linearGradient id="apg" x1="0" x2="1"><stop offset="0" stopColor="#3BD8F2" /><stop offset="1" stopColor="#E6D5AE" /></linearGradient></defs>
      <text x="32" y="36" textAnchor="middle" fontSize="13" fill="#EDF0F6" fontFamily="var(--mono)">{pct}%</text>
    </svg>
  );
}

/* ── Result ────────────────────────────────────────────── */

const SPEC_TO_REGISTER: Record<string, string> = {
  urology: "Urology", andrology: "Andrology", pediatric: "Pediatric urology", endocrinology: "Endocrinology",
  psychiatry: "Psychiatry / sexual medicine", reproductive: "Reproductive medicine", plastic: "Plastic surgery", family: "Other", other: "Other",
};
const TRACK_TO_ABSTRACT: Record<string, string> = {
  pediatrics: "Pediatrics", endo: "Endocrinology and Psychosexual Medicine", andrology: "Andrology", infertility: "Debates in Infertility",
  genetics: "Genetics and Regenerative Medicine", urology: "Urology",
};

function Result({ code, a, outcome: o }: { code: string; a: Answers; outcome: Outcome | null }) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const intent = str(a, "intent");
  const country = COUNTRIES.find((c) => c.id === str(a, "country"));
  const toRegister = (pass: string) => {
    const role = str(a, "role");
    setPrefill({
      kind: "register", pass, category: intent === "masterclass" ? "specialist" : role || "specialist",
      name: str(a, "name"), email: str(a, "email"), phone: str(a, "phone"), institution: str(a, "institution"),
      country: country && country.id !== "XX" && country.id !== "GB" ? country.label.en : "Other",
      specialty: SPEC_TO_REGISTER[str(a, "specialty")] ?? "",
    });
    router.push(`${page(locale, "register")}?pass=${pass}`);
  };
  const toAbstract = () => {
    setPrefill({ kind: "abstract", title: str(a, "title"), author: str(a, "name"), email: str(a, "email"), institution: str(a, "institution"), track: TRACK_TO_ABSTRACT[str(a, "track")] ?? "", type: str(a, "format") || "oral", body: str(a, "summary") });
    router.push(page(locale, "abstracts"));
  };
  const attendPass = str(a, "masterclassToo") === "yes" || str(a, "masterclassToo") === "maybe" ? "bundle" : "conference";
  const mcEligible = SURGICAL.includes(str(a, "specialty"));
  const first = str(a, "name").split(/\s+/).filter((w) => !/^(dr|prof)\.?$/i.test(w))[0] ?? "";
  return (
    <div className="ap-done">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "grid", gap: 12 }}>
        <p className="kicker"><Check size={13} /> {t({ en: "Application received", ar: "وصلنا طلبك" })}</p>
        <h2 className="h2">{t({ en: `Thank you${first ? `, ${first}` : ""}.`, ar: `شكرًا لك${first ? ` يا ${first}` : ""}.` })}</h2>
        <p className="lead">{t({ en: "Your reference is below. Keep it: the team will quote it when they contact you.", ar: "رقم طلبك بالأسفل. احتفظ به، فسيذكره الفريق عند التواصل معك." })}</p>
        <p className="ap-code" dir="ltr">{code}</p>
      </motion.div>
      {o && (
        <motion.div className={`ap-insight is-${o.tone} is-big`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          <p className="ap-insight-k"><Sparkles size={14} />{t(o.tag)}</p>
          <p className="ap-insight-t">{t(o.title)}</p>
          <ul>{o.reasons.map((r, n) => <li key={n}>{t(r)}</li>)}</ul>
          {intent === "attend" && arr(a, "interests").length > 0 && (
            <div className="ap-agenda">
              <small>{t({ en: "Your agenda", ar: "برنامجك" })}</small>
              <span>{display(t, "interests", arr(a, "interests"))}</span>
            </div>
          )}
        </motion.div>
      )}
      <div className="done-actions">
        {intent === "attend" && <button type="button" className="btn btn-primary" onClick={() => toRegister(attendPass)}>{t({ en: "Continue to registration", ar: "تابع إلى التسجيل" })}</button>}
        {intent === "masterclass" && <button type="button" className={`btn ${mcEligible ? "btn-gold" : "btn-primary"}`} onClick={() => toRegister(mcEligible ? "masterclass" : "conference")}>{mcEligible ? t({ en: "Reserve your seat", ar: "احجز مقعدك" }) : t({ en: "Register for the conference", ar: "سجّل في المؤتمر" })}</button>}
        {intent === "speak" && <button type="button" className="btn btn-primary" onClick={toAbstract}>{t({ en: "Write the full abstract", ar: "اكتب الملخص الكامل" })}</button>}
        {intent === "partner" && <Link className="btn btn-primary" href={page(locale, "partners")}>{t({ en: "See partner benefits", ar: "مزايا الشركاء" })}</Link>}
        {intent === "media" && <Link className="btn btn-primary" href={page(locale, "gallery")}>{t({ en: "DZAC 4 photos for your coverage", ar: "صور DZAC 4 لتغطيتك" })}</Link>}
        <Link className="btn btn-ghost" href={page(locale)}>{t({ en: "Back to DZAC 5", ar: "العودة إلى DZAC 5" })}</Link>
      </div>
      <p className="note"><Info size={16} />{t(UI.demo)}</p>
    </div>
  );
}
