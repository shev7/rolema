import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type QueryUserEmailVerifiedAndVerificationTokenByIdProps = User["id"];
export type QueryUserEmailVerifiedAndVerificationTokenByIdReturnType = Awaited<
  ReturnType<typeof queryUserEmailVerifiedAndVerificationTokenById>
>;

export const queryUserEmailVerifiedAndVerificationTokenById = async (
  userId: QueryUserEmailVerifiedAndVerificationTokenByIdProps,
) => {
  const [data] = await db.db
    .select({
      user: db.schema.user,
      token: db.schema.user_email_verification.token,
      email_verified: db.schema.user_info.email_verified,
    })
    .from(db.schema.user)
    .leftJoin(
      db.schema.user_info,
      eq(db.schema.user_info.user_id, db.schema.user.id),
    )
    .leftJoin(
      db.schema.user_email_verification,
      eq(db.schema.user_email_verification.user_email, db.schema.user.email),
    )
    .where(eq(db.schema.user.id, userId));

  return data;
};
