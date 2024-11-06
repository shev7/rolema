import { count, eq } from "drizzle-orm";

import { db } from "../db";
import { ProjectUser } from "../types";

export type QueryProjectRoleUsersCountByRoleIdProps =
  ProjectUser["project_role_id"];
export type QueryProjectRoleUsersCountByRoleIdReturnType = Awaited<
  ReturnType<typeof queryProjectRoleUsersCountByRoleId>
>;

export const queryProjectRoleUsersCountByRoleId = async (
  projectRoleId: QueryProjectRoleUsersCountByRoleIdProps,
) => {
  const [data] = await db.db
    .select({ count: count() })
    .from(db.schema.project_role)
    .leftJoin(
      db.schema.project_user,
      eq(db.schema.project_user.project_role_id, db.schema.project_role.id),
    )
    .where(eq(db.schema.project_user.project_role_id, projectRoleId));

  return data!.count;
};
