"use client";

import { useMemo } from "react";

import { useTranslation } from "@repo/i18n/hooks";
import { dayjs, areDateRangesIntersecting } from "@repo/utils";

import { TimeColumn } from "./time-column";
import { Column } from "./column";
import { ContentGrid } from "./content-grid";
import { useCalendar } from "./calendar-context";

export const Content = ({
  date,
  projectId,
}: {
  projectId: string;
  date?: string;
}) => {
  const startOfWeekDay = dayjs(date)
    .startOf("week")
    .startOf("day")
    .toISOString();
  const endOfWeekDay = dayjs(date)
    .endOf("week")
    .subtract(1, "second")
    .startOf("day")
    .toISOString();

  const weekDays = useMemo(
    () =>
      Array.from(new Array(7).keys()).map((delta) =>
        dayjs(startOfWeekDay).add(delta, "day").toDate(),
      ),
    [startOfWeekDay],
  );

  const { newEvent } = useCalendar();

  const { t } = useTranslation();

  const events = [
    {
      title: t("event 0"),
      start_date: new Date(
        "Thu Jul 25 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
      end_date: new Date(
        "Tue Aug 06 2024 01:15:00 GMT+0300 (Moscow Standard Time)",
      ),
    },
    {
      title: t("event 1"),
      start_date: new Date(
        "Thu Jul 25 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
      end_date: new Date(
        "Tue Jul 31 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
    },
    {
      title: t("event 2"),
      start_date: new Date(
        "Mon Jul 29 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
      end_date: new Date(
        "Fro Aug 2 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
    },
    {
      title: t("event 3"),
      start_date: new Date(
        "Mon Jul 29 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
      end_date: new Date(
        "Wed Aug 07 2024 15:50:00 GMT+0300 (Moscow Standard Time)",
      ),
    },
    {
      title: t("event 4"),
      start_date: new Date(
        "Sun Aug 04 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
      end_date: new Date(
        "Mon Aug 05 2024 00:00:00 GMT+0300 (Moscow Standard Time)",
      ),
    },
    ...(newEvent
      ? ([
          {
            title: t("new event"),
            type: "new",
            start_date: newEvent.startDate,
            end_date: newEvent.endDate,
          },
        ] as const)
      : []),
  ];

  const multiDayEvents = events
    .filter((event) => !dayjs(event.start_date).isSame(event.end_date, "day"))
    .sort(
      (a, b) =>
        new Date(a.start_date).valueOf() - new Date(b.start_date).valueOf(),
    );

  const currentWeekMultiDayEvents = multiDayEvents
    .filter(({ start_date, end_date }) => {
      return areDateRangesIntersecting(
        [
          { date: start_date, include: true },
          { date: end_date, include: true },
        ],
        [
          { date: startOfWeekDay, include: true },
          { date: endOfWeekDay, include: true },
        ],
      );
    })
    .map((event, index) => ({ ...event, rowPosition: index }));

  console.log(currentWeekMultiDayEvents);

  const map = new Map<string, Array<any>>(
    weekDays.map((date) => [
      date.toISOString(),
      events.filter(({ start_date, end_date }) => {
        const sd = dayjs(start_date);
        return sd.isSame(end_date, "day") && sd.isSame(date, "day");
      }),
    ]),
  );

  return (
    <ContentGrid>
      <TimeColumn
        date={date}
        multiDayEventRowsCount={currentWeekMultiDayEvents.length}
      />
      {weekDays.map((date, index) => (
        <Column
          key={date.toString()}
          index={index}
          projectId={projectId}
          multiDayEventRowsCount={currentWeekMultiDayEvents.length}
          date={date}
          multiDayEvents={index === 0 ? currentWeekMultiDayEvents : []}
          events={map.get(date.toISOString()) ?? []}
        />
      ))}
    </ContentGrid>
  );
};
