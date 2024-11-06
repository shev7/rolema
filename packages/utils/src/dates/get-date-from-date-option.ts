import dayjs from "dayjs";

import { DateOption } from "./dates.type";

export const getDateFromDateOption = (date: DateOption): dayjs.Dayjs => {
  return dayjs(
    typeof date === "string" ||
      typeof date === "number" ||
      dayjs.isDayjs(date) ||
      date instanceof Date
      ? date
      : date.date,
  );
};
