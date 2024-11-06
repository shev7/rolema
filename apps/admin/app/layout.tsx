import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeContext, ToastProvider } from "@repo/ui";
import { detectLanguage, dir, I18nextProvider } from "@repo/i18n";

import { Header } from "@components/Header";

import "@radix-ui/themes/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rolema admin",
  description: "MM startup",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const language = await detectLanguage();

  return (
    <html lang={language} dir={dir(language)}>
      <body className={inter.className}>
        <I18nextProvider language={language}>
          <ThemeContext>
            <ToastProvider>
              <Header />
              {children}
            </ToastProvider>
          </ThemeContext>
        </I18nextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
