import { eq } from "drizzle-orm";

import { db } from "../db";
import { ProjectUser } from "../types";

export type ReplaceProjectUsersProjectRoleIdByNewRoleIdProps = {
  projectRoleId: ProjectUser["project_role_id"];
  fallbackRoleId: ProjectUser["project_role_id"];
  updatedBy: ProjectUser["updated_by"];
};
export type ReplaceProjectUsersProjectRoleIdByNewRoleIdReturnType = Awaited<
  ReturnType<typeof replaceProjectUsersProjectRoleIdByNewRoleId>
>;

export const replaceProjectUsersProjectRoleIdByNewRoleId = async ({
  projectRoleId,
  fallbackRoleId,
  updatedBy,
}: ReplaceProjectUsersProjectRoleIdByNewRoleIdProps) => {
  return db.db.transaction(async (tx) => {
    await tx
      .update(db.schema.project_user)
      .set({ project_role_id: fallbackRoleId, updated_by: updatedBy })
      .where(eq(db.schema.project_user.project_role_id, projectRoleId));

    const [role] = await tx
      .delete(db.schema.project_role)
      .where(eq(db.schema.project_role.id, projectRoleId))
      .returning();

    return role;
  });
};
