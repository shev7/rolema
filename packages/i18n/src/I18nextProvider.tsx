"use client";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import React, { ReactNode, useMemo } from "react";
import { I18nextProvider as Provider, initReactI18next } from "react-i18next";

import constants from "@repo/constants";

import { getOptions, Languages } from "./settings";

interface I18nProviderProps {
  children: ReactNode;
  language: Languages[number];
}

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    detection: {
      caches: ["cookie"],
      lookupCookie: constants.cookies.language,
      cookieMinutes: constants.cookies.lifetimes.language,
    },
  });

export const I18nextProvider = ({ children, language }: I18nProviderProps) => {
  useMemo(() => {
    i18next.changeLanguage(language);
  }, []);

  return <Provider i18n={i18next}>{children}</Provider>;
};
