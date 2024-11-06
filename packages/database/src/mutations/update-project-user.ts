import { and, eq, sql } from "drizzle-orm";

import { db } from "../db";
import { ProjectUser } from "../types";

export type UpdateProjectUserProps = {
  userId: ProjectUser["user_id"];
  projectId?: ProjectUser["project_id"];
  updatedBy: ProjectUser["updated_by"];
  fields: Partial<Omit<ProjectUser, "updated_by" | "updated_at">>;
};
export type UpdateProjectUserReturnType = Awaited<
  ReturnType<typeof updateProjectUser>
>;

export const updateProjectUser = async ({
  userId,
  projectId,
  updatedBy,
  fields,
}: UpdateProjectUserProps) => {
  const where = [eq(db.schema.project_user.user_id, userId)];

  if (projectId) {
    where.push(eq(db.schema.project_user.project_id, projectId));
  }

  const [projectUser] = await db.db
    .update(db.schema.project_user)
    .set({
      ...fields,
      updated_at: sql`now()`,
      updated_by: updatedBy,
    })
    .where(where.length > 1 ? and(...where) : where[0])
    .returning();

  return projectUser;
};
