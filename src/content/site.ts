/**
 * Every word on the site, in English and Arabic.
 *
 * Sources: the DZAC 5 presentation (Downloads/DZAC5_Presentation.pdf), the
 * DZAC 2 and DZAC 3 pages on darelzokora.com, and the DZAC 4 Drive folder.
 * Lines marked `// ours` were written for the site and need the organisers'
 * review. Anything the deck lists "to confirm" is marked `// TBC`.
 */

export type Locale = "en" | "ar";
export const LOCALES: Locale[] = ["en", "ar"];
export type L = { en: string; ar: string };

export const EVENT = {
  name: "DZAC 5",
  full: { en: "Dar El Zokora Annual Conference", ar: "المؤتمر السنوي لدار الذكورة" } as L,
  edition: { en: "5th edition", ar: "النسخة الخامسة" } as L,
  tagline: { en: "Shaping the Future of Men's Health", ar: "نصوغ مستقبل صحة الرجل" } as L,
  date: { en: "14 January 2027", ar: "14 يناير 2027" } as L,
  /** Countdown target. The start time is ours until the program fixes it. */ // TBC
  startsAt: "2027-01-14T09:00:00+02:00",
  venue: { en: "Triumph Luxury Hotel, New Cairo", ar: "فندق تريومف لاكشري، القاهرة الجديدة" } as L,
  mapsQuery: "Triumph Luxury Hotel New Cairo",
  hashtag: "#DZAC5",
  facebook: "https://www.facebook.com/dzacofficial",
  organizer: { en: "Dar El Zokora Group", ar: "مجموعة دار الذكورة" } as L,
};

export const NAV = [
  { href: "program", label: { en: "Program", ar: "البرنامج" } },
  { href: "masterclass", label: { en: "Masterclass", ar: "الماستر كلاس" } },
  { href: "faculty", label: { en: "Faculty", ar: "المحاضرون" } },
  { href: "gallery", label: { en: "Gallery", ar: "الصور" } },
  { href: "films", label: { en: "Films", ar: "الأفلام" } },
  { href: "partners", label: { en: "Partners", ar: "الشركاء" } },
] as const;

export const UI = {
  register: { en: "Register", ar: "سجّل الآن" },
  apply: { en: "Apply", ar: "قدّم الآن" },
  registerNow: { en: "Register now", ar: "سجّل الآن" },
  watch: { en: "Watch DZAC 4", ar: "شاهد DZAC 4" },
  menu: { en: "Menu", ar: "القائمة" },
  close: { en: "Close", ar: "إغلاق" },
  lang: { en: "العربية", ar: "English" },
  langLabel: { en: "التحويل إلى العربية", ar: "Switch to English" },
  days: { en: "Days", ar: "يوم" },
  hours: { en: "Hours", ar: "ساعة" },
  minutes: { en: "Minutes", ar: "دقيقة" },
  seconds: { en: "Seconds", ar: "ثانية" },
  scroll: { en: "Scroll", ar: "مرّر" },
  seeProgram: { en: "See the program", ar: "شاهد البرنامج" },
  learnMore: { en: "Learn more", ar: "اعرف المزيد" },
  allPhotos: { en: "All photos", ar: "كل الصور" },
  allFilms: { en: "All films", ar: "كل الأفلام" },
  becomePartner: { en: "Become a partner", ar: "كن شريكًا" },
  directions: { en: "Get directions", ar: "الاتجاهات" },
  play: { en: "Play", ar: "تشغيل" },
  provisional: { en: "Provisional", ar: "مبدئي" },
  tba: { en: "Announced soon", ar: "يُعلن قريبًا" },
  limited: { en: "Limited seats", ar: "مقاعد محدودة" },
  bestValue: { en: "Best value", ar: "الأفضل قيمة" },
  demo: {
    en: "Preview: payments and email confirmations connect at launch. Nothing is charged or sent.",
    ar: "نسخة تجريبية: الدفع وتأكيدات البريد تُربط عند الإطلاق. لا يتم خصم أو إرسال أي شيء.",
  },
} satisfies Record<string, L>;

