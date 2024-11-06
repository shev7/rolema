import { eq } from "drizzle-orm";

import { db } from "../db";
import { UserEmailVerification, User } from "../types";

export type SetUserEmailSentProps = {
  userEmail: UserEmailVerification["user_email"];
  emailSent: UserEmailVerification["email_sent"];
};
export type SetUserEmailSentReturnType = Awaited<
  ReturnType<typeof setUserEmailSent>
>;

export const setUserEmailSent = async ({
  emailSent,
  userEmail,
}: SetUserEmailSentProps) => {
  const [userEmailVerification] = await db.db
    .update(db.schema.user_email_verification)
    .set({ email_sent: emailSent })
    .where(eq(db.schema.user_email_verification.user_email, userEmail))
    .returning();

  return userEmailVerification;
};
