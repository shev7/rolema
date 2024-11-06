import { and, desc, eq, inArray, notInArray, countDistinct } from "drizzle-orm";

import { db } from "../db";
import { Project, User } from "../types";
import { project } from "../schema";

export type QueryProjectsProps = {
  ownerId?: Project["owner_id"];
  projectId?: Project["id"];
  userId?: User["id"];
  statuses?: Array<Project["status"]>;
  excludeStatuses?: Array<Project["status"]>;
};

export type QueryProjectsReturnType = Awaited<ReturnType<typeof queryProjects>>;

export const queryProjects = async ({
  ownerId,
  projectId,
  statuses,
  excludeStatuses,
  userId,
}: QueryProjectsProps = {}) => {
  const where = [];

  if (ownerId) {
    where.push(eq(db.schema.project.owner_id, ownerId));
  }

  if (projectId) {
    where.push(eq(db.schema.project.id, projectId));
  }

  if (statuses?.length) {
    where.push(inArray(db.schema.project.status, statuses));
  }

  if (excludeStatuses?.length) {
    where.push(notInArray(db.schema.project.status, excludeStatuses));
  }

  if (!userId) {
    const projects = await db.db
      .select({
        project: {
          ...db.schema.project,
          users_count: countDistinct(db.schema.project_user.user_id),
          roles_count: countDistinct(db.schema.project_role.id),
        },
      })
      .from(db.schema.project)
      .leftJoin(
        db.schema.project_user,
        eq(db.schema.project_user.project_id, db.schema.project.id),
      )
      .leftJoin(
        db.schema.project_role,
        eq(db.schema.project_role.project_id, db.schema.project.id),
      )
      .where(and(...where))
      .groupBy(db.schema.project.id)
      .orderBy(desc(db.schema.project.created_at));

    return projects.map((project) => project.project);
  }

  where.push(eq(db.schema.project_user.user_id, userId));

  const projects = await db.db
    .select({ project: db.schema.project })
    .from(db.schema.project)
    .leftJoin(
      db.schema.project_user,
      eq(db.schema.project.id, db.schema.project_user.project_id),
    )
    .where(and(...where))
    .orderBy(desc(db.schema.project.created_at));

  return projects.map((project) => project.project);
};
