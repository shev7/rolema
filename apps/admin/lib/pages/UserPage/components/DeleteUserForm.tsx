"use client";

import { deleteUser } from "@actions/delete-user";

import { User } from "@repo/database";
import { useTranslation } from "@repo/i18n/hooks";
import { Box, Button, useToast } from "@repo/ui";
import { useMutation } from "@repo/utils";

export const DeleteUserForm = ({ userId }: { userId: User["id"] }) => {
  const { t } = useTranslation("common");

  const toast = useToast();

  const { isLoading, mutate } = useMutation(deleteUser, {
    onError: (error) => {
      toast.error({ title: error.message });
    },
  });

  return (
    <Box>
      <Button
        color="red"
        type="button"
        variant="outline"
        onClick={() => mutate({ id: userId })}
        loading={isLoading}
        disabled={isLoading}
      >
        {t("delete")}
      </Button>
    </Box>
  );
};
