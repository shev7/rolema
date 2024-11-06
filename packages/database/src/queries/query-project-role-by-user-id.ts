import { and, desc, eq, notInArray } from "drizzle-orm";

import { db } from "../db";
import { Project, User } from "../types";

export type QueryProjectRoleByUserIdProps = {
  userId: User["id"];
  projectId: Project["id"];
};
export type QueryProjectRoleByUserIdReturnType = Awaited<
  ReturnType<typeof queryProjectRoleByUserId>
>;

export const queryProjectRoleByUserId = async ({
  userId,
  projectId,
}: QueryProjectRoleByUserIdProps) => {
  const [data] = await db.db
    .select({
      project_role: db.schema.project_role,
    })
    .from(db.schema.project_user)
    .leftJoin(
      db.schema.project_role,
      eq(db.schema.project_role.id, db.schema.project_user.project_role_id),
    )
    .where(
      and(
        eq(db.schema.project_user.user_id, userId),
        eq(db.schema.project_user.project_id, projectId),
        eq(db.schema.project_role.project_id, projectId),
      ),
    )
    .orderBy(desc(db.schema.project_role.created_at));

  return data?.project_role;
};
