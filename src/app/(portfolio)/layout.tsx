import "../globals.css";
import { Source_Sans_3 } from "next/font/google";
import { Code } from "lucide-react";

import { ThemeProvider } from "@/components/providers/theme-provider";

import { PortfolioNav } from "@/components/portfolio/portfolio-nav";
import { ProfileCard } from "@/components/portfolio/profile-card";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const sourceSans3 = Source_Sans_3({
  subsets: ["cyrillic", "latin"],
  variable: "--font-source-sans-3",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Oleksandr Yablunovsky",
    default: "Oleksandr Yablunovsky",
  },
  openGraph: {
    type: "website",
    title: "Oleksandr Yablunovsky",
    description:
      "Passionate Full Stack Developer with 3+ years of experience, driven by a love for coding and a constant desire to grow.",
    url: "https://titleseeker.com/portfolio",
    siteName: "Oleksandr Yablunovsky",
    images: ["https://static.titleseeker.com/other/Me.webp"],
  },
};

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSans3.className}>
      <body
        className={`${sourceSans3.variable} ${sourceSans3.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="mx-auto flex h-screen max-w-7xl flex-col overflow-auto">
              <header className="mt-4 mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-semibold">Portfolio</span>
                </div>

                <ThemeToggle />
              </header>

              <PortfolioNav />

              <main className="custom-scrollbar-portfolio mb-2 grid flex-1 grid-cols-1 gap-8 overflow-auto scroll-smooth lg:grid-cols-3">
                <ProfileCard />

                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
