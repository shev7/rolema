import { eq } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type DeleteProjectProps = Project["id"];
export type DeleteProjectReturnType = Awaited<ReturnType<typeof deleteProject>>;

export const deleteProject = async (projectId: Project["id"]) => {
  const [project] = await db.db
    .delete(db.schema.project)
    .where(eq(db.schema.project.id, projectId))
    .returning();

  return project;
};
