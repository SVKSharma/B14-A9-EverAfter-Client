export const SITE_NAME = "EverAfter";
export const SITE_TAGLINE = "Your day. Your dream. Your Ever After.";
export const SITE_DESCRIPTION =
  "Discover trusted wedding venues, photographers, florists, caterers, and stylists. Plan your perfect day with EverAfter.";

/**
 * Absolute base for canonical URLs and Open Graph images. Set
 * NEXT_PUBLIC_SITE_URL in deployment; the localhost fallback keeps dev/OG
 * previews working without touching `.env`.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  ""
);

export const THEME_COLOR = "#2E2A3A";
export const BACKGROUND_COLOR = "#F4F1EA";
