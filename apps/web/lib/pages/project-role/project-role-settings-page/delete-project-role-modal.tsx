"use client";

import { useParams, useRouter } from "next/navigation";

import { useTranslation } from "@repo/i18n/hooks";
import {
  Button,
  Dialog,
  type DialogProps,
  Flex,
  Form,
  useToast,
  Select,
  Typography,
} from "@repo/ui";
import { useMutation, useOpen } from "@repo/utils";
import constants from "@repo/constants";
import { ProjectRole } from "@repo/database";
import { deleteProjectRoleSchema } from "@repo/validation";

import { deleteProjectRole } from "@actions/deleteProjectRole";

type DeleteProjectRoleDialog = DialogProps & {
  roles: ProjectRole[];
  usersCount: number;
  projectId: ProjectRole["project_id"];
};

export const DeleteProjectRoleModal = ({
  roles,
  usersCount,
  projectId,
  ...props
}: DeleteProjectRoleDialog) => {
  const { projectRoleId } = useParams<{ projectRoleId: ProjectRole["id"] }>();
  const [open, onOpen, onClose, onOpenChange] = useOpen();
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();
  const { t: webT } = useTranslation("web");
  const hasUsers = Boolean(usersCount);

  const { isLoading, mutate } = useMutation(deleteProjectRole, {
    onSuccess: () => {
      onClose();
      toast.success({ title: webT("role successfully deleted") });
      router.push(constants.nav.routes.projectRoles(projectId));
      router.refresh();
    },
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Dialog {...props} onOpenChange={onOpenChange} open={open}>
      {roles.length > 0 ? (
        <Button
          type="button"
          style={{ width: "fit-content" }}
          onClick={onOpen}
          color="red"
          variant="outline"
        >
          {t("delete")}
        </Button>
      ) : (
        <div />
      )}

      <Dialog.Content maxWidth="400px">
        <Form
          schema={hasUsers ? deleteProjectRoleSchema : undefined}
          defaultValues={
            hasUsers ? { fallback_role_id: roles[0]?.id ?? "" } : undefined
          }
          onSubmit={({ fallback_role_id }) =>
            mutate({ projectRoleId, fallbackRoleId: fallback_role_id })
          }
        >
          <Dialog.Title mb="5">{webT("delete role")}</Dialog.Title>

          {Boolean(usersCount) ? (
            <Select
              name="fallback_role_id"
              label={webT("fallback role")}
              placeholder={webT("select a fallback role")}
              options={roles.map(({ id, name }) => ({ id, title: name }))}
              wrapperProps={{ flexGrow: "1" }}
            />
          ) : (
            <Typography>{t("are you sure you want to proceed")}</Typography>
          )}

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
            <Button
              disabled={isLoading}
              loading={isLoading}
              type="submit"
              color="red"
            >
              {t("delete")}
            </Button>
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
