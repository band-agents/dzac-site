import type { L, Locale } from "@/content/site";

/** Files in /public need the base path by hand; <Link> adds it itself. */
export const asset = (p: string) => (process.env.NEXT_PUBLIC_BASE ?? "") + p;

/** A page inside the locale, with the trailing slash the static export uses. */
export const page = (locale: Locale, path = "") => `/${locale}/${path ? `${path.replace(/^\/|\/$/g, "")}/` : ""}`;

export const pick = (locale: Locale, x: L) => x[locale];

export const isLocale = (x: string): x is Locale => x === "en" || x === "ar";

/** A photo by its DZAC 4 number: the large file, or the small one for grids. */
export const photo = (id: string, size: "lg" | "sm" = "lg", set: "photos" | "workshop" = "photos") =>
  asset(`/media/${set}/${size === "sm" ? "sm/" : ""}${id}.webp`);
