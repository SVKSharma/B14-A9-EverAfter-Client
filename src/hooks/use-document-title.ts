"use client";

import { useEffect } from "react";
import { SITE_NAME } from "@/lib/site";

/**
 * Rewrites the tab title once a page has loaded a record, e.g.
 * `The Rosewood Estate | EverAfter`. Next owns `document.title` through
 * metadata, so the previous value is restored on unmount. Renders nothing.
 */
export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    if (!title) return;

    const previous = document.title;
    const next = `${title} | ${SITE_NAME}`;
    document.title = next;

    return () => {
      // A navigation may already have written the new page's title. Only undo
      // our own change so we never leave the tab showing a stale route.
      if (document.title === next) document.title = previous;
    };
  }, [title]);
}
