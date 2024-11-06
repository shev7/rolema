import { Languages, getOptions } from "../settings";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";

export const initServerI18next = async (
  language: Languages[number],
  nameSpace?: string,
) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, nameSpace: string) =>
          import(`../../locales/${language}/${nameSpace}.json`),
      ),
    )
    .init(getOptions(language, nameSpace));
  return i18nInstance;
};
