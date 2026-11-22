import { OverviewSkeleton } from "@/components/shared/page-skeletons";

export default function Loading() {
  return <OverviewSkeleton statCount={4} panels={0} banner />;
}
