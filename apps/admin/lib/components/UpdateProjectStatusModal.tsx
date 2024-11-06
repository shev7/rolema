"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { useTranslation } from "@repo/i18n/hooks";
import {
  Button,
  Dialog,
  DialogProps,
  Flex,
  Form,
  Pencil2Icon,
  IconButton,
  useToast,
} from "@repo/ui";
import { Project } from "@repo/database";
import { useMutation } from "@repo/utils";
import { projectSchema, updateProjectStatusSchema } from "@repo/validation";

import { updateProjectStatus } from "@actions/update-project-status";

import { ProjectStatusCards } from "./ProjectStatusCards";

export const UpdateProjectStatusModal = ({
  status,
  id,
  ...props
}: DialogProps & { status: Project["status"]; id: Project["id"] }) => {
  const router = useRouter();
  const toast = useToast();

  const [open, setOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const { t: adminT } = useTranslation("admin");

  const { isLoading, mutate } = useMutation(updateProjectStatus, {
    onError: (error) => {
      toast.error({ title: error.message ?? t("something went wrong") });
    },
    onSuccess: () => {
      toast.error({ title: adminT("status successfully updated") });
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog {...props} onOpenChange={setOpen} open={open}>
      <IconButton
        variant="ghost"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Pencil2Icon />
      </IconButton>
      <Dialog.Content maxWidth="400px">
        <Form
          onSubmit={mutate}
          schema={updateProjectStatusSchema.extend({
            id: projectSchema.shape.id,
          })}
          defaultValues={{
            id,
            status: status as Exclude<Project["status"], "pending">,
          }}
        >
          <Dialog.Title>{adminT("edit status")}</Dialog.Title>
          <ProjectStatusCards />
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
