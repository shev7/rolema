"use client";

import React, {
  KeyboardEventHandler,
  PropsWithChildren,
  ReactEventHandler,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import isEqual from "lodash.isequal";

import { Flex, Form, FormInput } from "@repo/ui";
import { areDateRangesIntersecting, dayjs, formatDate } from "@repo/utils";
import { useTranslation } from "@repo/i18n/hooks";
import globalConstants from "@repo/constants";
import { Project } from "@repo/database";

import { useCalendar } from "../calendar-context";

type Props = {
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

export const EventPopoverForm = (
  props: PropsWithChildren<Omit<Props, "onClick">>,
) => {
  const { start_date, end_date, date, projectId } = props;

  const startDateFormatted = formatDate(
    start_date,
    formatDate.Formats.DatetimeLocal,
  );
  const endDateFormatted = formatDate(
    end_date,
    formatDate.Formats.DatetimeLocal,
  );

  const { t } = useTranslation();
  const router = useRouter();

  const { newEvent, updateNewEvent } = useCalendar();

  const focusTimeout = useRef(-1);

  const { setValue } = Form.useFormContext();

  useEffect(() => {
    const x = setInterval(
      () => console.log(document.getSelection()?.toString()),
      2000,
    );

    return () => {
      clearTimeout(focusTimeout.current);
      clearInterval(x);
    };
  }, []);

  const onUpdate = (
    field: "startDate" | "endDate",
    target: HTMLInputElement,
    name: "start_date" | "end_date",
  ) => {
    if (
      !target.value ||
      (newEvent &&
        isEqual(
          newEvent[field].toISOString(),
          dayjs(target.value).toISOString(),
        ))
    ) {
      return;
    }

    updateNewEvent((state) => {
      if (!state) return state;

      const newState = {
        ...state,
        [field]: dayjs(target.value).toDate(),
      };

      const updateForm = () => {
        setValue(
          "start_date",
          formatDate(newState.startDate, formatDate.Formats.DatetimeLocal),
        );
        setValue(
          "end_date",
          formatDate(newState.endDate, formatDate.Formats.DatetimeLocal),
        );
      };

      if (dayjs(newState.startDate).isAfter(newState.endDate)) {
        const temp = newState.endDate;
        newState.endDate = newState.startDate;
        newState.startDate = temp;
        updateForm();
      }

      if (dayjs(newState.endDate).diff(newState.startDate, "minutes") < 5) {
        newState.endDate = dayjs(newState.startDate).add(5, "minutes").toDate();
        updateForm();
      }

      if (
        !areDateRangesIntersecting(
          [dayjs(date).startOf("week"), dayjs(date).endOf("week")],
          [newState.startDate, newState.endDate],
        )
      ) {
        const href = `${globalConstants.nav.routes.projectCalendar(projectId)}?${new URLSearchParams(
          {
            [globalConstants.nav.sp.keys.date]: formatDate(
              newState.startDate,
              formatDate.Formats.DayUri,
            ),
          },
        )}`;
        router.push(href);
      }

      focusTimeout.current = window.setTimeout(() => {
        if (document.activeElement?.tagName !== "INPUT") {
          const element = document.querySelector(`#${name}`);

          if (
            element &&
            "focus" in element &&
            typeof element.focus === "function"
          ) {
            element.focus();
          }
        }
      }, 50);

      return newState;
    });
  };

  const onBlur =
    (
      field: "startDate" | "endDate",
      name: "start_date" | "end_date",
    ): ReactEventHandler<HTMLInputElement> =>
    (event) =>
      onUpdate(field, event.target as HTMLInputElement, name);

  const onKeyDown =
    (
      field: "startDate" | "endDate",
      name: "start_date" | "end_date",
    ): KeyboardEventHandler<HTMLInputElement> =>
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onUpdate(field, event.target as HTMLInputElement, name);
      }
    };

  return (
    <Flex direction="column" gap="4">
      <FormInput placeholder={t("add title")} name="title" label="Title" />
      <Flex gap="4">
        <FormInput
          style={{ flex: 1 }}
          placeholder={t("from")}
          label="From"
          name="start_date"
          type="datetime-local"
          max={endDateFormatted}
          defaultValue={start_date.toISOString()}
          onBlur={onBlur("startDate", "start_date")}
          onKeyDown={onKeyDown("startDate", "start_date")}
        />
        <FormInput
          style={{ flex: 1 }}
          placeholder={t("to")}
          label="To"
          name="end_date"
          type="datetime-local"
          min={startDateFormatted}
          defaultValue={end_date.toLocaleDateString()}
          onBlur={onBlur("endDate", "end_date")}
          onKeyDown={onKeyDown("endDate", "end_date")}
        />
      </Flex>
    </Flex>
  );
};
