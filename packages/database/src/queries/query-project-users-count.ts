import { and, count, eq, notInArray, or, SQL } from "drizzle-orm";

import { db } from "../db";
import { ProjectUser } from "../types";

export type QueryProjectUsersCountProps = {
  excludeStatuses?: [ProjectUser["status"], ...ProjectUser["status"][]];
  ids?: ProjectUser["id"][];
} & (
  | {
      projectRoleId: ProjectUser["project_role_id"];
    }
  | {
      userId: ProjectUser["user_id"];
      projectId?: ProjectUser["project_id"];
    }
  | {
      projectId: ProjectUser["project_id"];
      projectRoleId?: ProjectUser["project_role_id"];
    }
);

export type QueryProjectUsersCountReturnType = Awaited<
  ReturnType<typeof queryProjectUsersCount>
>;

export const queryProjectUsersCount = async (
  props: QueryProjectUsersCountProps,
) => {
  const where = [];

  if ("userId" in props) {
    where.push(eq(db.schema.project_user.user_id, props.userId));
  }

  if ("projectId" in props && props.projectId) {
    where.push(eq(db.schema.project_user.project_id, props.projectId));
  }

  if ("projectRoleId" in props && props.projectRoleId) {
    where.push(eq(db.schema.project_user.project_role_id, props.projectRoleId));
  }

  if (props.excludeStatuses?.length) {
    where.push(
      notInArray(db.schema.project_user.status, props.excludeStatuses),
    );
  }

  if (props.ids?.length) {
    where.push(or(...props.ids.map((id) => eq(db.schema.project_user.id, id))));
  }

  const [data] = await db.db
    .select({
      count: count(),
    })
    .from(db.schema.project_user)
    .where(where.length > 1 ? and(...where) : where[0]);

  return data!;
};
