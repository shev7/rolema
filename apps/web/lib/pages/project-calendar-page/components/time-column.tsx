"use client";

import { dayjs } from "@repo/utils";
import { Box, Flex, Typography } from "@repo/ui";

import constants from "./constants";

// TODO: will be remove later
const timeZone = (date: Date) =>
  date
    .toString()
    .match(/([A-Z]+[\\+-][0-9]+)/)?.[1]
    ?.replace("00", "");

export const TimeColumn = ({
  date,
  multiDayEventRowsCount,
}: {
  date?: string;
  multiDayEventRowsCount: number;
}) => {
  const weekStart = dayjs(date).startOf("week").startOf("day");

  return (
    <Box position="relative">
      <Flex
        height={`calc(${multiDayEventRowsCount} * ${constants.multiDayCellSize} + 69px + 2.5px * ${(multiDayEventRowsCount || 1) - 1})`}
        align="end"
        justify="end"
        py="1"
        px="2"
        position="sticky"
        top="0"
        style={{
          backgroundColor: "var(--gray-2)",
          borderBottom: "1px solid var(--gray-6)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
          }}
        />
        <Typography size="1" color="gray">
          {timeZone(new Date())}
        </Typography>
      </Flex>
      {Array.from(new Array(24).keys()).map((hour) => (
        <Box key={hour} height={constants.cellSize} position="relative" px="2">
          {hour < 23 && (
            <Box
              position="absolute"
              bottom="0"
              right="0"
              p="2"
              style={{
                borderBottom: "1px solid var(--gray-6)",
              }}
            />
          )}
          {hour > 0 && (
            <Flex
              position="absolute"
              top="0"
              right="5"
              style={{
                transform: "translateY(-50%)",
              }}
            >
              <Typography
                size="1"
                color="gray"
                style={{
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {weekStart.add(hour, "hours").format("HH:mm")}
              </Typography>
            </Flex>
          )}
        </Box>
      ))}
    </Box>
  );
};
