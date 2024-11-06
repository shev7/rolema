"use client";

import { QueryProjectsReturnType } from "@repo/database";
import { useTranslation } from "@repo/i18n/hooks";
import { Button, Dialog, Flex, Typography } from "@repo/ui";
import { useOpen } from "@repo/utils";

export const ProjectPausedModal = ({
  project,
}: {
  project: NonNullable<QueryProjectsReturnType[number]>;
}) => {
  const { t } = useTranslation();

  const [open, _onOpen, _onClose, onOpenChange] = useOpen(
    project.status !== "ready",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button>{t("renew")}</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{t("project status")}</Dialog.Title>

        <Flex gap="3" mt="3" justify="between" direction="column">
          <Typography>
            <Typography color="red">{t("project is on hold")}.</Typography>
            &nbsp;
            <Typography>{t("renew your subscription")}</Typography>
          </Typography>
          <Flex gap="3" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button">
                {t("cancel")}
              </Button>
            </Dialog.Close>
            <Button type="submit">{t("renew")}</Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog>
  );
};
