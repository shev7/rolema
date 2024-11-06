import { desc, eq } from "drizzle-orm";

import { db } from "../db";
import { ProjectTier } from "../types";

export type QueryProjectTierProps = {
  projectId?: ProjectTier["project_id"];
};
export type QueryProjectTierReturnType = Awaited<
  ReturnType<typeof queryProjectTier>
>;

export const queryProjectTier = async ({
  projectId,
}: QueryProjectTierProps = {}) => {
  const [projectTier] = await db.db
    .select()
    .from(db.schema.project_tier)
    .leftJoin(
      db.schema.tier,
      eq(db.schema.tier.id, db.schema.project_tier.tier_id),
    )
    .where(
      projectId ? eq(db.schema.project_tier.project_id, projectId) : undefined,
    )
    .orderBy(desc(db.schema.project_tier.created_at));

  return projectTier;
};
