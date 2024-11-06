import dayjs from "dayjs";

import { CustomDate, DateOption } from "./dates.type";
import { getDateFromDateOption } from "./get-date-from-date-option";

export const isDateInRange = (
  date: CustomDate,
  from: DateOption,
  to: DateOption,
) => {
  const dayjsDate = dayjs(date);
  const fromDate = getDateFromDateOption(from);
  const toDate = getDateFromDateOption(to);

  const includeFrom = Boolean(
    typeof from === "object" && from && "include" in from && from.include,
  );
  const includeTo = Boolean(
    typeof to === "object" && to && "include" in to && to.include,
  );

  const fromCondition =
    dayjsDate.isAfter(fromDate) ||
    (includeFrom ? dayjsDate.valueOf() === fromDate.valueOf() : false);

  const toCondition =
    dayjsDate.isBefore(toDate) ||
    (includeTo ? dayjsDate.valueOf() === toDate.valueOf() : false);

  return fromCondition && toCondition;
};
