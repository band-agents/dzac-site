"use client";

/** The inner pages: a page hero, then the shared sections or a form. */

import Link from "next/link";
import { FileText } from "lucide-react";
import { EVENT, HOME, WORKSHOP } from "@/content/site";
import { useLocale, useT } from "@/lib/locale";
import { Reveal } from "@/lib/motion";
import { asset, page, photo } from "@/lib/paths";
import { Beyond, Editions, Faculty, Lounge, Masterclass, PageHero, Passes, Section, SectionHead, Tiers, Tracks } from "../sections";
import { useLightbox } from "../Lightbox";
import { AbstractForm, CertificateView, CheckInView, PartnerForm } from "./Forms";
import { ApplyView } from "./Apply";
import { FilmsGrid, GalleryView } from "./Media";
import { RegisterView, TicketView } from "./Register";

function AbstractBand() {
  const t = useT();
  const locale = useLocale();
  return (
    <Section>
      <Reveal className="panel apb">
        <SectionHead kicker={t({ en: "Call for abstracts", ar: "دعوة لتقديم الملخصات" })} title={t({ en: "Present your work on the DZAC 5 stage.", ar: "اعرض بحثك على منصة DZAC 5." })}>
          <Link href={page(locale, "abstracts")} className="btn btn-primary"><FileText size={16} />{t({ en: "Submit an abstract", ar: "قدّم ملخصًا" })}</Link>
        </SectionHead>
      </Reveal>
    </Section>
  );
}

export function ProgramView() {
  const t = useT();
  return (
    <>
      <PageHero kicker={`${t(EVENT.date)} · ${t(EVENT.venue)}`} title={t({ en: "Scientific program", ar: "البرنامج العلمي" })}
        lead={t({ en: "Six tracks on one stage, and a wider conversation beyond andrology.", ar: "ستة مسارات على منصة واحدة، وحوار أوسع يتجاوز طب الذكورة." })} bg={photo("1745")} />
      <Tracks link={false} />
      <Beyond />
      <AbstractBand />
    </>
  );
}

export function MasterclassView() {
  const t = useT();
  const open = useLightbox();
  const shots = WORKSHOP.filter((s) => s.h > s.w).slice(0, 8);
  return (
    <>
      <PageHero kicker={t({ en: "Hands-on masterclass", ar: "ماستر كلاس عملي" })} title={t({ en: "Into the operating room", ar: "إلى داخل غرفة العمليات" })}
        lead={t({ en: "Twenty live penile prosthesis implants, with scrub-in for every participant. Places are limited.", ar: "عشرون عملية زراعة دعامة حية، مع دخول غرفة العمليات لكل مشارك. الأماكن محدودة." })} bg={photo("444", "lg", "workshop")} />
      <Masterclass link={false} />
      <Section>
        <SectionHead kicker={t({ en: "DZAC 4 masterclass", ar: "ماستر كلاس DZAC 4" })} title={t({ en: "Alexandria Urology Hospital", ar: "مستشفى الإسكندرية لجراحة المسالك" })} />
          <div className="reels">
            {shots.map((s, i) => (
              <button key={s.id} type="button" className="reel" style={{ flexBasis: "clamp(160px, 18vw, 240px)", aspectRatio: "3 / 4" }}
                onClick={() => open({ kind: "photos", index: i, list: shots.map((x) => ({ src: photo(x.id, "lg", "workshop"), alt: "DZAC 4 masterclass" })) })}
                aria-label={`DZAC 4 masterclass ${i + 1}`}>
                <img src={photo(s.id, "sm", "workshop")} alt="" loading="lazy" decoding="async" style={{ filter: "none" }} />
              </button>
            ))}
          </div>
      </Section>
      <Section>
        <SectionHead kicker={t({ en: "Films", ar: "الأفلام" })} title={t({ en: "Watch the DZAC 4 masterclass", ar: "شاهد ماستر كلاس DZAC 4" })} />
        <FilmsGrid />
      </Section>
      <Passes />
    </>
  );
}

export function FacultyView() {
  const t = useT();
  return (
    <>
      <PageHero kicker={t(EVENT.full)} title={t({ en: "The people behind DZAC 5", ar: "فريق DZAC 5" })}
        lead={t({ en: "The conference leadership and organizers. The full DZAC 5 faculty is announced here as speakers confirm.", ar: "قيادة المؤتمر والجهات المنظمة. تُعلن قائمة محاضري DZAC 5 كاملة هنا مع تأكيد كل محاضر." })} bg={photo("2929")} />
      <Faculty head={false} />
      <Editions />
    </>
  );
}

export function GalleryPage() {
  const t = useT();
  return (
    <>
      <PageHero kicker="DZAC 4 · 8–9 January 2026" title={t({ en: "Gallery", ar: "معرض الصور" })}
        lead={t({ en: "Two days at the Triumph Luxury Hotel and the Alexandria Urology Hospital. The DZAC 1 to 3 archives join soon.", ar: "يومان في فندق تريومف ومستشفى الإسكندرية لجراحة المسالك. أرشيف DZAC 1 إلى 3 ينضم قريبًا." })} />
      <section className="s"><div className="wrap"><GalleryView /></div></section>
    </>
  );
}

