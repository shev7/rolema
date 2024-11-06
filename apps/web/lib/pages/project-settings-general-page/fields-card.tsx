"use client";

import { useRouter } from "next/navigation";

import { updateProject } from "@actions/updateProject";
import { QueryProjectsReturnType } from "@repo/database";
import { useTranslation } from "@repo/i18n/hooks";
import {
  Card,
  Flex,
  Form,
  FormInput,
  SubmitButton,
  TextArea,
  useToast,
} from "@repo/ui";
import { useMutation } from "@repo/utils";
import { updateProjectSchema } from "@repo/validation";
import { Inset } from "@radix-ui/themes";

export const FieldsCard = ({
  project,
}: {
  project: NonNullable<QueryProjectsReturnType[number]>;
}) => {
  const { t } = useTranslation();
  const { t: webT } = useTranslation("web");

  const router = useRouter();

  const toast = useToast();

  const { isLoading, mutate } = useMutation(updateProject, {
    onSuccess: () => {
      toast.success({ title: webT("project successfully updated") });
      router.refresh();
    },
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Card style={{ width: "100%" }}>
      <Flex direction="column">
        <Form
          onSubmit={({ project: { name, description } }) => {
            if (project.status !== "ready") return;

            mutate({ id: project.id, name, description });
          }}
          schema={updateProjectSchema}
          defaultValues={{
            project: {
              name: project.name,
              description: project.description,
            },
          }}
        >
          <Flex direction="column" gap="4" maxWidth="400px" pb="4">
            <FormInput
              disabled={isLoading || project.status !== "ready"}
              label={t("name")}
              placeholder={t("name")}
              name="project.name"
              type="text"
            />
            <TextArea
              disabled={isLoading || project.status !== "ready"}
              label={t("description")}
              placeholder={t("description")}
              name="project.description"
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
                disabled={isLoading || project.status !== "ready"}
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
  );
};
