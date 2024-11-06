"use client";

import { Flex } from "@radix-ui/themes";
import { dayjs } from "@repo/utils";
import { Box, Typography } from "@repo/ui";

import constants from "./constants";
import { Event } from "./event/event";
import { Project } from "@repo/database";

type Event = {
  title: string;
  type?: "new";
  start_date: Date;
  end_date: Date;
  rowPosition?: number;
};

export const Column = ({
  date,
  events,
  multiDayEvents,
  multiDayEventRowsCount,
  index,
  projectId,
}: {
  date: Date;
  events: Array<Event>;
  multiDayEvents: Array<Event>;
  multiDayEventRowsCount: number;
  index: number;
  projectId: Project["id"];
}) => {
  const startOfDay = dayjs(date).startOf("day");
  const isToday = startOfDay.isSame(Date.now(), "day");
  const dayjsNow = dayjs(new Date());

  return (
    <Box position="relative">
      <Flex
        data-date={startOfDay.toISOString()}
        data-is-multi-date={true}
        justify="center"
        style={{
          borderBottom: "1px solid var(--gray-6)",
          backgroundColor: "var(--gray-2)",
          zIndex: 1 + (7 - index),
        }}
        position="sticky"
        top="0"
      >
        <Flex direction="column" width="100%" gap="1" pt="2">
          <Typography
            style={{
              textTransform: "uppercase",
            }}
            size="1"
            align="center"
            color={isToday ? "blue" : "gray"}
          >
            {startOfDay.format("ddd")}
          </Typography>
          <Flex
            justify="center"
            direction="column"
            pb="1"
            style={{
              borderLeft: "1px solid var(--gray-6)",
            }}
          >
            <Typography
              size="7"
              align="center"
              color={isToday ? "blue" : "gray"}
            >
              {startOfDay.format("D")}
            </Typography>

            {index === 0 ? (
              <Flex
                className={`test-${multiDayEventRowsCount}`}
                data-testdate={date.toISOString()}
                direction="column"
                width="100%"
                style={{
                  gap: "2.5px",
                }}
              >
                {multiDayEvents.map((event) => (
                  <Box key={event.title} position="relative">
                    <Event {...event} date={date} projectId={projectId} />
                  </Box>
                ))}
              </Flex>
            ) : (
              <Flex
                height={`calc(${multiDayEventRowsCount} * ${constants.multiDayCellSize} + 2.5px * ${(multiDayEventRowsCount || 1) - 1})`}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
      <Box position="relative">
        {Array.from(new Array(24).keys()).map((hour) => {
          const hourDate = startOfDay.add(hour, "hours");

          return (
            <Box
              key={hour}
              data-date={hourDate.toISOString()}
              height={constants.cellSize}
              position="relative"
              style={{
                borderBottom: hour < 23 ? "1px solid var(--gray-6)" : undefined,
                borderLeft: "1px solid var(--gray-6)",
              }}
            />
          );
        })}

        {isToday && (
          <Box
            position="absolute"
            height="2px"
            width="100%"
            style={{
              background: "var(--accent-9)",
              top: `${(dayjsNow.diff(startOfDay, "seconds") / (24 * 60 * 60)) * 100}%`,
            }}
          >
            <Box
              style={{
                background: "var(--accent-9)",
                height: "12px",
                width: "12px",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </Box>
        )}
        {events.map((event) => (
          <Event
            {...event}
            key={event.title}
            date={date}
            projectId={projectId}
          />
        ))}
      </Box>
    </Box>
  );
};
