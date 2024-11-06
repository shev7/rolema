import { eq } from "drizzle-orm";

import { db } from "../db";
import { UserEmailVerification } from "../types";

export type DeleteUserEmailVerificationByEmailProps =
  UserEmailVerification["user_email"];
export type DeleteUserEmailVerificationByEmailReturnType = Awaited<
  ReturnType<typeof deleteUserEmailVerificationByEmail>
>;

export const deleteUserEmailVerificationByEmail = (
  userEmail: UserEmailVerification["user_email"],
) => {
  return db.db
    .delete(db.schema.user_email_verification)
    .where(eq(db.schema.user_email_verification.user_email, userEmail))
    .returning();
};
