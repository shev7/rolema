import { cookies } from "next/headers";

export const readCookie = (key: string) => {
  return cookies()?.getAll(key)?.[0]?.value;
};
