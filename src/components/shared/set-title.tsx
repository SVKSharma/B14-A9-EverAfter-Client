"use client";

import { useDocumentTitle } from "@/hooks/use-document-title";

/**
 * Renders nothing and sets the tab title for routes that cannot export
 * metadata, such as the 404 boundary. Use a page-level `metadata` export
 * everywhere else.
 */
export function SetTitle({ title }: { title: string }) {
  useDocumentTitle(title);
  return null;
}
