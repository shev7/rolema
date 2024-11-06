"use client";

import { ProjectRole } from "@repo/database";

import { useRouter } from "next/navigation";

import { useTranslation } from "@repo/i18n/hooks";
import { Card, Flex, Form, SubmitButton, useToast } from "@repo/ui";
import { useMutation } from "@repo/utils";
import { updateProjectRoleSchema } from "@repo/validation";

import { Inset } from "@radix-ui/themes";
import { ProjectRoleForm } from "@components/ProjectRoleForm";
import { updateProjectRole } from "@actions/updateProjectRole";
import { Slide } from "@components/slide";

export const ProjectRoleNameForm = ({
  projectRole,
}: {
  projectRole: ProjectRole;
}) => {
  const { t } = useTranslation();
  const { t: webT } = useTranslation("web");

  const router = useRouter();

  const toast = useToast();

  const { isLoading, mutate } = useMutation(updateProjectRole, {
    onSuccess: () => {
      toast.success({ title: webT("role successfully updated") });
      router.refresh();
    },
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Slide duration={300} direction="right">
      <Card style={{ width: "100%" }}>
        <Flex direction="column">
          <Form
            onSubmit={(values) => mutate({ id: projectRole.id, ...values })}
            schema={updateProjectRoleSchema}
            defaultValues={{ name: projectRole.name }}
          >
            <Flex direction="column" gap="4" maxWidth="400px" pb="4">
              <ProjectRoleForm />
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
        </Flex>
      </Card>
    </Slide>
  );
};
