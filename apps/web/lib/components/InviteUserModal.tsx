"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useTranslation } from "@repo/i18n/hooks";
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  type DialogProps,
  Flex,
  Form,
  FormInput,
  Select,
  useToast,
} from "@repo/ui";
import { useMutation } from "@repo/utils";
import { Project, ProjectRole } from "@repo/database";
import constants from "@repo/constants";
import { inviteUserToProjectSchema } from "@repo/validation";

import { inviteUser } from "@actions/inviteUser";

export type InviteUserModalProps = DialogProps & {
  projectId: Project["id"];
  buttonProps?: ButtonProps;
  projectRoles: Array<Pick<ProjectRole, "id" | "name">>;
};

export const InviteUserModal = ({
  projectId,
  buttonProps,
  projectRoles,
  ...props
}: InviteUserModalProps) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const { t: webT } = useTranslation("web");

  const toast = useToast();

  const { isLoading, mutate } = useMutation(inviteUser, {
    onError: (error) => {
      toast.error({ title: error.message });
    },
    onSuccess: (data) => {
      setOpen(false);
      toast.success({ title: webT("invitation email sent successfully") });
      router.push(constants.nav.routes.projectUser(projectId, data.id));
      router.refresh();
    },
  });

  return (
    <Dialog {...props} onOpenChange={setOpen} open={open}>
      <Box>
        <Button
          style={{ width: "100%" }}
          onClick={() => setOpen(true)}
          variant="outline"
          {...buttonProps}
        >
          {webT("invite")}
        </Button>
      </Box>

      <Dialog.Content maxWidth="400px">
        <Form
          onSubmit={mutate}
          schema={inviteUserToProjectSchema}
          defaultValues={{
            email: "",
            project_id: projectId,
            project_role_id:
              projectRoles.length === 1 ? projectRoles[0]!.id : "",
          }}
        >
          <Dialog.Title mb="5">{t("invite a new user")}</Dialog.Title>

          <FormInput
            label={t("email")}
            placeholder={t("email")}
            name="email"
            type="email"
            maxLength={constants.database.user.email.maxLength}
            mb="4"
          />

          <Select
            name="project_role_id"
            label={t("role")}
            placeholder={t("select a role")}
            options={projectRoles.map(({ id, name }) => ({
              id,
              title: name,
            }))}
          />

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
            <Button disabled={isLoading} loading={isLoading} type="submit">
              {t("create")}
            </Button>
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
