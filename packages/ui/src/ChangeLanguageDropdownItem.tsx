"use client";

import { useTranslation, useChangeLanguage } from "@repo/i18n/hooks";
import { type Languages } from "@repo/i18n";
import { CheckIcon, DropdownMenu, Flex } from "@repo/ui";

import { FlagIcon } from "./flag-icon";

export const ChangeLanguageDropdownItem = ({
  language,
}: {
  language: Languages[number];
}) => {
  const { i18n } = useTranslation();
  const { onChangeLanguage } = useChangeLanguage();

  return (
    <DropdownMenu.Item
      onClick={() => onChangeLanguage(language)}
      disabled={i18n.resolvedLanguage === language}
    >
      <button type="submit" style={{ width: "100%" }}>
        <Flex gap="2" align="center" width="100%">
          <FlagIcon language={language} />
          <Flex gap="2" align="center">
            {language}
            {i18n.resolvedLanguage === language && <CheckIcon />}
          </Flex>
        </Flex>
      </button>
    </DropdownMenu.Item>
  );
};
