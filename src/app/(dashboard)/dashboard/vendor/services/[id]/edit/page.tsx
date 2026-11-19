import type { Metadata } from "next";
import { EditServiceLoader } from "@/components/dashboard/edit-service-loader";

export const metadata: Metadata = { title: "Edit Service" };

export default function EditServicePage() {
  return <EditServiceLoader />;
}
