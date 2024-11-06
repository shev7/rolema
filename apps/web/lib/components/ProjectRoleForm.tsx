"use client";

import { Flex, FormInput } from "@repo/ui";

import { useTranslation } from "@repo/i18n/hooks";
import constants from "@repo/constants";

export const ProjectRoleForm = () => {
  const { t } = useTranslation("common");

  return (
    <Flex gap="4" direction="column">
      <FormInput
        label={t("name")}
        placeholder={t("name")}
        name="name"
        type="text"
        minLength={constants.database.project_role.name.minLength}
        maxLength={constants.database.project_role.name.maxLength}
      />
    </Flex>
  );
};
