"use client";

import { PropsWithChildren } from "react";

import { Grid } from "@repo/ui";
import { dayjs } from "@repo/utils";

import { useCalendar } from "./calendar-context";

export const ContentGrid = ({ children }: PropsWithChildren) => {
  const { updateNewEvent } = useCalendar();

  return (
    <Grid
      columns="8"
      style={{
        gridTemplateColumns: "repeat(1, max-content) repeat(7, 1fr)",
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const getTarget = (
          target: HTMLElement | null,
          step: number,
        ): HTMLElement | null | undefined => {
          if (!target) return undefined;
          if (target.dataset.date) return target;
          if (step === 0) return undefined;

          return getTarget(target.parentElement, step - 1);
        };

        const target = getTarget(event.target as HTMLDivElement, 10);
        if (target?.dataset.date) {
          const dayjsDate = dayjs(target.dataset.date);
          const { bottom, height } = target.getBoundingClientRect();

          if (Boolean(target.dataset.isMultiDate)) {
            const startDate = dayjsDate.startOf("day");
            return updateNewEvent({
              startDate: startDate.toDate(),
              endDate: startDate.add(1, "day").toDate(),
            });
          }
          let date = dayjsDate.add(
            Math.round((1 - (bottom - event.pageY) / height) * 60),
            "minutes",
          );

          const deltaMinutes = 9;

          if (date.diff(date.startOf("hour"), "minutes") < deltaMinutes) {
            date = date.startOf("hour");
          } else if (
            date.add(1, "hour").startOf("hour").diff(date, "minutes") <
            deltaMinutes
          ) {
            date = date.add(1, "hour").startOf("hour");
          }

          const startDate = date.set(
            "minutes",
            5 * Math.floor(date.get("minutes") / 5),
          );

          const endDate = startDate.add(1, "hour");

          updateNewEvent({
            startDate: startDate.toDate(),
            endDate: (endDate.isSame(startDate, "day")
              ? endDate
              : endDate.startOf("hour").subtract(1, "second")
            ).toDate(),
          });
        }
      }}
    >
      {children}
    </Grid>
  );
};
