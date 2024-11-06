"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createProjectRole } from "@actions/createProjectRole";

import { useTranslation } from "@repo/i18n/hooks";
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  type DialogProps,
  Flex,
  Form,
  SubmitButton,
  useToast,
} from "@repo/ui";
import { useMutation } from "@repo/utils";
import { Project } from "@repo/database";
import { createProjectRoleSchema } from "@repo/validation";
import constants from "@repo/constants";

import { ProjectRoleForm } from "./ProjectRoleForm";

export const CreateProjectRoleModal = ({
  projectId,
  buttonProps,
  ...props
}: DialogProps & { projectId: Project["id"]; buttonProps?: ButtonProps }) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const { t: webT } = useTranslation("web");

  const toast = useToast();

  const { isLoading, mutate } = useMutation(createProjectRole, {
    onError: (error) => {
      toast.error({ title: error.message });
    },
    onSuccess: (data) => {
      setOpen(false);
      toast.success({ title: webT("role successfully created") });
      router.push(
        constants.nav.routes.projectRolePermissions(data.id, projectId),
      );
    },
  });

  return (
    <Dialog {...props} onOpenChange={setOpen} open={open}>
      <Box>
        <Button
          style={{ width: "100%" }}
          onClick={() => {
            setOpen(true);
          }}
          {...buttonProps}
        >
          {webT("create a new role")}
        </Button>
      </Box>

      <Dialog.Content maxWidth="400px">
        <Form
          onSubmit={mutate}
          schema={createProjectRoleSchema}
          defaultValues={{
            project_id: projectId,
            name: "",
          }}
        >
          <Dialog.Title mb="5">{webT("create a new role")}</Dialog.Title>

          <ProjectRoleForm />

          <Flex gap="3" mt="6" justify="end">
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
            <SubmitButton
              disabled={isLoading}
              loading={isLoading}
              type="submit"
            >
              {t("create")}
            </SubmitButton>
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
