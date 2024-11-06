import { User } from "@repo/database";
import { sql } from "drizzle-orm";

export const TEST_PASSWORD =
  "$2b$10$xt44neFCRYfRKkRaL0rIr.t3M8c7dWmm4/V9tviMFx9Cy/YRvszBq"; // 123123123,

export const TEST_DATE = new Date("2024-01-01T12:00:00.000Z");
export const TEST_SQL_DATE = sql`'2024-01-01 12:00:00.00'`;

export const TEST_ROLE_SHORTHANDS: Record<User["role"], string> = {
  admin: "ad",
  creator: "cr",
  general: "ge",
} as const;

export const DATE_DIFF = 100000;
