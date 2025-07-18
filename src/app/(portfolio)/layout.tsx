import "../globals.css";
import Image from "next/image";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Metadata } from "next";
import { Code, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { PortfolioNav } from "@/components/portfolio/portfolio-nav";
import { TelegramIcon } from "@/lib/portfolio/tech-icons";

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
    template: "%s | Alexandr Yablunovsky",
    default: "Alexandr Yablunovsky",
  },
};

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={sourceSans3.className}>
      <body
        className={`${sourceSans3.variable} ${sourceSans3.variable} antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <div className="mx-auto flex h-screen max-w-7xl flex-col overflow-auto">
                {/* Header with Theme Selector */}
                <header className="mt-4 mb-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Code className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-semibold">Portfolio</span>
                  </div>
                  <ThemeSelector />
                </header>

                {/* Tab Navigation */}
                <PortfolioNav />

                <main className="custom-scrollbar-portfolio mb-2 grid flex-1 grid-cols-1 gap-8 overflow-auto scroll-smooth lg:grid-cols-3">
                  {/* Left Card - Profile Info */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-0 mx-2 h-auto rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-md dark:border-slate-700/20 dark:bg-slate-800/90">
                      {/* Profile Image */}
                      <div className="mb-6 flex justify-center">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                          <Image
                            src="https://static.titleseeker.com/other/Me.webp"
                            width={112}
                            height={112}
                            alt="Me"
                            className="rounded-full"
                          />
                        </div>
                      </div>

                      {/* Name & Position */}
                      <div className="mb-6 text-center">
                        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
                          Alexandr Yablunovsky
                        </h1>
                        <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
                          Software Developer
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          Passionate Full Stack Developer with 3+ years of
                          experience, driven by a love for coding and a constant
                          desire to grow.
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                          <a
                            href="mailto:yablunovsky.a@gmail.com"
                            className="flex items-center gap-1 font-semibold hover:text-blue-600"
                          >
                            <Mail size={18} />
                            <span>yablunovsky.a@gmail.com</span>
                          </a>
                        </div>
                        {/* <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div> */}
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">Lviv, Ukraine</span>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="mb-6 flex justify-center gap-4">
                        <a
                          href="https://www.linkedin.com/in/alexandr-yablunovsky-9a459122a/"
                          target="_blank"
                          className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                          <Linkedin className="h-5 w-5 text-blue-600" />
                        </a>
                        <a
                          href="https://github.com/AlexAzalor"
                          target="_blank"
                          className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                          <Github className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                        </a>
                        <a
                          href="https://telegram.me/yablunovsky_alexandr"
                          target="_blank"
                          className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                          <TelegramIcon />
                        </a>
                      </div>

                      <div className="mb-6 text-center">
                        <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                          Languages
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          English (Intermediate)
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          Ukrainian (Native)
                        </p>
                      </div>

                      {/* Download CV Button */}
                      <a
                        href="https://static.titleseeker.com/other/Yablunovsky+Alexandr+CV+(red).pdf"
                        target="_blank"
                        download
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                      >
                        <Download className="h-4 w-4" />
                        Download CV
                      </a>
                    </div>
                  </div>
                  {children}
                </main>
              </div>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
