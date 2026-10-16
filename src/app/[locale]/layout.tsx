import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Alexandria, IBM_Plex_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { EVENT, LOCALES } from "@/content/site";
import { LocaleProvider } from "@/lib/locale";
import { isLocale } from "@/lib/paths";
import { Footer, Header } from "@/components/chrome";
import { LightboxProvider } from "@/components/Lightbox";

/* The DZAC 5 design faces: Host Grotesk for everything, Raftel for the big numerals, Elegant for the
   one script word. Arabic: Alexandria for display, IBM Plex Sans Arabic for text. Only Host Grotesk
   preloads; the others load when a page uses them. */
const host = localFont({ src: [
  { path: "../../../public/fonts/HostGrotesk-Light.otf", weight: "300" },
  { path: "../../../public/fonts/HostGrotesk-Regular.otf", weight: "400" },
  { path: "../../../public/fonts/HostGrotesk-Medium.otf", weight: "500" },
], variable: "--f-host", display: "swap" });
const raftel = localFont({ src: "../../../public/fonts/Raftel.ttf", variable: "--f-raftel", display: "swap", preload: false });
const elegant = localFont({ src: "../../../public/fonts/ElegantWoman.ttf", variable: "--f-elegant", display: "swap", preload: false });
const alex = Alexandria({ subsets: ["arabic"], variable: "--f-alex", display: "swap", preload: false });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500"], variable: "--f-plex", display: "swap", preload: false });

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#070D1B", colorScheme: "dark" };

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
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${host.variable} ${raftel.variable} ${elegant.variable} ${alex.variable} ${plex.variable}`}>
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
