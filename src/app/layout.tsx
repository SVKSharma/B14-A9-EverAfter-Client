import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EverAfter — Wedding Services Marketplace",
    template: "%s | EverAfter",
  },
  description:
    "Discover trusted wedding venues, photographers, florists, caterers, and stylists. Plan your perfect day with EverAfter.",
  keywords: [
    "wedding services",
    "wedding vendors",
    "wedding planning",
    "wedding venue",
    "wedding photographer",
  ],
  openGraph: {
    title: "EverAfter — Wedding Services Marketplace",
    description:
      "Your day. Your dream. Your Ever After. Discover trusted wedding services and book them in one place.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <TooltipProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
