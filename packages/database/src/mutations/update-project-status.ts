import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type UpdateProjectStatusProps = {
  id: Project["id"];
  status: Project["status"];
  updatedBy: Project["updated_by"];
};
export type UpdateProjectStatusReturnType = Awaited<
  ReturnType<typeof updateProjectStatus>
>;

export const updateProjectStatus = async ({
  id,
  status,
  updatedBy,
}: UpdateProjectStatusProps) => {
  const [project] = await db.db
    .update(db.schema.project)
    .set({ status, updated_at: sql`now()`, updated_by: updatedBy })
    .where(eq(db.schema.project.id, id))
    .returning();

  return project;
};
