import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { getServerSession } from "@/lib/auth-guard";
import { serverApiFetch } from "@/lib/server-api";
import { toSessionUser } from "@/lib/session-user";
import type { ProfileUser } from "@/types";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?redirect=/dashboard/profile");

  const fallbackUser = toSessionUser(session.user as Parameters<typeof toSessionUser>[0]);

  const fallback: ProfileUser = {
    ...fallbackUser,
    businessName: fallbackUser.businessName ?? null,
    subscriptionPlan: fallbackUser.subscriptionPlan ?? "free",
    subscriptionExpiresAt: null,
    createdAt: null,
  };

  // The profile is served by Express so the form edits the same record the
  // rest of the API reads, not the Better Auth session snapshot.
  const user = (await serverApiFetch<ProfileUser>("/users/me")) ?? fallback;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The details tied to your EverAfter account.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
