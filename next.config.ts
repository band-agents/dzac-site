import type { NextConfig } from "next";

/* Static export: the site is plain files, so it previews on GitHub Pages and
   runs on any static host until the registration backend joins it.
   NEXT_BASE_PATH is set only for a sub-path host such as GitHub Pages. */
const base = process.env.NEXT_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(base ? { basePath: base } : {}),
  env: { NEXT_PUBLIC_BASE: base },
  reactStrictMode: true,
};

export default config;
