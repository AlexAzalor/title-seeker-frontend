import { Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import { auth } from "@/auth";

import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthProvider from "@/components/providers/auth-provider";

import "../globals.css";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Header } from "@/components/knowledge-base/layout/header";

const sourceSans3 = Source_Sans_3({
  subsets: ["cyrillic", "latin"],
  variable: "--font-source-sans-3",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" className={sourceSans3.className}>
      <body
        className={`${sourceSans3.variable} ${sourceSans3.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen overflow-auto bg-gradient-to-l dark:from-slate-900 dark:via-slate-700 dark:to-slate-900">
              <div className="mx-auto flex h-screen flex-col overflow-auto">
                <header className="mt-4 mb-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Link
                      className="text-lg font-semibold"
                      href="/knowledge-base"
                    >
                      Konwledge Base
                    </Link>
                  </div>

                  <Link href="/knowledge-base">Home</Link>

                  <ThemeToggle />
                  <Header session={session} />
                </header>

                <main className="custom-scrollbar-portfolio mb-2 grid flex-1 grid-cols-1 gap-8 overflow-auto scroll-smooth">
                  {children}
                </main>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
