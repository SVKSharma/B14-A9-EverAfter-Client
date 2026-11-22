import type { MetadataRoute } from "next";
import { BACKGROUND_COLOR, SITE_DESCRIPTION, SITE_NAME, THEME_COLOR } from "@/lib/site";

/**
 * Served at /manifest.webmanifest. Icons are the same files Next picks up from
 * `src/app/icon.png` and `src/app/apple-icon.png`, so there is one source of
 * truth for the brand mark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Wedding Services Marketplace`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: "/icon.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
