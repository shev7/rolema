"use client";

import { useRouter } from "next/navigation";

import { Permission, ProjectRole } from "@repo/database";
import { useTranslation } from "@repo/i18n/hooks";
import {
  Card,
  Flex,
  Form,
  MultiSelect,
  SubmitButton,
  useToast,
} from "@repo/ui";
import { getPermissionValues, useMutation } from "@repo/utils";

import { Inset } from "@radix-ui/themes";

import { updateProjectRolePermissions } from "@actions/update-project-role-permissions";

export const Content = ({
  permissions,
  projectRole,
  projectRoles,
}: {
  permissions: Array<Permission>;
  projectRole: ProjectRole;
  projectRoles: Array<ProjectRole>;
}) => {
  const { t } = useTranslation();

  const toast = useToast();
  const router = useRouter();

  const { isLoading, mutate } = useMutation(updateProjectRolePermissions, {
    onSuccess: () => {
      toast.success({ title: t("permissions successfully updated") });
      router.refresh();
    },
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Card>
      <Form
        onSubmit={({ read, invite }) => {
          type Permissions = Parameters<
            typeof updateProjectRolePermissions
          >[0]["permissions"];

          mutate({
            id: projectRole.id,
            permissions: [
              ...(read.map((x) =>
                (x as string) === "all"
                  ? { key: "role:read", project_id: projectRole.project_id }
                  : { key: "role:read", project_role_id: x },
              ) as Permissions),
              ...(invite.map((x) =>
                (x as string) === "all"
                  ? { key: "role:invite", project_id: projectRole.project_id }
                  : { key: "role:invite", project_role_id: x },
              ) as Permissions),
            ],
          });
        }}
        defaultValues={{
          read: getPermissionValues(permissions, "role:read").map(
            (permission) =>
              permission.project_id ? "all" : permission.project_role_id,
          ),
          invite: getPermissionValues(permissions, "role:invite").map(
            (permission) =>
              permission.project_id ? "all" : permission.project_role_id,
          ),
        }}
      >
        <Flex gap="4" direction="column" mb="5">
          <MultiSelect
            name="read"
            label={t("read roles")}
            placeholder={t("select a role")}
            description={t(
              "users of this role would be able to read users data from the following roles",
            )}
            wrapperProps={{
              style: {
                minWidth: "100px",
                maxWidth: "320px",
                padding: "6px 12px",
                height: "unset",
              },
            }}
            options={[
              {
                id: "all",
                title: t("all roles"),
                separator: true,
              },
              ...projectRoles.map(({ id, name }) => ({ id, title: name })),
            ]}
            onBeforeChange={(oldValues, value) => {
              if (value === "all") {
                return oldValues[0] === value ? [] : ["all"];
              }

              if (oldValues.find((x) => x === value)) {
                const newValues = oldValues.filter(
                  (x) => x !== value && x !== "all",
                );

                return newValues;
              }

              const newValues = [
                ...oldValues.filter((x) => x !== "all"),
                value,
              ];

              return newValues;
            }}
          />
          <MultiSelect
            name="invite"
            label={t("invite users")}
            placeholder={t("select a role")}
            description={t(
              "users of this role would be able to invite users to the following roles",
            )}
            wrapperProps={{
              style: {
                minWidth: "100px",
                maxWidth: "320px",
                height: "unset",
              },
            }}
            options={[
              {
                id: "all",
                title: t("all roles"),
                separator: true,
              },
              ...projectRoles.map(({ id, name }) => ({ id, title: name })),
            ]}
            onBeforeChange={(oldValues, value) => {
              if (value === "all") {
                return oldValues[0] === value ? [] : ["all"];
              }

              if (oldValues.find((x) => x === value)) {
                const newValues = oldValues.filter(
                  (x) => x !== value && x !== "all",
                );

                return newValues;
              }

              const newValues = [
                ...oldValues.filter((x) => x !== "all"),
                value,
              ];

              return newValues;
            }}
          />
        </Flex>
        <Inset side="bottom">
          <Flex
            justify="end"
            px="5"
            py="4"
            data-is-root-theme="true"
            style={{
              boxShadow: "inset 0 1px 0 0 var(--gray-a5)",
            }}
          >
            <SubmitButton
              disabled={isLoading}
              loading={isLoading}
              type="submit"
            >
              {t("save")}
            </SubmitButton>
          </Flex>
        </Inset>
      </Form>
    </Card>
  );
};
