import { eq } from "drizzle-orm";

import { db } from "../db";
import { ProjectRole } from "../types";

export type QueryProjectByProjectRoleIdProps = ProjectRole["id"];
export type QueryProjectByProjectRoleIdReturnType = Awaited<
  ReturnType<typeof queryProjectByProjectRoleId>
>;

export const queryProjectByProjectRoleId = async (
  projectRoleId: QueryProjectByProjectRoleIdProps,
) => {
  const [data] = await db.db
    .select()
    .from(db.schema.project_role)
    .leftJoin(
      db.schema.project,
      eq(db.schema.project.id, db.schema.project_role.project_id),
    )
    .where(eq(db.schema.project_role.id, projectRoleId));

  return data;
};
