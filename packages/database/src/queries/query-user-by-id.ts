import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type QueryUserByIdProps = User["id"];
export type QueryUserByIdReturnType = Awaited<ReturnType<typeof queryUserById>>;

export const queryUserById = async (userId: QueryUserByIdProps) => {
  const [user] = await db.db
    .select()
    .from(db.schema.user)
    .where(eq(db.schema.user.id, userId));

  return user;
};
