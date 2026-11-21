import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const AUTH_PAGES = ["/sign-in", "/sign-up"];

const SERVICE_DETAILS = /^\/services\/[^/]+\/?$/;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (!hasSessionCookie && (pathname.startsWith("/dashboard") || SERVICE_DETAILS.test(pathname))) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (AUTH_PAGES.includes(pathname) && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  headers.set("x-search", search);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:path*", "/sign-in", "/sign-up"],
};
