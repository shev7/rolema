import { and, eq, inArray, asc, notInArray, SQL, desc } from "drizzle-orm";

import { db } from "../db";
import { Project, ProjectRole, ProjectUser, User } from "../types";

import constants from "@repo/constants";

export type QueryProjectUsersProps = {
  userId?: User["id"];
  projectId?: Project["id"];
  projectRoleId?: ProjectRole["id"];
  statuses?: ProjectUser["status"][];
  excludeStatuses?: ProjectUser["status"][];
  excludeProjectRoleIds?: [ProjectRole["id"], ...ProjectRole["id"][]];
  ownerId?: Project["owner_id"];
  limit?: number;
  userRoles?: Array<User["role"]>;
};
export type QueryProjectUsersReturnType = Awaited<
  ReturnType<typeof queryProjectUsers>
>;

export const queryProjectUsers = async ({
  userId,
  projectId,
  projectRoleId,
  statuses,
  excludeStatuses,
  excludeProjectRoleIds,
  ownerId,
  limit,
  userRoles,
}: QueryProjectUsersProps = {}) => {
  const where: Array<SQL<unknown>> = [];

  if (userId) {
    where.push(eq(db.schema.project_user.user_id, userId));
  }

  if (projectId) {
    where.push(eq(db.schema.project_user.project_id, projectId));
  }

  if (projectRoleId) {
    where.push(eq(db.schema.project_user.project_role_id, projectRoleId));
  }

  if (ownerId) {
    where.push(eq(db.schema.project.owner_id, ownerId));
  }

  if (statuses?.length) {
    where.push(inArray(db.schema.project_user.status, statuses));
  }

  if (excludeStatuses?.length) {
    where.push(notInArray(db.schema.project_user.status, excludeStatuses));
  }

  if (excludeProjectRoleIds?.length) {
    where.push(
      notInArray(db.schema.project_user.project_role_id, excludeProjectRoleIds),
    );
  }

  if (userRoles?.length) {
    where.push(inArray(db.schema.user.role, userRoles));
  }

  const projectUsers = await db.db
    .select({
      project_user: db.schema.project_user,
      project_role: db.schema.project_role,
      user: db.schema.user,
      user_info: {
        email_verified: db.schema.user_info.email_verified,
        email_verified_at: db.schema.user_info.email_verified_at,
      },
      project: {
        id: db.schema.project.id,
        name: db.schema.project.name,
        description: db.schema.project.description,
        status: db.schema.project.status,
      },
    })
    .from(db.schema.project_user)
    .leftJoin(
      db.schema.project,
      eq(db.schema.project.id, db.schema.project_user.project_id),
    )
    .leftJoin(
      db.schema.project_role,
      eq(db.schema.project_role.id, db.schema.project_user.project_role_id),
    )
    .leftJoin(
      db.schema.user,
      eq(db.schema.user.id, db.schema.project_user.user_id),
    )
    .leftJoin(
      db.schema.user_info,
      eq(db.schema.user_info.user_id, db.schema.project_user.user_id),
    )
    .where(where.length > 1 ? and(...where) : where[0])
    .orderBy(desc(db.schema.project_user.created_at))
    .limit(limit || constants.nav.sp.limit.max);

  return projectUsers
    .filter((projectUser) => projectUser?.project_user)
    .map(({ project_user, project_role, user, user_info, project }) => ({
      project_user: project_user!,
      project_role: project_role!,
      user: user!,
      user_info: user_info!,
      project: project!,
    }))
    .filter(
      ({ project_user, project_role }) =>
        project_user.project_role_id === project_role.id,
    );
};
