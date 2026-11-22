"use client";

import { useEffect } from "react";

/**
 * Puts a live count in the browser tab, e.g. `(3) Booking requests | EverAfter`.
 *
 * Next owns `document.title` through metadata, so this only prefixes the title
 * that is already there and restores it on unmount. It never renders anything.
 */
export function useTitleCount(count: number) {
  useEffect(() => {
    if (count <= 0) return;

    const base = document.title;
    // Strip an existing counter so re-runs do not stack `(2) (2) …`.
    const clean = base.replace(/^\(\d+\+?\)\s*/, "");
    const next = `(${count > 99 ? "99+" : count}) ${clean}`;
    document.title = next;

    return () => {
      if (document.title === next) document.title = base;
    };
  }, [count]);
}
