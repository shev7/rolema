"use client";

import { useRouter } from "next/navigation";

import { useTranslation } from "@repo/i18n/hooks";
import {
  Button,
  Dialog,
  DialogProps,
  Flex,
  Form,
  GearIcon,
  IconButton,
  Select,
  useToast,
} from "@repo/ui";
import { useMutation, useOpen } from "@repo/utils";
import { updateProjectUser } from "@actions/updateProjectUser";
import {
  projectSchema,
  updateProjectUserSchema,
  userSchema,
} from "@repo/validation";
import { Project, ProjectRole, ProjectUser, User } from "@repo/database";
import constants from "@repo/constants";

import { deleteProjectUser } from "@actions/deleteProjectUser";
import { updateProjectUserStatus } from "@actions/updateProjectUserStatus";

const formUpdateProjectUserSchema = updateProjectUserSchema.extend({
  userId: userSchema.shape.id,
  projectId: projectSchema.shape.id,
});

export const EditProjectUserModal = ({
  currentProjectRoleId,
  projectRoles,
  userId,
  projectId,
  projectStatus,
  ...props
}: DialogProps & {
  currentProjectRoleId: ProjectUser["project_role_id"];
  projectRoles: ProjectRole[];
  userId: User["id"];
  projectId: Project["id"];
  projectStatus: ProjectUser["status"];
}) => {
  const router = useRouter();
  const [open, onOpen, onClose] = useOpen();

  const toast = useToast();

  const { t } = useTranslation();
  const { t: webT } = useTranslation("web");

  const { isLoading: isUpdateProjectUserLoading, mutate: onUpdate } =
    useMutation(updateProjectUser, {
      onError: (error) => {
        toast.error({ title: error.message });
      },
      onSuccess: () => {
        toast.success({ title: webT("user role successfully updated") });
        onClose();
        router.refresh();
      },
    });

  const { isLoading: isDeleteProjectUserLoading, mutate: onDelete } =
    useMutation(deleteProjectUser, {
      onSuccess: () => {
        toast.success({ title: t("successfully deleted") });
        onClose();
        router.push(constants.nav.routes.users({ projectId }));
      },
      onError: (error) => {
        toast.error({ title: error.message });
      },
    });

  const {
    isLoading: isUpdateProjectUserStatusLoading,
    mutate: onStatusUpdate,
  } = useMutation(updateProjectUserStatus, {
    onError: (error) => {
      toast.error({ title: error.message });
    },
    onSuccess: (data) => {
      toast.success({
        title: t(
          data.status === "blocked"
            ? "user successfully blocked"
            : "user successfully unblocked",
        ),
      });
      onClose();
      router.refresh();
    },
  });

  const isLoading =
    isUpdateProjectUserLoading ||
    isDeleteProjectUserLoading ||
    isUpdateProjectUserStatusLoading;

  return (
    <Dialog
      {...props}
      onOpenChange={(state) => {
        if (state) {
          onOpen();
        } else if (!isLoading) {
          onClose();
        }
      }}
      open={open}
    >
      <IconButton variant="ghost" onClick={onOpen}>
        <GearIcon />
      </IconButton>
      <Dialog.Content maxWidth="400px">
        <Form
          onSubmit={onUpdate}
          schema={formUpdateProjectUserSchema}
          defaultValues={{
            userId,
            projectId,
            project_role_id: currentProjectRoleId,
          }}
        >
          <Dialog.Title>{webT("edit user")}</Dialog.Title>

          <Select
            name="project_role_id"
            label={t("role")}
            placeholder={t("select a role")}
            options={projectRoles.map(({ id, name }) => ({
              id,
              title: name,
            }))}
          />

          <Flex gap="3" mt="4" justify="between">
            <Flex gap="3">
              {projectStatus !== "deleted" && (
                <Button
                  color="gray"
                  variant="outline"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={() => {
                    if (projectStatus === "blocked") {
                      onStatusUpdate({
                        status: "ready",
                        user_id: userId,
                        project_id: projectId,
                      });
                    } else if (projectStatus === "ready") {
                      onStatusUpdate({
                        status: "blocked",
                        user_id: userId,
                        project_id: projectId,
                      });
                    }
                  }}
                >
                  {t(projectStatus === "blocked" ? "unblock" : "block")}
                </Button>
              )}
              <Button
                color="red"
                variant="outline"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => onDelete({ projectId, userId })}
              >
                {t("delete")}
              </Button>
            </Flex>
            <Flex gap="3">
              <Dialog.Close>
                <Button
                  variant="soft"
                  color="gray"
                  type="button"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t("cancel")}
                </Button>
              </Dialog.Close>
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                {t("save")}
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
