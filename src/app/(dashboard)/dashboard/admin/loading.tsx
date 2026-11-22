import { OverviewSkeleton } from "@/components/shared/page-skeletons";

export default function Loading() {
  return (
    <OverviewSkeleton statCount={6} statColumns="xl:grid-cols-3" panels={0} banner />
  );
}
