"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { registerTokenProvider } from "@/lib/api";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

let cachedToken: { value: string; expiresAt: number } | null = null;

function tokenExpiry(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function requestToken() {
  const response = await fetch("/api/auth/token", {
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { token?: string };
  return data.token ?? null;
}

registerTokenProvider(async ({ forceRefresh } = {}) => {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const token = await requestToken();
  cachedToken = token ? { value: token, expiresAt: tokenExpiry(token) - 30_000 } : null;
  return token;
});

export function resetTokenCache() {
  cachedToken = null;
}
