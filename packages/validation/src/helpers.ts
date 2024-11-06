import { dayjs } from "@repo/utils";

export const noLeadingOrTrailingSpace = (value: string) =>
  !value.startsWith(" ") && !value.endsWith(" ");

export const isStartDateBeforeEndDate = ({
  start_date,
  end_date,
}: {
  start_date?: Date;
  end_date?: Date;
}) => {
  return start_date && end_date ? dayjs(start_date).isBefore(end_date) : true;
};