/* ── What's new ─────────────────────────────────────────── */

export const NEW = [
  { icon: "Globe2", title: { en: "Beyond andrology", ar: "ما بعد الذكورة" }, body: { en: "Wellness, plastic surgery, sport, nutrition and new technology join the program.", ar: "العافية والجراحة التجميلية والرياضة والتغذية والتقنيات الحديثة تنضم إلى البرنامج." } },
  { icon: "Stethoscope", title: { en: "Hands-on masterclass", ar: "ماستر كلاس عملي" }, body: { en: "Live penile prosthesis surgery with international faculty, and scrub-in for every participant.", ar: "جراحات حية لزراعة الدعامة مع محاضرين دوليين، ومشاركة كل متدرب داخل غرفة العمليات." } },
  { icon: "Mic", title: { en: "Men's Lounge Talks", ar: "حوارات Men's Lounge" }, body: { en: "Video interviews with speakers and doctors, filmed during the event.", ar: "لقاءات مصوّرة مع المحاضرين والأطباء تُسجَّل أثناء المؤتمر." } },
  { icon: "Ticket", title: { en: "Register online", ar: "التسجيل أونلاين" }, body: { en: "Book your seat here, with a conference and masterclass bundle and an e-ticket at the door.", ar: "احجز مقعدك من هنا، مع باقة المؤتمر والماستر كلاس وتذكرة إلكترونية عند الدخول." } }, // ours (wording)
];

/* ── Scientific program ─────────────────────────────────── */

export const TRACKS = [
  { n: "01", title: { en: "Pediatrics", ar: "ذكورة الأطفال" }, body: { en: "Congenital and developmental conditions in boys, from first diagnosis to surgery.", ar: "الحالات الخلقية والنمائية عند الأولاد، من التشخيص الأول حتى الجراحة." } }, // ours
  { n: "02", title: { en: "Endocrinology and Psychosexual Medicine", ar: "الغدد الصماء والطب النفسي الجنسي" }, body: { en: "Hormones, desire and the mind: where the endocrine clinic meets the consulting room.", ar: "الهرمونات والرغبة والنفس: حيث تلتقي عيادة الغدد بالعيادة النفسية." } }, // ours
  { n: "03", title: { en: "Andrology", ar: "طب الذكورة" }, body: { en: "Erectile dysfunction, Peyronie's disease and prosthetic surgery, case by case.", ar: "ضعف الانتصاب ومرض بيروني وجراحات الدعامات، حالة بحالة." } }, // ours
  { n: "04", title: { en: "Debates in Infertility", ar: "جدل العقم" }, body: { en: "Two sides of the open questions in male infertility, argued on stage.", ar: "وجهتا نظر في الأسئلة المفتوحة حول عقم الرجال، على المنصة." } }, // ours
  { n: "05", title: { en: "Genetics and Regenerative Medicine", ar: "الجينات والطب التجديدي" }, body: { en: "From DNA fragmentation to regenerative therapies, and what reaches the clinic next.", ar: "من تفتت الحمض النووي إلى العلاجات التجديدية، وما يصل إلى العيادة قريبًا." } }, // ours
  { n: "06", title: { en: "Urology", ar: "المسالك البولية" }, body: { en: "Prostate, urethra and reconstruction: the urology behind men's health.", ar: "البروستاتا والإحليل وجراحات الترميم: المسالك البولية خلف صحة الرجل." } }, // ours
];

export const PROGRAM_NOTE = {
  en: "Draft program. The full schedule, sessions and new tracks will be announced here.",
  ar: "برنامج مبدئي. الجدول الكامل والجلسات والمسارات الجديدة ستُعلن هنا.",
};

