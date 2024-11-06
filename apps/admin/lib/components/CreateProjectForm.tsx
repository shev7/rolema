"use client";

import { Button, Flex, Form, useToast } from "@repo/ui";
import { useMutation } from "@repo/utils";
import { createProjectSchema } from "@repo/validation";
import constants from "@repo/constants";

import { createProject } from "@actions/create-project";
import { useTranslation } from "@repo/i18n/hooks";

import { ProjectForm, ProjectFormProps } from "./ProjectForm";

export type CreateProjectFormProps = Pick<ProjectFormProps, "users" | "tiers">;

export const CreateProjectForm = (props: CreateProjectFormProps) => {
  const { t } = useTranslation("common");

  const toast = useToast();

  const { isLoading, mutate } = useMutation(createProject, {
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Form
      onSubmit={mutate}
      schema={createProjectSchema}
      defaultValues={{
        project: {
          name: "",
          description: "",
          owner_id: props.users.length === 1 ? props.users[0]!.id : "",
        },
        project_tier: {
          tier_id: props.tiers.length > 1 ? "" : props.tiers[0]?.id,
          duration: constants.database.tier.day_durations[0],
        },
      }}
      style={{ width: "30rem" }}
    >
      <Flex gap="4" width="30rem" direction="column">
        <ProjectForm type="create" {...props} />
        <Button
          variant="surface"
          type="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          {t("create")}
        </Button>
      </Flex>
    </Form>
  );
};
