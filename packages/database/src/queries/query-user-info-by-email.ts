import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type QueryUserInfoByEmailProps = User["email"];
export type QueryUserInfoByEmailReturnType = Awaited<
  ReturnType<typeof queryUserInfoByEmail>
>;

export const queryUserInfoByEmail = async (
  userEmail: QueryUserInfoByEmailProps,
) => {
  const [user] = await db.db
    .select({
      user_info: db.schema.user_info,
    })
    .from(db.schema.user)
    .leftJoin(
      db.schema.user_info,
      eq(db.schema.user_info.user_id, db.schema.user.id),
    )
    .where(eq(db.schema.user.email, userEmail));

  return user?.user_info;
};
