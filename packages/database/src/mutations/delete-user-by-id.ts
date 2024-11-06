import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";
import { queryUserById } from "../queries";

export type DeleteUserByIdProps = User["id"];
export type DeleteUserByIdReturnType = Awaited<
  ReturnType<typeof deleteUserById>
>;

export const deleteUserById = async (userId: User["id"]) => {
  await db.db.transaction(async (tx) => {
    const user = await queryUserById(userId);

    await Promise.all([
      tx
        .delete(db.schema.user_email_verification)
        .where(eq(db.schema.user_email_verification.user_email, user!.email)),
      tx
        .delete(db.schema.user_info)
        .where(eq(db.schema.user_info.user_id, userId)),
    ]);

    await tx.delete(db.schema.user).where(eq(db.schema.user.id, userId));
  });
};
