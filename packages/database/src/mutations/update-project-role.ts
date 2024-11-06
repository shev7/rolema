import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { ProjectRole } from "../types";

export type UpdateProjectRoleProps = {
  id: ProjectRole["id"];
  updatedBy: ProjectRole["updated_by"];
  fields: Partial<Pick<ProjectRole, "name">>;
};
export type UpdateProjectRoleReturnType = Awaited<
  ReturnType<typeof updateProjectRole>
>;

export const updateProjectRole = async ({
  id,
  updatedBy,
  fields,
}: UpdateProjectRoleProps) => {
  if (Object.keys(fields).length === 0) {
    throw new Error("no fields provided");
  }

  const [projectRole] = await db.db
    .update(db.schema.project_role)
    .set({ ...fields, updated_at: sql`now()`, updated_by: updatedBy })
    .where(eq(db.schema.project_role.id, id))
    .returning();

  return projectRole;
};
