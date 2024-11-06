import { CSSProperties } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Box, ThemeContext, ToastProvider } from "@repo/ui";
import { I18nextProvider, detectLanguage, dir } from "@repo/i18n";
import constants from "@repo/constants";

import { queryCurrentUser } from "@queries/query-current-user";

import "@radix-ui/themes/styles.css";
import { readCookie } from "@cookies/read";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Rolema web",
  description: "Role management startup",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const [language, currentUser] = await Promise.all([
    detectLanguage(),
    queryCurrentUser(),
  ]);
  const appearanceCookie = readCookie(constants.cookies.appearance);
  const appearance = appearanceCookie === "dark" ? "dark" : "light";

  return (
    <html lang={language} dir={dir(language)}>
      <body className={inter.variable}>
        <I18nextProvider language={language}>
          <ThemeContext
            appearance={appearance}
            panelBackground="solid"
            grayColor="gray"
            style={
              {
                backgroundColor: "var(--background-accent)",
                "--background-accent": "var(--gray-1)",
              } as CSSProperties
            }
            accentColor="blue"
          >
            <ToastProvider>
              <Box height="100vh" position="relative">
                <Box
                  style={{
                    paddingTop: currentUser ? "112px" : undefined,
                    maxHeight: "100%",
                    overflowY: "hidden",
                    display: "flex",
                    position: "relative",
                    height: "100vh",
                  }}
                >
                  <main
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      backgroundColor: "var(--gray-2)",
                    }}
                  >
                    {children}
                  </main>
                </Box>
              </Box>
            </ToastProvider>
          </ThemeContext>
        </I18nextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
