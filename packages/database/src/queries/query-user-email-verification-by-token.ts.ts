import { eq } from "drizzle-orm";

import { db } from "../db";
import { UserEmailVerification } from "../types";

export type QueryUserEmailVerificationByTokenIdProps =
  UserEmailVerification["token"];
export type QueryUserEmailVerificationByTokenReturnType = Awaited<
  ReturnType<typeof queryUserEmailVerificationByToken>
>;

export const queryUserEmailVerificationByToken = async (
  token: QueryUserEmailVerificationByTokenIdProps,
) => {
  const [verification] = await db.db
    .select()
    .from(db.schema.user_email_verification)
    .where(eq(db.schema.user_email_verification.token, token));

  return verification;
};
