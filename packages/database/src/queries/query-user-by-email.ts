import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type QueryUserByEmailReturnType = Awaited<
  ReturnType<typeof queryUserByEmail>
>;

export const queryUserByEmail = async (email: User["email"]) => {
  const [user] = await db.db
    .select()
    .from(db.schema.user)
    .where(eq(db.schema.user.email, email));

  return user;
};