export const BEYOND = [
  { icon: "Leaf", title: { en: "Wellness", ar: "العافية" }, body: { en: "Men's wellbeing and lifestyle medicine", ar: "صحة الرجل وطب نمط الحياة" } },
  { icon: "Scissors", title: { en: "Plastic surgery", ar: "الجراحة التجميلية" }, body: { en: "Aesthetic and reconstructive care", ar: "الرعاية التجميلية والترميمية" } },
  { icon: "Activity", title: { en: "Sport", ar: "الرياضة" }, body: { en: "Performance, recovery and sports medicine", ar: "الأداء والتعافي والطب الرياضي" } },
  { icon: "Apple", title: { en: "Nutrition", ar: "التغذية" }, body: { en: "Diet, metabolism and hormonal health", ar: "الغذاء والتمثيل الغذائي وصحة الهرمونات" } },
  { icon: "Cpu", title: { en: "New tech", ar: "التقنيات الحديثة" }, body: { en: "AI and digital tools in men's medicine", ar: "الذكاء الاصطناعي والأدوات الرقمية في طب الرجل" } },
];

export const BEYOND_LINE = {
  en: "Same stage and faculty, with a wider conversation about the whole man.",
  ar: "المنصة نفسها والمحاضرون أنفسهم، بحوار أوسع عن الرجل كله.",
};

/* ── Masterclass ────────────────────────────────────────── */

export const MASTERCLASS = {
  kicker: { en: "Hands-on masterclass", ar: "ماستر كلاس عملي" },
  title: { en: "International Masterclass on Penile Prosthesis Implant", ar: "الماستر كلاس الدولي لزراعة دعامة العضو الذكري" },
  approach: { en: "Peno-scrotal and infrapubic approaches", ar: "المدخل الصفني القضيبي والمدخل فوق العانة" },
  count: 20,
  countLabel: { en: "live surgical implants", ar: "عملية زراعة حية" },
  scrub: { en: "Scrub-in allowed for all participants", ar: "مسموح لكل المشاركين بالدخول إلى غرفة العمليات" },
  points: [
    { en: "Live surgery in the OR with exclusive hands-on training", ar: "جراحات حية داخل غرفة العمليات مع تدريب عملي حصري" },
    { en: "Prof. Ossama Ghattas with international faculty", ar: "أ.د. أسامة غطاس مع نخبة من المحاضرين الدوليين" },
    { en: "For urologists and andrologists", ar: "لأطباء المسالك البولية والذكورة" },
    { en: "Limited seats", ar: "مقاعد محدودة" },
  ],
  fee: "5,000 €", // TBC: the flyer says 5000 €, the brief says $5,000
};

/* ── People ─────────────────────────────────────────────── */

export const LEADERS = [
  { role: { en: "Conference President", ar: "رئيس المؤتمر" }, name: { en: "Prof. Ossama Ghattas", ar: "أ.د. أسامة غطاس" }, photo: "/media/photos/761.webp" },
  { role: { en: "Vice-President", ar: "نائب رئيس المؤتمر" }, name: { en: "Prof. Dr. Gabriele Antonini", ar: "أ.د. جابرييل أنطونيني" }, photo: "/media/photos/2617.webp" },
  { role: { en: "Head of Scientific Committee", ar: "رئيس اللجنة العلمية" }, name: { en: "Dr. AbdulMonem Bahaa El-Din Gomha", ar: "د. عبد المنعم بهاء الدين جمعة" }, photo: "" },
  { role: { en: "Conference Secretary", ar: "سكرتير المؤتمر" }, name: { en: "Dr. Amr Mohsen", ar: "د. عمرو محسن" }, photo: "" },
];

export const ORGANIZERS = [
  { role: { en: "Organized by", ar: "تنظيم" }, name: { en: "Dar El Zokora Group", ar: "مجموعة دار الذكورة" } },
  { role: { en: "Scientific partner", ar: "الشريك العلمي" }, name: { en: "International Society of Man Health and Andrology (ISMHA)", ar: "الجمعية الدولية لصحة الرجل وطب الذكورة (ISMHA)" } },
  { role: { en: "Event organizer", ar: "منظم الحدث" }, name: { en: "Horizon", ar: "Horizon" }, logo: "/brand/horizon.png" },
];

