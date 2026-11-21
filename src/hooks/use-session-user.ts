"use client";

import { authClient } from "@/lib/auth-client";
import { toSessionUser } from "@/lib/session-user";
import type { SessionUser } from "@/types";

/**
 * Single swap point for authentication state.
 * Better Auth's session is mapped into the app's SessionUser shape.
 */
export function useSessionUser(): { user: SessionUser | null; isPending: boolean } {
  const { data, isPending } = authClient.useSession();

  return {
    user: data?.user ? toSessionUser(data.user as Parameters<typeof toSessionUser>[0]) : null,
    isPending,
  };
}
