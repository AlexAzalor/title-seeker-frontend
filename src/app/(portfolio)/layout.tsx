import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";

const sourceSans3 = Source_Sans_3({
  subsets: ["cyrillic", "latin"],
  variable: "--font-source-sans-3",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

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
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
