import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type QueryUserAllByIdProps = User["id"];
export type QueryUserAllByIdReturnType = Awaited<
  ReturnType<typeof queryUserAllById>
>;

export const queryUserAllById = async (userId: QueryUserAllByIdProps) => {
  const [user] = await db.db
    .select({
      id: db.schema.user.id,
      email: db.schema.user.email,
      role: db.schema.user.role,
      created_at: db.schema.user.created_at,
      status: db.schema.user.status,
      email_verified: db.schema.user_info.email_verified,
      email_verified_at: db.schema.user_info.email_verified_at,
      invited_by: db.schema.user_info.invited_by,
      updated_at: db.schema.user_info.updated_at,
      project_role_id: db.schema.project_user.project_role_id,
    })
    .from(db.schema.user)
    .leftJoin(
      db.schema.user_info,
      eq(db.schema.user_info.user_id, db.schema.user.id),
    )
    .leftJoin(
      db.schema.project_user,
      eq(db.schema.project_user.user_id, db.schema.user.id),
    )
    .where(eq(db.schema.user.id, userId));

  if (!user) {
    return undefined;
  }

  return {
    ...user,
    id: user.id!,
    email: user.email!,
    role: user.role!,
    invited_by: user.invited_by!,
    created_at: user.created_at!,
    updated_at: user.updated_at!,
    email_verified: user.email_verified!,
  };
};
