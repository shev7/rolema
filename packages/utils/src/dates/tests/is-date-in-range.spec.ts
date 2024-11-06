import dayjs from "dayjs";
import { isDateInRange } from "../is-date-in-range";

describe("isDateInRange", () => {
  const inRangeDate = new Date("2024-08-05");
  const outOfRangeDate = new Date("2024-08-01");
  const dates = [
    inRangeDate,
    inRangeDate.toISOString(),
    inRangeDate.valueOf(),
    dayjs(inRangeDate),
  ];
  const from = new Date("2024-08-04");
  const to = new Date("2024-08-06");

  const getTitle = (left: string, right: string) =>
    `works with %s in range ${left} ${from.toDateString()}, ${to.toDateString()} ${right}`;

  it.each(dates)(getTitle("(", ")"), (date) => {
    expect(isDateInRange(date, from, to)).toBe(true);
    expect(isDateInRange(date, date, to)).toBe(false);
    expect(isDateInRange(date, from, date)).toBe(false);
    expect(isDateInRange(outOfRangeDate, from, to)).toBe(false);
  });

  it.each(dates)(getTitle("[", ")"), (date) => {
    const restProps = [{ date: from, include: true }, to] as const;
    expect(isDateInRange(date, ...restProps)).toBe(true);
    expect(isDateInRange(from, ...restProps)).toBe(true);
    expect(isDateInRange(outOfRangeDate, ...restProps)).toBe(false);
  });

  it.each(dates)(getTitle("(", "]"), (date) => {
    const restProps = [from, { date: to, include: true }] as const;
    expect(isDateInRange(date, ...restProps)).toBe(true);
    expect(isDateInRange(to, ...restProps)).toBe(true);
    expect(isDateInRange(outOfRangeDate, ...restProps)).toBe(false);
  });

  it.each(dates)(getTitle("[", "]"), (date) => {
    const restProps = [
      { date: from, include: true },
      { date: to, include: true },
    ] as const;

    expect(isDateInRange(date, ...restProps)).toBe(true);
    expect(isDateInRange(from, ...restProps)).toBe(true);
    expect(isDateInRange(to, ...restProps)).toBe(true);
    expect(isDateInRange(outOfRangeDate, ...restProps)).toBe(false);
  });
});
