import { and, count, eq, gt } from "drizzle-orm";
import { db } from "../db";
import { Project } from "../types";
import { dayjs } from "@repo/utils";

export type QueryProjectStatisticsProps = Project["id"];
export type QueryProjectStatisticsReturnType = Awaited<
  ReturnType<typeof queryProjectStatistics>
>;

export const queryProjectStatistics = async (
  projectId: QueryProjectStatisticsProps,
) => {
  const monthAgo = dayjs().subtract(1, "month").toDate();

  const [
    [data],
    [projectUsersCount],
    [projectRolesCount],
    [joinedProjectUsersMonthAgoCount],
  ] = await Promise.all([
    db.db
      .select({
        project: {
          id: db.schema.project.id,
        },
        project_tier: db.schema.project_tier,
        tier: db.schema.tier,
      })
      .from(db.schema.project)
      .leftJoin(
        db.schema.project_tier,
        eq(db.schema.project_tier.project_id, db.schema.project.id),
      )
      .leftJoin(
        db.schema.tier,
        eq(db.schema.tier.id, db.schema.project_tier.tier_id),
      )
      .where(eq(db.schema.project.id, projectId)),
    db.db
      .select({ count: count() })
      .from(db.schema.project_user)
      .where(eq(db.schema.project_user.project_id, projectId)),
    db.db
      .select({ count: count() })
      .from(db.schema.project_role)
      .where(eq(db.schema.project_role.project_id, projectId)),
    db.db
      .select({ count: count() })
      .from(db.schema.project_user)
      .where(
        and(
          eq(db.schema.project_user.project_id, projectId),
          gt(db.schema.project_user.created_at, monthAgo),
        ),
      ),
  ]);

  if (!data) {
    return null;
  }

  return {
    ...data,
    project_users: {
      total: projectUsersCount!.count,
      in_month: joinedProjectUsersMonthAgoCount!.count,
    },
    project_roles_count: projectRolesCount!.count,
  };
};
