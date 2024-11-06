"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useTranslation } from "@repo/i18n/hooks";
import { Button, Dialog, DialogProps, Flex, Form, useToast } from "@repo/ui";
import { Project } from "@repo/database";
import { useMutation } from "@repo/utils";
import { projectSchema, updateProjectSchema } from "@repo/validation";

import { updateProject } from "@actions/update-project";
import { ProjectForm } from "./ProjectForm";

const schema = updateProjectSchema.extend({
  id: projectSchema.shape.id,
});

export const UpdateProjectModal = ({
  project,
  ...props
}: DialogProps & { project: Project }) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const { t: adminT } = useTranslation("admin");

  const toast = useToast();

  const { isLoading, mutate } = useMutation(updateProject, {
    onError: (error) => {
      toast.error({ title: error.message });
    },
    onSuccess: () => {
      toast.success({ title: adminT("project successfully updated") });
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog {...props} onOpenChange={setOpen} open={open}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {t("edit")}
      </Button>

      <Dialog.Content>
        <Form
          onSubmit={mutate}
          schema={schema}
          defaultValues={{
            id: project.id,
            project: {
              name: project.name,
              description: project.description,
            },
          }}
        >
          <Dialog.Title>{adminT("edit project")}</Dialog.Title>

          <ProjectForm type="update" users={[]} tiers={[]} />

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                type="button"
                disabled={isLoading}
              >
                {t("cancel")}
              </Button>
            </Dialog.Close>
            <Button disabled={isLoading} loading={isLoading} type="submit">
              {t("save")}
            </Button>
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
