"use client";

import { Flex, FormInput, Select, TextArea } from "@repo/ui";

import {
  type QueryTiersReturnType,
  type QueryUsersReturnType,
} from "@repo/database";
import { useTranslation } from "@repo/i18n/hooks";
import constants from "@repo/constants";

export type ProjectFormProps = {
  users: QueryUsersReturnType;
  tiers: QueryTiersReturnType;
  type: "create" | "update";
};

export const ProjectForm = ({ users, type, tiers }: ProjectFormProps) => {
  const { t } = useTranslation("common");

  return (
    <Flex gap="4" direction="column">
      <FormInput
        label={t("name")}
        placeholder={t("name")}
        name="project.name"
        type="text"
        minLength={constants.database.project.name.minLength}
        maxLength={constants.database.project.name.maxLength}
      />
      <TextArea
        label={t("description")}
        placeholder={t("description")}
        name="project.description"
        minLength={constants.database.project.description.minLength}
        maxLength={constants.database.project.description.maxLength}
      />
      {type === "create" && (
        <>
          {users.length > 0 && (
            <Select
              name="project.owner_id"
              label={t("owner")}
              placeholder={t("select an owner")}
              options={users.map(({ id, email }) => ({ id, title: email }))}
            />
          )}
          <Flex gap="4" justify="between">
            <Select
              name="project_tier.tier_id"
              label={t("tier")}
              placeholder={t("select a tier")}
              options={tiers.map(({ id, name }) => ({ id, title: name }))}
              wrapperProps={{ flexGrow: "1" }}
              style={{ flex: 1 }}
            />
            <Select
              name="project_tier.duration"
              label={t("duration (days)")}
              placeholder={t("select a duration")}
              options={constants.database.tier.day_durations.map(
                (duration) => ({
                  id: duration,
                  title: duration,
                }),
              )}
              wrapperProps={{ flexGrow: "1" }}
              style={{ flex: 1 }}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
