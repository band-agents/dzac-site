import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Alexandria, Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import "../globals.css";
import { EVENT, LOCALES } from "@/content/site";
import { LocaleProvider } from "@/lib/locale";
import { isLocale } from "@/lib/paths";
import { Footer, Header } from "@/components/chrome";
import { LightboxProvider } from "@/components/Lightbox";

/* Quiet, light type: a high-contrast serif for display and numbers, a refined sans for text, a fine
   mono for the small instrument labels. Arabic: Alexandria in its light weights, IBM Plex Sans Arabic. */
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--f-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono", display: "swap" });
const alex = Alexandria({ subsets: ["arabic", "latin"], weight: ["200", "300", "400", "500"], variable: "--f-alex", display: "swap" });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500"], variable: "--f-plex", display: "swap" });

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#050914", colorScheme: "dark" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "en";
  return {
    title: { default: `DZAC 5 · ${EVENT.tagline[l]}`, template: `%s · DZAC 5` },
    description: `${EVENT.full[l]} · ${EVENT.date[l]} · ${EVENT.venue[l]}`,
    /* Preview build: keep it out of search until the client signs off. */
    robots: { index: false, follow: false },
    icons: { icon: (process.env.NEXT_PUBLIC_BASE ?? "") + "/brand/icon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${serif.variable} ${sans.variable} ${mono.variable} ${alex.variable} ${plex.variable}`}>
      <body>
        <LocaleProvider locale={locale}>
          <LightboxProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </LightboxProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
