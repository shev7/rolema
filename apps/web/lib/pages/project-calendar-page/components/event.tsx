"use client";

import { Button, Flex, Form, FormInput, Popover, Typography } from "@repo/ui";
import { dayjs, useOpen } from "@repo/utils";

import constants from "./constants";
import { useTranslation } from "@repo/i18n/hooks";
import { useCalendar } from "./calendar-context";
import React, { ReactEventHandler } from "react";

type ContentProps = {
  title: string;
  type?: "new";
  start_date: Date;
  end_date: Date;
  date?: string | Date;
  onClick: ReactEventHandler<HTMLButtonElement>;
};

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ title, start_date, end_date, date, onClick }, ref) => {
    const realStartDate = dayjs(start_date);
    const realEndDate = dayjs(end_date);
    const startDate = realStartDate.isSame(date, "week")
      ? realStartDate
      : dayjs(date).startOf("week");
    const endDate = realEndDate.isSame(date, "week")
      ? realEndDate
      : dayjs(date).add(1, "week").startOf("week");

    const startOfDay = startDate.startOf("day");

    const isMultiDay = !realStartDate.isSame(realEndDate, "day");
    const daysDifference = endDate.diff(startDate, "days");
    const minutesDifference = endDate.diff(startDate, "minutes");

    const widthDelta = `${isMultiDay ? daysDifference : 0}px - 0%`;
    const fullWidthPrecent = 100 * (daysDifference || 1);
    const widthMultiplier = isMultiDay
      ? minutesDifference / (daysDifference * 24 * 60)
      : 1;

    const eventFullTitle = `(${title}) ${
      isMultiDay
        ? ` ${realStartDate.format("DD.MMTHH:mm")} - ${realEndDate.format("DD.MMTHH:mm")}`
        : ""
    }`;

    return (
      <Flex
        ref={ref}
        title={eventFullTitle}
        position={isMultiDay ? undefined : "absolute"}
        px="1"
        align={isMultiDay ? "center" : "start"}
        style={{
          ...(isMultiDay
            ? {
                position: "relative",
                left: `calc(${(startDate.diff(startOfDay.startOf("week"), "minutes") / (24 * 60)) * 100}% + 1px * ${startDate.diff(startDate.startOf("week"), "days")})`,
                height: constants.multiDayCellSize,
              }
            : {
                position: "absolute",
                top: `${(startDate.diff(startOfDay, "minutes") / (24 * 60)) * 100}%`,
                height: `calc(${constants.cellSize} * ${endDate.diff(startDate, "seconds") / 3_600})`,
              }),

          backgroundColor: "var(--blue-10)",
          width: `calc(${fullWidthPrecent * widthMultiplier}% + ${widthDelta} - 5%)`,
          borderRadius: "var(--radius-1)",
          color: "var(--blue-contrast)",
          cursor: "pointer",
        }}
        asChild
      >
        <button onClick={onClick}>
          <Typography
            size="1"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {eventFullTitle}
          </Typography>
        </button>
      </Flex>
    );
  },
);
export const Event = (props: Omit<ContentProps, "onClick">) => {
  const { start_date, end_date, title, type } = props;

  const [open, onOpen, __, toggleOpen] = useOpen(type === "new");

  const realStartDate = dayjs(start_date);
  const realEndDate = dayjs(end_date);

  const { t } = useTranslation();

  const { updateNewEvent } = useCalendar();

  const isMultiDay = !realStartDate.isSame(realEndDate, "day");

  const startDateFormatted = dayjs(start_date).format("YYYY-MM-DDTHH:mm");
  const endDateFormatted = dayjs(end_date).format("YYYY-MM-DDTHH:mm");

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        if (!value && type === "new") {
          updateNewEvent(undefined);
        }

        toggleOpen(value);
      }}
    >
      <Popover.Trigger>
        <Content {...props} onClick={onOpen} />
      </Popover.Trigger>
      <Popover.Content
        side={isMultiDay ? "bottom" : "right"}
        align="center"
        width="400px"
        sticky="always"
        updatePositionStrategy="always"
      >
        <Flex direction="column" gap="4">
          <Form
            defaultValues={{
              start_date: startDateFormatted,
              end_date: endDateFormatted,
              title,
            }}
          >
            <Flex direction="column" gap="4">
              <FormInput
                placeholder={t("add title")}
                name="title"
                label="Title"
              />
              <Flex gap="4">
                <FormInput
                  style={{ flex: 1 }}
                  placeholder={t("from")}
                  label="From"
                  name="start_date"
                  type="datetime-local"
                  max={endDateFormatted}
                  defaultValue={start_date.toISOString()}
                  // onChange={(event) =>
                  //   updateNewEvent((state) =>
                  //     state
                  //       ? {
                  //           ...state,
                  //           startDate: dayjs(event.target.value).toDate(),
                  //         }
                  //       : undefined,
                  //   )
                  // }
                  // error={
                  //   startDate.isAfter(endDate)
                  //     ? t("must be before end date")
                  //     : undefined
                  // }
                />
                <FormInput
                  style={{ flex: 1 }}
                  placeholder={t("to")}
                  label="To"
                  name="end_date"
                  type="datetime-local"
                  min={startDateFormatted}
                  defaultValue={end_date.toLocaleDateString()}
                  onBlur={(event) => console.log(event)}
                  // onChange={(event) =>
                  //   updateNewEvent((state) =>
                  //     state
                  //       ? {
                  //           ...state,
                  //           endDate: dayjs(event.target.value).toDate(),
                  //         }
                  //       : undefined,
                  //   )
                  // }
                  // error={
                  //   startDate.isAfter(endDate)
                  //     ? t("must be after start date")
                  //     : undefined
                  // }
                />
              </Flex>
            </Flex>
          </Form>
          <Flex gap="4" justify="between" align="center">
            <Popover.Close>
              <Button
                variant="soft"
                color="gray"
                type="button"
                onClick={() => updateNewEvent(undefined)}
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
