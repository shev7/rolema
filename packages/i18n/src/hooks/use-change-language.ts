import { useCallback } from "react";

import { useRouter } from "next/navigation";
import i18next from "i18next";
import { useTranslation } from "next-i18next";

import { Languages } from "../settings";
import { languages } from "../constants";

export const useChangeLanguage = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const currentLanguage =
    (i18n.resolvedLanguage as (typeof languages)[number]) ?? "en";

  const onChangeLanguage = useCallback(
    (language: Languages[number]) => {
      if (currentLanguage === language) {
        return;
      }

      i18next.changeLanguage(language);
      router.refresh();
    },
    [currentLanguage],
  );

  return { onChangeLanguage };
};
