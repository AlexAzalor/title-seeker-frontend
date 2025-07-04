import dynamic from "next/dynamic";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Source_Sans_3 } from "next/font/google";

import { MainLayout } from "@/components/layout/main-layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthProvider from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

// import Script from "next/script";
import "./globals.css";
import type { Metadata } from "next";

// import { after } from "next/server";

const AppSidebar = dynamic(
  () => import("@/components/layout/sidebar/app-sidebar"),
);

const sourceSans3 = Source_Sans_3({
  subsets: ["cyrillic", "latin"],
  variable: "--font-source-sans-3",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  keywords: [
    "фільм",
    "фільми",
    "пошук фільмів",
    "тайтл",
    "тайтли",
    "пошук тайтлів",
    "оцінювати фільми",
    "оцінювати тайтли",
  ],
  title: {
    template:
      "%s | Title Seeker - дозволяє швидко і якісно знайти бажаний тайтл!",
    default: "Title Seeker - дозволяє швидко і якісно знайти бажаний тайтл!",
  },
  alternates: {
    canonical: "https://titleseeker.com/",
  },
  description:
    "Платформа, де ви можете шукати тайтли за допомогою багатьох фільтрів, оцінювати їх, переглядати статистику та багато іншого!",
  metadataBase: new URL("https://titleseeker.com"),
  openGraph: {
    type: "website",
    title: "Title Seeker",
    description:
      "Платформа, де ви можете шукати тайтли за допомогою багатьох фільтрів, оцінювати їх, переглядати статистику та багато іншого!",
    url: "https://titleseeker.com",
    siteName: "Title Seeker",
    images: ["https://static.titleseeker.com/other/title-seeker-logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  // Secondary task
  // after(() => {
  //   console.log("TEST AFTER");
  // });

  return (
    <html lang={locale} className={sourceSans3.className}>
      <body
        className={`${sourceSans3.variable} ${sourceSans3.variable} antialiased`}
      >
        {/* <Script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <SidebarProvider defaultOpen={false}>
                <MainLayout>
                  <AppSidebar locale={locale} />
                  {children}
                </MainLayout>
              </SidebarProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
