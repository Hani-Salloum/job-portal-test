import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Tajawal } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/components/locale-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { isLocale, type Locale } from "@/lib/i18n";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
const arabic = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "Test Company",
  description: "A job portal system test",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const routeHeaders = await headers();
  const requestedLocale = routeHeaders.get("x-route-locale");
  const locale: Locale = isLocale(requestedLocale) ? requestedLocale : "en";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} ${arabic.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <LocaleProvider locale={locale}>
            {children}
            <Toaster richColors position={locale === "ar" ? "top-left" : "top-right"} />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
