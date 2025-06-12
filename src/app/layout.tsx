import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/main-layout";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthProvider from "@/components/providers/auth-provider";
// import { Toaster } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
// import { after } from "next/server";

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
    template:
      "%s | Title Seeker - дозволяє швидко і якісно знайти бажаний тайтл!",
    default: "Title Seeker - дозволяє швидко і якісно знайти бажаний тайтл!",
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
    images: ["https://static.titleseeker.com/other/title-seeker-logo.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Secondary task
  // after(() => {
  //   console.log("TEST AFTER");
  // });

  return (
    <html lang={locale} className={sourceSans3.className}>
      <body
      // className="!pointer-events-auto !cursor-auto"
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <SidebarProvider defaultOpen={false}>
                <MainLayout>
                  <AppSidebar />
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
