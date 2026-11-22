"use client";

import "./globals.css";

/**
 * Last-resort boundary: replaces the root layout when it fails, so it has to
 * ship its own <html>/<body> and pull in the stylesheet itself.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full items-center justify-center bg-background px-5 py-16 font-sans text-foreground">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-destructive/25 bg-card/80 p-9 text-center shadow-(--shadow-lift)">
          <p className="eyebrow text-primary">EverAfter</p>
          <h1 className="mt-4 font-heading text-[1.8rem] leading-tight tracking-tight">
            The site could not start
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Something failed before this page could render. Reloading usually clears it.
          </p>
          {error.digest ? (
            <p className="mt-4 inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[0.62rem] text-muted-foreground">
              Reference {error.digest}
            </p>
          ) : null}
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
