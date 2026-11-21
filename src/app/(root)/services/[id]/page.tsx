import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ServiceDetails } from "@/components/services/service-details";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerSession } from "@/lib/auth-guard";
import { signInHref } from "@/lib/sign-in-link";

function DetailsFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Skeleton className="h-4 w-40" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="aspect-4/3 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export const metadata = { title: "Service Details" };

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();
  const href = await signInHref(`/services/${id}`);

  if (!session) {
    redirect(href);
  }

  if (session.user && (session.user as { isBlocked?: boolean }).isBlocked) {
    redirect("/sign-in?blocked=1");
  }

  return (
    <Suspense fallback={<DetailsFallback />}>
      <ServiceDetails id={id} signInHref={href} />
    </Suspense>
  );
}
