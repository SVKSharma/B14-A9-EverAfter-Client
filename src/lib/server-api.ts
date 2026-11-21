import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getApiUrl } from "@/lib/api";

async function getJson(path: string) {
  const incoming = await headers();
  const outgoing: Record<string, string> = { accept: "application/json" };

  try {
    const { token } = await auth.api.getToken({ headers: incoming });
    if (token) outgoing.authorization = `Bearer ${token}`;
  } catch {
    return null;
  }

  try {
    const response = await fetch(getApiUrl(path), { headers: outgoing, cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function serverApiFetch<T>(path: string): Promise<T | null> {
  const payload = await getJson(path);
  return (payload?.data ?? null) as T | null;
}

export async function serverApiFetchMeta<T>(
  path: string
): Promise<{ data: T; meta?: Record<string, unknown> } | null> {
  const payload = await getJson(path);
  if (!payload) return null;
  return { data: payload.data as T, meta: payload.meta };
}
