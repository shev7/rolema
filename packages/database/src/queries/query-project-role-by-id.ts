import { eq } from "drizzle-orm";

import { db } from "../db";
import { ProjectRole } from "../types";

export type QueryProjectRoleByIdProps = ProjectRole["id"];
export type QueryProjectRoleByIdReturnType = Awaited<
  ReturnType<typeof queryProjectRoleById>
>;

export const queryProjectRoleById = async (
  projectRoleId: QueryProjectRoleByIdProps,
) => {
  const [projectRole] = await db.db
    .select()
    .from(db.schema.project_role)
    .where(eq(db.schema.project_role.id, projectRoleId));

  return projectRole;
};
