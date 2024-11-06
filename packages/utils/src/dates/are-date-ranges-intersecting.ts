import { DateOption } from "./dates.type";
import { isDateInRange } from "./is-date-in-range";
import { getDateFromDateOption } from "./get-date-from-date-option";

export const areDateRangesIntersecting = (
  rangeA: [DateOption, DateOption],
  rangeB: [DateOption, DateOption],
) =>
  isDateInRange(getDateFromDateOption(rangeA[0]), ...rangeB) ||
  isDateInRange(getDateFromDateOption(rangeA[1]), ...rangeB) ||
  isDateInRange(getDateFromDateOption(rangeB[0]), ...rangeA) ||
  isDateInRange(getDateFromDateOption(rangeB[1]), ...rangeA);
