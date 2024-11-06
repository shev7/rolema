import { and, eq, inArray, notInArray } from "drizzle-orm";

import { db } from "../db";
import { Project } from "../types";

export type QueryProjectByIdProps = {
  projectId: Project["id"];
  ownerId?: Project["owner_id"];
  statuses?: Array<Project["status"]>;
  excludeStatuses?: Array<Project["status"]>;
};

export type QueryProjectByIdReturnType = Awaited<
  ReturnType<typeof queryProjectById>
>;

export const queryProjectById = async ({
  projectId,
  ownerId,
  excludeStatuses,
  statuses,
}: QueryProjectByIdProps) => {
  const where = [eq(db.schema.project.id, projectId)];

  if (ownerId) {
    where.push(eq(db.schema.project.owner_id, ownerId));
  }

  if (excludeStatuses?.length) {
    where.push(notInArray(db.schema.project.status, excludeStatuses));
  }

  if (statuses?.length) {
    where.push(inArray(db.schema.project.status, statuses));
  }

  const [project] = await db.db
    .select()
    .from(db.schema.project)
    .where(and(...where));

  return project;
};
