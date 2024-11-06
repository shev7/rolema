import { eq, or } from "drizzle-orm";

import { db } from "../db";
import { ProjectRole } from "../types";

export type DeleteProjectRoleProps = ProjectRole["id"];
export type DeleteProjectRoleReturnType = Awaited<
  ReturnType<typeof deleteProjectRole>
>;

export const deleteProjectRole = async (
  projectRoleId: DeleteProjectRoleProps,
) =>
  db.db.transaction(async (tx) => {
    await tx
      .delete(db.schema.permission)
      .where(
        or(
          eq(db.schema.permission.permission_project_role_id, projectRoleId),
          eq(db.schema.permission.project_role_id, projectRoleId),
        ),
      );

    const [projectRole] = await tx
      .delete(db.schema.project_role)
      .where(eq(db.schema.project_role.id, projectRoleId))
      .returning();

    return projectRole;
  });
