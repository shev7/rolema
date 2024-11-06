import { eq } from "drizzle-orm";
import { db } from "../db";
import { User } from "../types";

export const queryUserEmailVerificationByUserEmail = async (
  email: User["email"],
) => {
  const [userEmailVerification] = await db.db
    .select()
    .from(db.schema.user_email_verification)
    .where(eq(db.schema.user_email_verification.user_email, email));

  return userEmailVerification;
};
