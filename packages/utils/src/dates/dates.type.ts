import dayjs from "dayjs";

export type CustomDate = Date | string | number | dayjs.Dayjs;

export type DateOption = CustomDate | { date: CustomDate; include?: true };