/** Faculty of earlier editions, as listed on darelzokora.com. Not a DZAC 5 line-up. */
export const PAST_FACULTY = [
  { name: { en: "David Ralph", ar: "ديفيد رالف" }, from: { en: "Honorary President, DZAC 3", ar: "الرئيس الشرفي، DZAC 3" } },
  { name: { en: "Gabriele Antonini", ar: "جابرييل أنطونيني" }, from: { en: "DZAC 3 · DZAC 4", ar: "DZAC 3 · DZAC 4" } },
  { name: { en: "Ege Can Şerefoğlu", ar: "إيجي كان شيريفوغلو" }, from: { en: "DZAC 2 · DZAC 3", ar: "DZAC 2 · DZAC 3" } },
  { name: { en: "Juan I. Salamanca", ar: "خوان سالامانكا" }, from: { en: "DZAC 3", ar: "DZAC 3" } },
  { name: { en: "Sam Ward", ar: "سام وارد" }, from: { en: "DZAC 3", ar: "DZAC 3" } },
  { name: { en: "Mohamed Hamdan", ar: "محمد حمدان" }, from: { en: "DZAC 2 · DZAC 3", ar: "DZAC 2 · DZAC 3" } },
  { name: { en: "Carlo Bettocchi", ar: "كارلو بيتوكي" }, from: { en: "DZAC 2", ar: "DZAC 2" } },
  { name: { en: "Yasser Farahat", ar: "ياسر فرحات" }, from: { en: "DZAC 2", ar: "DZAC 2" } },
];

/* ── Editions ───────────────────────────────────────────── */

export const EDITIONS = [
  { n: 1, when: { en: "Where it began", ar: "البداية" }, theme: { en: "The first Dar El Zokora conference", ar: "أول مؤتمر لدار الذكورة" }, where: { en: "Archive coming soon", ar: "الأرشيف قريبًا" } },
  { n: 2, when: { en: "Alexandria", ar: "الإسكندرية" }, theme: { en: "A multidisciplinary meeting on prosthetic surgery and infertility", ar: "لقاء متعدد التخصصات حول جراحات الدعامات والعقم" }, where: { en: "Live surgery at the Saudi German Hospital", ar: "جراحات حية في المستشفى السعودي الألماني" } },
  { n: 3, when: { en: "19–20 December 2024", ar: "19–20 ديسمبر 2024" }, theme: { en: "Andrology Switch", ar: "Andrology Switch" }, where: { en: "Radisson Blu Alex West, Alexandria", ar: "راديسون بلو أليكس ويست، الإسكندرية" } },
  { n: 4, when: { en: "8–9 January 2026", ar: "8–9 يناير 2026" }, theme: { en: "Empowering the Future of Male Health", ar: "Empowering the Future of Male Health" }, where: { en: "Triumph Luxury Hotel and Alexandria Urology Hospital", ar: "فندق تريومف لاكشري ومستشفى الإسكندرية لجراحة المسالك" } },
  { n: 5, when: { en: "14 January 2027", ar: "14 يناير 2027" }, theme: { en: "Shaping the Future of Men's Health", ar: "نصوغ مستقبل صحة الرجل" }, where: { en: "Triumph Luxury Hotel, New Cairo", ar: "فندق تريومف لاكشري، القاهرة الجديدة" } },
];

export const REVIEW = {
  stats: [
    { v: "8–9 Jan", l: { en: "2026, two conference days", ar: "2026، يوما المؤتمر" } },
    { v: "2", l: { en: "venues: Triumph Luxury Hotel and Alexandria Urology Hospital", ar: "مقرّان: فندق تريومف ومستشفى الإسكندرية لجراحة المسالك" } },
    { v: "4th", l: { en: "edition, themed Empowering the Future of Male Health", ar: "نسخة، بشعار Empowering the Future of Male Health" } },
  ],
};

/* ── Registration ───────────────────────────────────────── */

export type PassId = "conference" | "masterclass" | "bundle";
export type Category = "specialist" | "resident" | "student";

