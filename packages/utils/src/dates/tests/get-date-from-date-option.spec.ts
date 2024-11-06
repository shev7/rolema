import dayjs from "dayjs";
import { getDateFromDateOption } from "../get-date-from-date-option";

describe("getDateFromDateOption", () => {
  const date = new Date("2024-08-04");
  const dates = [date, +date, date.toISOString(), dayjs(date)];

  it.each([...dates, ...dates.map((date) => ({ date }))])(
    "returns correct instance for %s",
    (date) => {
      expect(getDateFromDateOption(date)).toBeInstanceOf(dayjs);
    },
  );

  it.each(dates)("returns correct values for non-objects", (date) => {
    expect(getDateFromDateOption(date).toISOString()).toBe(
      dayjs(date).toISOString(),
    );
  });

  it.each(dates.map((date) => ({ date })))(
    "returns correct values for objects",
    (date) => {
      expect(getDateFromDateOption(date).toISOString()).toBe(
        dayjs(date.date).toISOString(),
      );
    },
  );
});
