import dayjs from "dayjs";
import { CustomDate } from "./dates.type";

enum Formats {
  DayUri = "YYYY-MM-DD",
  DatetimeLocal = "YYYY-MM-DDTHH:mm",
}

export const formatDate = (date: CustomDate, format: Formats) =>
  dayjs(date).format(format);

formatDate.Formats = Formats;
