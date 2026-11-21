import { headers } from "next/headers";
import { safeRedirectPath } from "@/lib/redirect";

export async function signInHref(fallbackPath: string): Promise<string> {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? fallbackPath;
  const search = headerList.get("x-search") ?? "";
  const target = safeRedirectPath(`${pathname}${search}`) ?? fallbackPath;

  return `/sign-in?redirect=${encodeURIComponent(target)}`;
}