export const PASSES: { id: PassId; name: L; price: L; note?: L; points: L[]; featured?: boolean }[] = [
  {
    id: "conference", name: { en: "Conference", ar: "المؤتمر" }, price: { en: "3 tiers", ar: "3 فئات" },
    note: { en: "Early-bird pricing", ar: "أسعار الحجز المبكر" },
    points: [
      { en: "Specialist doctors", ar: "الأطباء الأخصائيون والاستشاريون" },
      { en: "Residents", ar: "أطباء الامتياز والمقيمون" },
      { en: "Students (with ID)", ar: "الطلاب (بالكارنيه)" },
      { en: "Full scientific program", ar: "البرنامج العلمي كاملًا" }, // ours
    ],
  },
  {
    id: "masterclass", name: { en: "Masterclass", ar: "الماستر كلاس" }, price: { en: "5,000 €", ar: "5,000 يورو" }, // TBC currency
    note: { en: "Limited seats", ar: "مقاعد محدودة" },
    points: [
      { en: "Live OR surgery", ar: "جراحات حية في غرفة العمليات" },
      { en: "Scrub-in for all", ar: "دخول غرفة العمليات للجميع" },
      { en: "Hands-on training", ar: "تدريب عملي" },
      { en: "Limited seats", ar: "مقاعد محدودة" },
    ],
  },
  {
    id: "bundle", name: { en: "Bundle", ar: "الباقة" }, price: { en: "Best value", ar: "الأفضل قيمة" }, featured: true,
    note: { en: "Conference + masterclass", ar: "المؤتمر + الماستر كلاس" },
    points: [
      { en: "Conference + masterclass", ar: "المؤتمر + الماستر كلاس" },
      { en: "Discounted combined fee", ar: "رسوم مجمّعة مخفّضة" },
      { en: "Certificate and dinner", ar: "شهادة وعشاء" },
      { en: "Priority for DZAC 6", ar: "أولوية في DZAC 6" },
    ],
  },
];

export const CATEGORIES: { id: Category; label: L; hint: L }[] = [
  { id: "specialist", label: { en: "Specialist doctor", ar: "طبيب أخصائي / استشاري" }, hint: { en: "Consultants and specialists", ar: "الاستشاريون والأخصائيون" } },
  { id: "resident", label: { en: "Resident", ar: "طبيب مقيم" }, hint: { en: "Residents and interns", ar: "المقيمون وأطباء الامتياز" } },
  { id: "student", label: { en: "Student", ar: "طالب" }, hint: { en: "With a valid student ID", ar: "بكارنيه ساري" } },
];

/* ── Partners ───────────────────────────────────────────── */

export const TIERS = [
  { id: "gold", name: { en: "Gold", ar: "ذهبي" }, points: [
    { en: "Large booth", ar: "جناح كبير" }, { en: "Stage talk", ar: "كلمة على المنصة" },
    { en: "Logo on stage and website", ar: "الشعار على المنصة والموقع" }, { en: "Social media feature", ar: "فقرة خاصة على السوشيال ميديا" },
    { en: "Screen video", ar: "فيديو على الشاشات" },
  ] },
  { id: "silver", name: { en: "Silver", ar: "فضي" }, points: [
    { en: "Standard booth", ar: "جناح قياسي" }, { en: "Logo placement", ar: "ظهور الشعار" }, { en: "Social media mention", ar: "إشارة على السوشيال ميديا" },
  ] },
  { id: "academic", name: { en: "Academic", ar: "أكاديمي" }, points: [
    { en: "Discounted space", ar: "مساحة بسعر مخفّض" }, { en: "Poster area", ar: "مساحة للبوسترات العلمية" }, { en: "Student recruitment", ar: "استقطاب الطلاب" },
  ] },
];

export const PARTNERS_FOR = {
  en: "For stent and prosthesis companies, pharma (hormones, injections, medications), universities and related-field doctors.",
  ar: "لشركات الدعامات والأطراف التعويضية، وشركات الأدوية (الهرمونات والحقن والعلاجات)، والجامعات، وأطباء التخصصات المرتبطة.",
};

/* ── Films ──────────────────────────────────────────────── */

export type Film =
  | { kind: "file"; id: string; title: L; sub: L; src: string; poster: string }
  | { kind: "drive"; id: string; title: L; sub: L; drive: string; poster: string; vertical?: boolean };

