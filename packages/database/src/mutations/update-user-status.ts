import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type UpdateUserStatusProps = {
  id: User["id"];
  status: User["status"];
  updatedBy: User["updated_by"];
};
export type UpdateUserStatusReturnType = Awaited<
  ReturnType<typeof updateUserStatus>
>;

export const updateUserStatus = async ({
  id,
  status,
  updatedBy,
}: UpdateUserStatusProps) => {
  const [user] = await db.db
    .update(db.schema.user)
    .set({ status, updated_at: sql`now()`, updated_by: updatedBy })
    .where(eq(db.schema.user.id, id))
    .returning();

  return user;
};
