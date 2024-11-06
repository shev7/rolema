"use client";

import React, { PropsWithChildren, ReactEventHandler } from "react";

import { Button, Flex, Form, Popover } from "@repo/ui";
import { useTranslation } from "@repo/i18n/hooks";
import { Project } from "@repo/database";
import { dayjs, formatDate } from "@repo/utils";

import { EventPopoverForm } from "./event-popover-form";
import { useCalendar } from "../calendar-context";

type ContentProps = {
  title: string;
  type?: "new";
  start_date: Date;
  end_date: Date;
  date?: string | Date;
  projectId: Project["id"];
  onClick: ReactEventHandler<HTMLButtonElement>;
  open: boolean;
  onClose: () => void;
};

export const EventPopover = (
  props: PropsWithChildren<Omit<ContentProps, "onClick">>,
) => {
  const { start_date, end_date, title, type, children, open, onClose } = props;

  const { t } = useTranslation();

  const { updateNewEvent } = useCalendar();

  const realStartDate = dayjs(start_date);
  const realEndDate = dayjs(end_date);

  const isMultiDay = !realStartDate.isSame(realEndDate, "day");

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        if (!value && type !== "new") {
          onClose();
        }
      }}
    >
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content
        side={isMultiDay ? "bottom" : "right"}
        align="center"
        width="440px"
        sticky="always"
        updatePositionStrategy="always"
      >
        <Flex direction="column" gap="4">
          <Form
            values={{
              start_date: formatDate(
                start_date,
                formatDate.Formats.DatetimeLocal,
              ),
              end_date: formatDate(end_date, formatDate.Formats.DatetimeLocal),
              title,
            }}
          >
            <EventPopoverForm {...props} />
          </Form>
          <Flex gap="4" justify="between" align="center">
            <Popover.Close>
              <Button
                variant="soft"
                color="gray"
                type="button"
                onClick={() => {
                  if (type === "new") {
                    updateNewEvent(undefined);
                  }

                  onClose();
                }}
              >
                {t("cancel")}
              </Button>
            </Popover.Close>
            <Button>{t("save")}</Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover>
  );
};
