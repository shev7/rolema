import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type SetUserPasswordProps = {
  userId: User["id"];
  passwordHash: string;
};
export type SetUserPasswordReturnType = Awaited<
  ReturnType<typeof setUserPassword>
>;

export const setUserPassword = async ({
  userId,
  passwordHash,
}: SetUserPasswordProps) => {
  await db.db.transaction(async (tx) => {
    await Promise.all([
      tx
        .update(db.schema.user_info)
        .set({
          email_verified: true,
          email_verified_at: sql`now()`,
          password_hash: passwordHash,
          updated_at: sql`now()`,
          updated_by: userId,
        })
        .where(eq(db.schema.user_info.user_id, userId)),
      tx
        .update(db.schema.user)
        .set({ status: "ready" })
        .where(eq(db.schema.user.id, userId)),
    ]);
  });
};
