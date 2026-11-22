import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ServiceDetails } from "@/components/services/service-details";
import { ServiceDetailsSkeleton } from "@/components/shared/page-skeletons";
import { getServerSession } from "@/lib/auth-guard";
import { signInHref } from "@/lib/sign-in-link";

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
    <Suspense fallback={<ServiceDetailsSkeleton />}>
      <ServiceDetails id={id} signInHref={href} />
    </Suspense>
  );
}
