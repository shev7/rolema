import { cache } from "react";
import { detectLanguage } from "./detectLanguage";
import { initServerI18next } from "./initServerI18next";

export const getServerTranslations = cache(
  async (namespace?: string, options?: Record<string, string>) => {
    const language = await detectLanguage();
    const i18nextInstance = await initServerI18next(language, namespace);

    return {
      t: i18nextInstance.getFixedT(language, namespace, options?.keyPrefix),
      i18n: i18nextInstance,
    };
  },
);
