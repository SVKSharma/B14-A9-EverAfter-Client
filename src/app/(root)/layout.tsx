import { Suspense } from "react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

function NavbarFallback() {
  return (
    <div
      aria-hidden="true"
      className="sticky top-0 z-50 h-20 border-b border-border bg-background"
    />
  );
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/*
       * The navbar reads usePathname() for active links. With Cache Components,
       * runtime URL data must sit inside a Suspense boundary.
       */}
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