export const FILMS: Film[] = [
  { kind: "file", id: "dzac4", title: { en: "DZAC 4, the film", ar: "فيلم DZAC 4" }, sub: { en: "Two days at the Triumph Luxury Hotel, January 2026", ar: "يومان في فندق تريومف، يناير 2026" }, src: "/media/video/dzac4-film.mp4", poster: "/media/posters/dzac4-film.webp" },
  { kind: "file", id: "masterclass", title: { en: "Inside the masterclass", ar: "داخل الماستر كلاس" }, sub: { en: "Live surgery day, Alexandria Urology Hospital", ar: "يوم الجراحات الحية، مستشفى الإسكندرية لجراحة المسالك" }, src: "/media/video/masterclass-film.mp4", poster: "/media/posters/masterclass-film.webp" },
  { kind: "drive", id: "history", title: { en: "From history into the future", ar: "من التاريخ إلى المستقبل" }, sub: { en: "The Dar El Zokora story", ar: "حكاية دار الذكورة" }, drive: "1n3OYD1fGJWW5RE8geeh0aqtrcwlSNTdK", poster: "/media/posters/history.webp" },
];

/** Men's Lounge: vertical interviews filmed at DZAC 4. */
export const LOUNGE = [
  { id: "1-JIx6XkE6PSsfRzDWlAEvA3720pg-AKl", img: "1" }, { id: "105md8ZsgKy_LKPgNxyc8YrnnC0HseEYX", img: "2" },
  { id: "1Gsss4k86a9lhHJQ6wyBCCLSEO9Ym-qpv", img: "4" }, { id: "1HQF_sFVK-Xm0dYV4D_fREzKTW4erO02X", img: "5" },
  { id: "1oGNP7RdAOfT49Ux0QLceBD-sWBVx8FQY", img: "6" }, { id: "1Zkcw5CrMniMVnkIhDIWMuyA4IuStFYzD", img: "7" },
  { id: "1oadJ-hkVXgQPpnoyJF9DfNUN6yTej5Dq", img: "8" },
];

/* ── Gallery ────────────────────────────────────────────── */

export type Shot = { id: string; w: number; h: number; tag: "stage" | "people" | "hall" | "masterclass" };

const land = (id: string, tag: Shot["tag"]): Shot => ({ id, w: 1920, h: 1126, tag });
const port = (id: string, tag: Shot["tag"]): Shot => ({ id, w: 1200, h: 1704, tag });

export const SHOTS: Shot[] = [
  land("1721", "hall"), port("761", "stage"), land("1385", "hall"), port("2617", "stage"), land("1233", "hall"),
  port("1585", "stage"), land("2929", "hall"), port("2145", "stage"), land("1737", "hall"), port("1481", "people"),
  land("441", "hall"), port("2297", "stage"), land("1745", "hall"), port("2185", "stage"), port("1241", "people"),
  land("513", "hall"), port("2025", "people"), land("449", "stage"), port("2625", "stage"), port("1489", "people"),
  land("1729", "hall"), port("2321", "stage"), port("1673", "stage"), land("457", "stage"), port("2017", "people"),
  port("1497", "people"), land("481", "hall"), port("2809", "stage"), port("1625", "stage"), land("417", "hall"),
  port("1505", "people"), port("2905", "stage"), port("1993", "people"), land("425", "hall"), port("2753", "stage"),
  port("1529", "stage"), port("2049", "people"), land("433", "hall"), port("2681", "stage"), port("1665", "stage"),
  port("1249", "people"), port("2169", "stage"), port("905", "people"), port("2225", "stage"), port("33", "hall"),
  port("2673", "stage"), port("41", "hall"), port("2529", "people"), port("721", "stage"), port("1449", "hall"),
  port("1457", "hall"), port("2609", "stage"), port("1369", "stage"), port("1593", "stage"), port("2105", "stage"),
  port("2433", "stage"), port("2385", "stage"), port("2577", "stage"), port("2153", "stage"), port("2289", "stage"),
];

