import { and, desc, eq, notInArray } from "drizzle-orm";

import { db } from "../db";
import { ProjectRole } from "../types";

export type QueryProjectRolesProps = {
  projectId?: ProjectRole["project_id"];
  excludeProjectRoleIds?: [ProjectRole["id"], ...ProjectRole["id"][]];
};
export type QueryProjectRolesReturnType = Awaited<
  ReturnType<typeof queryProjectRoles>
>;

export const queryProjectRoles = async ({
  projectId,
  excludeProjectRoleIds,
}: QueryProjectRolesProps = {}) => {
  const where = [];

  if (projectId) {
    where.push(eq(db.schema.project_role.project_id, projectId));
  }

  if (excludeProjectRoleIds?.length) {
    where.push(notInArray(db.schema.project_role.id, excludeProjectRoleIds));
  }

  return db.db
    .select()
    .from(db.schema.project_role)
    .where(where.length > 1 ? and(...where) : where[0])
    .orderBy(desc(db.schema.project_role.created_at));
};
