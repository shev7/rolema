import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type UpdateProjectsStatusProps = {
  ownerId: Project["owner_id"];
  newStatus: Project["status"];
};
export type UpdateProjectsStatusReturnType = Awaited<
  ReturnType<typeof updateProjectsStatus>
>;

export const updateProjectsStatus = async ({
  ownerId,
  newStatus,
}: UpdateProjectsStatusProps) => {
  const projects = await db.db
    .update(db.schema.project)
    .set({ status: newStatus, updated_at: sql`now()` })
    .where(eq(db.schema.project.owner_id, ownerId))
    .returning();

  return projects;
};
