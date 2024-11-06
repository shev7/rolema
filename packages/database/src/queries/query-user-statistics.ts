import { count, eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../types";

export type QueryUserStatisticsProps = User["id"];
export type QueryUserStatisticsReturnType = Awaited<
  ReturnType<typeof queryUserStatistics>
>;

export const queryUserStatistics = async (userId: QueryUserStatisticsProps) => {
  const [[projectUsersCount], [projectsCount]] = await Promise.all([
    db.db
      .select({
        count: count(),
      })
      .from(db.schema.project_user)
      .where(eq(db.schema.project_user.user_id, userId)),
    db.db
      .select({
        count: count(),
      })
      .from(db.schema.project)
      .where(eq(db.schema.project.owner_id, userId)),
  ]);

  return {
    project_users_count: projectUsersCount!.count,
    projects_count: projectsCount!.count,
    total_projects_count: projectUsersCount!.count + projectsCount!.count,
  };
};
