"use client";

import React, { ReactEventHandler } from "react";

import { Box, Flex, Typography } from "@repo/ui";
import { dayjs, useOpen } from "@repo/utils";
import { Project } from "@repo/database";

import { Slide } from "@components/slide";

import constants from "../constants";
import { EventPopover } from "./event-popover";

type ContentProps = {
  title: string;
  type?: "new";
  start_date: Date;
  end_date: Date;
  date?: string | Date;
  projectId: Project["id"];
  onClick: ReactEventHandler<HTMLButtonElement>;
};

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ title, start_date, end_date, date, onClick, type }, ref) => {
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

    const widthDelta = `${isMultiDay ? daysDifference : 0}px`;
    const fullWidthPrecent = 100 * (daysDifference || 1);
    const widthMultiplier = isMultiDay
      ? minutesDifference / ((daysDifference || 1) * 24 * 60)
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
                zIndex: 1,
              }),
          width: `calc(${fullWidthPrecent * widthMultiplier}% + ${widthDelta} - 5%)`,
          cursor: "pointer",
        }}
        asChild
      >
        <button
          onClick={(event) => {
            event.stopPropagation();
            onClick?.(event);
          }}
          tabIndex={0}
        >
          <Flex position="absolute" inset="0" align="start">
            <Slide
              direction="right"
              duration={type === "new" ? 0 : 300}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <Box
                style={{
                  backgroundColor: "var(--blue-10)",
                  borderRadius: "var(--radius-1)",
                  color: "var(--blue-contrast)",
                }}
                px="1"
                width="100%"
                height="100%"
              >
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
              </Box>
            </Slide>
          </Flex>
        </button>
      </Flex>
    );
  },
);
export const Event = (props: Omit<ContentProps, "onClick">) => {
  const [open, onOpen, onClose] = useOpen(props.type === "new");

  return (
    <EventPopover {...props} open={open} onClose={onClose}>
      <Content {...props} onClick={onOpen} />
    </EventPopover>
  );
};