export const WORKSHOP: Shot[] = [
  port("438", "masterclass"), port("456", "masterclass"), port("13", "masterclass"), port("462", "masterclass"),
  port("142", "masterclass"), port("300", "masterclass"), port("470", "masterclass"), port("287", "masterclass"),
  port("306", "masterclass"), port("25", "masterclass"), port("261", "masterclass"), port("477", "masterclass"),
  land("444", "masterclass"), land("450", "masterclass"),
];

export const GALLERY_TAGS = [
  { id: "all", label: { en: "All", ar: "الكل" } },
  { id: "stage", label: { en: "Stage", ar: "المنصة" } },
  { id: "hall", label: { en: "Halls", ar: "القاعات" } },
  { id: "people", label: { en: "People", ar: "الحضور" } },
  { id: "masterclass", label: { en: "Masterclass", ar: "الماستر كلاس" } },
] as const;

/* ── Home copy ──────────────────────────────────────────── */

export const HOME = {
  statement: {
    en: "Four editions in, DZAC is where the region's andrology meets the world. In 2027 the conversation widens, from the child's first check to the operating room, to the whole man.",
    ar: "بعد أربع نسخ، أصبح DZAC المكان الذي يلتقي فيه طب الذكورة في المنطقة بالعالم. وفي 2027 يتسع الحوار، من الفحص الأول للطفل إلى غرفة العمليات، ليشمل الرجل كله.",
  }, // ours
  newTitle: { en: "What's new in DZAC 5", ar: "الجديد في DZAC 5" },
  programTitle: { en: "Six tracks. One stage.", ar: "ستة مسارات. منصة واحدة." }, // ours
  beyondTitle: { en: "Beyond andrology", ar: "ما بعد الذكورة" },
  facultyTitle: { en: "Faculty and organizers", ar: "المحاضرون والمنظمون" },
  pastFaculty: { en: "Faculty of past editions", ar: "محاضرو النسخ السابقة" },
  reviewTitle: { en: "DZAC 4 in review", ar: "DZAC 4 في لقطات" },
  editionsTitle: { en: "Five editions", ar: "خمس نسخ" },
  loungeTitle: { en: "Men's Lounge Talks", ar: "حوارات Men's Lounge" },
  loungeBody: {
    en: "Video interviews filmed at the event with speakers and doctors, cut into reels and shared across the region. Here are the voices of DZAC 4.",
    ar: "لقاءات مصوّرة أثناء المؤتمر مع المحاضرين والأطباء، تُقطَّع إلى ريلز وتُنشر في المنطقة. هذه أصوات من DZAC 4.",
  },
  passesTitle: { en: "Registration", ar: "التسجيل" },
  partnersTitle: { en: "Partner with DZAC 5", ar: "شارك مع DZAC 5" },
  venueTitle: { en: "The venue", ar: "مكان المؤتمر" },
  posterKicker: { en: "The official poster", ar: "البوستر الرسمي" },
  posterAlt: { en: "DZAC 5 official poster: Shaping the Future of Men's Health, 14 January 2027, Triumph Luxury Hotel, New Cairo", ar: "البوستر الرسمي لـ DZAC 5: نصوغ مستقبل صحة الرجل، 14 يناير 2027، فندق تريومف لاكشري، القاهرة الجديدة" },
  posterDownload: { en: "Download the poster", ar: "حمّل البوستر" },
  organizedBy: { en: "Organized by", ar: "تنظيم" },
  venueBody: {
    en: "DZAC returns to the Triumph Luxury Hotel in New Cairo, home of DZAC 4's main stage.",
    ar: "يعود DZAC إلى فندق تريومف لاكشري بالقاهرة الجديدة، حيث أُقيمت منصة DZAC 4 الرئيسية.",
  },
  finalTitle: { en: "Be in the room.", ar: "كن في القاعة." }, // ours
  finalBody: {
    en: "Seats for the masterclass are limited, and early-bird pricing opens first to those who register their interest.",
    ar: "مقاعد الماستر كلاس محدودة، وأسعار الحجز المبكر تبدأ أولًا لمن يسجّل اهتمامه.",
  }, // ours
};
