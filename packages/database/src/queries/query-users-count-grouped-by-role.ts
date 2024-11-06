import { count } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type QueryUsersCountGroupedByRoleReturnType = Awaited<
  ReturnType<typeof queryUsersCountGroupedByRole>
>;

export const queryUsersCountGroupedByRole = () => {
  return db.db
    .select({ count: count(), role: db.schema.user.role })
    .from(db.schema.user)
    .groupBy(db.schema.user.role);
};
