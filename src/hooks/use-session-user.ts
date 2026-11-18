"use client";

import type { Role } from "@/types";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  businessName?: string | null;
}

/**
 * Single swap point for authentication state.
 * TODO(auth-phase): replace the placeholder body with Better Auth's useSession()
 * and map its user into SessionUser. Everything else consumes this hook.
 */
export function useSessionUser(): { user: SessionUser | null; isPending: boolean } {
  return { user: null, isPending: false };
}
