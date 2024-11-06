import { and, eq, inArray } from "drizzle-orm";

import { db } from "../db";
import { ProjectUser, User } from "../types";

export type QueryProjectUsersByProjectIdProps = {
  projectId: ProjectUser["project_id"];
  roles?: Array<User["role"]>;
};
export type QueryProjectUsersByProjectIdReturnType = Awaited<
  ReturnType<typeof queryProjectUsersByProjectId>
>;

export const queryProjectUsersByProjectId = async ({
  projectId,
  roles,
}: QueryProjectUsersByProjectIdProps) => {
  const where = [eq(db.schema.project_user.project_id, projectId)];

  if (roles?.length) {
    where.push(inArray(db.schema.user.role, roles));
  }

  const projectUsers = await db.db
    .select({
      id: db.schema.user.id,
      email: db.schema.user.email,
      role: db.schema.user.role,
      status: db.schema.user.status,
      created_at: db.schema.user.created_at,
      updated_at: db.schema.user.updated_at,
      email_verified: db.schema.user_info.email_verified,
      email_verified_at: db.schema.user_info.email_verified_at,
    })
    .from(db.schema.project_user)
    .leftJoin(
      db.schema.user,
      eq(db.schema.user.id, db.schema.project_user.user_id),
    )
    .leftJoin(
      db.schema.user_info,
      eq(db.schema.user_info.user_id, db.schema.project_user.user_id),
    )
    .where(where.length > 1 ? and(...where) : where[0]);

  if (projectUsers.length > 0) {
    const [project] = projectUsers;

    if (!project?.id) {
      return undefined;
    }

    return projectUsers.map(
      ({
        id,
        email,
        role,
        status,
        created_at,
        updated_at,
        email_verified,
        email_verified_at,
      }) => ({
        id: id!,
        email: email!,
        role: role!,
        status: status!,
        created_at: created_at!,
        updated_at: updated_at!,
        email_verified: !email_verified,
        email_verified_at: email_verified_at!,
      }),
    );
  }

  return [];
};
