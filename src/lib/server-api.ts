import { headers } from "next/headers";
import { getApiUrl } from "@/lib/api";

/**
 * Server-side call to the Express API, forwarding the incoming cookie so the
 * API can validate the Better Auth session. Used by dashboard pages that want
 * data on first paint instead of a client-side fetch.
 */
export async function serverApiFetch<T>(path: string): Promise<T | null> {
  const incoming = await headers();

  try {
    const response = await fetch(getApiUrl(path), {
      headers: { cookie: incoming.get("cookie") ?? "", accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return (payload?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

export async function serverApiFetchMeta<T>(
  path: string
): Promise<{ data: T; meta?: Record<string, unknown> } | null> {
  const incoming = await headers();

  try {
    const response = await fetch(getApiUrl(path), {
      headers: { cookie: incoming.get("cookie") ?? "", accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return { data: payload?.data as T, meta: payload?.meta };
  } catch {
    return null;
  }
}
