import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type UpdateProjectProps = {
  id: Project["id"];
  name: Project["name"];
  description: Project["description"];
  updatedBy: Project["updated_by"];
  statuses?: Array<Project["status"]>;
};
export type UpdateProjectReturnType = Awaited<ReturnType<typeof updateProject>>;

export const updateProject = async ({
  id,
  updatedBy,
  statuses,
  ...props
}: UpdateProjectProps) => {
  const [project] = await db.db
    .update(db.schema.project)
    .set({ ...props, updated_at: sql`now()`, updated_by: updatedBy })
    .where(
      and(
        eq(db.schema.project.id, id),
        statuses?.length
          ? inArray(db.schema.project.status, statuses)
          : undefined,
      ),
    )
    .returning();

  return project;
};