export function FilmsPage() {
  const t = useT();
  return (
    <>
      <PageHero kicker={t({ en: "Films", ar: "الأفلام" })} title={t({ en: "Watch DZAC", ar: "شاهد DZAC" })}
        lead={t({ en: "The DZAC 4 film, the masterclass, the Dar El Zokora story and the Men's Lounge interviews.", ar: "فيلم DZAC 4، والماستر كلاس، وحكاية دار الذكورة، ولقاءات Men's Lounge." })} bg={asset("/media/posters/dzac4-film.webp")} />
      <section className="s"><div className="wrap"><FilmsGrid /></div></section>
      <Lounge />
    </>
  );
}

export function PartnersView() {
  const t = useT();
  return (
    <>
      <PageHero kicker={t({ en: "Partners", ar: "الشركاء" })} title={t(HOME.partnersTitle)}
        lead={t({ en: "Put your brand in front of the region's urologists and andrologists, on stage, on screen and in the exhibition.", ar: "اعرض علامتك أمام أطباء المسالك والذكورة في المنطقة: على المنصة، وعلى الشاشات، وفي المعرض." })} bg={photo("1449")} />
      <Tiers link={false} head={false} />
      <section className="s"><div className="wrap" style={{ maxWidth: 900 }}><PartnerForm /></div></section>
    </>
  );
}

export function RegisterPage() {
  const t = useT();
  return (
    <>
      <PageHero kicker={`${t(EVENT.date)} · ${t(EVENT.venue)}`} title={t({ en: "Register for DZAC 5", ar: "سجّل في DZAC 5" })}
        lead={t({ en: "Four short steps, then your e-ticket with a QR code for the door.", ar: "أربع خطوات قصيرة، ثم تذكرتك الإلكترونية برمز QR للدخول." })} />
      <section className="s"><div className="wrap" style={{ maxWidth: 980 }}><RegisterView /></div></section>
    </>
  );
}

export function ApplyPage() {
  const t = useT();
  return (
    <>
      <PageHero kicker={t({ en: "Apply · about a minute", ar: "التقديم · حوالي دقيقة" })} title={t({ en: "Apply to DZAC 5", ar: "قدّم على DZAC 5" })}
        lead={t({ en: "Tell us who you are and what you're after. The form adapts as you answer, and tells you what fits you best.", ar: "أخبرنا من أنت وما الذي تبحث عنه. النموذج يتكيف مع إجاباتك، ويخبرك بما يناسبك أكثر." })} />
      <section className="s"><div className="wrap"><ApplyView /></div></section>
    </>
  );
}

export function TicketPage() {
  const t = useT();
  return (
    <>
      <PageHero kicker="DZAC 5" title={t({ en: "Your ticket", ar: "تذكرتك" })} lead={t({ en: "Show the QR code at registration.", ar: "اعرض رمز QR عند التسجيل." })} />
      <section className="s"><div className="wrap" style={{ maxWidth: 980 }}><TicketView /></div></section>
    </>
  );
}

export function AbstractsView() {
  const t = useT();
  return (
    <>
      <PageHero kicker={t({ en: "Call for abstracts", ar: "دعوة لتقديم الملخصات" })} title={t({ en: "Submit an abstract", ar: "قدّم ملخصًا بحثيًا" })}
        lead={t({ en: "Original work in any of the six tracks, as an oral presentation, a poster or a surgical video.", ar: "أعمال أصلية في أي من المسارات الستة، كعرض شفهي أو بوستر أو فيديو جراحي." })} />
      <section className="s"><div className="wrap" style={{ maxWidth: 980 }}><AbstractForm /></div></section>
    </>
  );
}

export function CertificatePage() {
  const t = useT();
  return (
    <>
      <PageHero kicker="DZAC 5" title={t({ en: "Certificate of attendance", ar: "شهادة الحضور" })}
        lead={t({ en: "After the conference, enter your ticket code to download your certificate.", ar: "بعد المؤتمر، اكتب كود تذكرتك لتحميل شهادتك." })} />
      <section className="s"><div className="wrap" style={{ maxWidth: 1080 }}><CertificateView /></div></section>
    </>
  );
}

export function CheckInPage() {
  const t = useT();
  return (
    <>
      <PageHero kicker={t({ en: "Staff", ar: "فريق العمل" })} title={t({ en: "Check-in", ar: "تسجيل الدخول" })}
        lead={t({ en: "Scan a ticket's QR code or type its code. Each ticket checks in once.", ar: "امسح رمز QR أو اكتب الكود. كل تذكرة تدخل مرة واحدة." })} />
      <section className="s"><div className="wrap" style={{ maxWidth: 980 }}><CheckInView /></div></section>
    </>
  );
}
