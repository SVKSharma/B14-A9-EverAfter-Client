import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-guard";
import { ROLE_LABELS } from "@/lib/constants";
import { toSessionUser } from "@/lib/session-user";
import { redirect } from "next/navigation";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?redirect=/dashboard/profile");

  const user = toSessionUser(session.user as Parameters<typeof toSessionUser>[0]);

  const rows = [
    { label: "Full name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Role", value: ROLE_LABELS[user.role] },
    ...(user.role === "vendor"
      ? [
          { label: "Business name", value: user.businessName ?? "Not set yet" },
          { label: "Plan", value: user.subscriptionPlan === "premium" ? "Premium" : "Free" },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The details tied to your EverAfter account.
        </p>
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-2xl">Account details</CardTitle>
              <CardDescription>Read-only until profile editing lands.</CardDescription>
            </div>
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border/70">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-3">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-sm font-medium sm:col-span-2">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
            Editing name, photo and business details arrives with the profile settings phase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
