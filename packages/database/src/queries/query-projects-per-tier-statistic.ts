import { count, eq } from "drizzle-orm";

import { db } from "../db";

export type QueryProjectsPerTierStatisticReturnType = Awaited<
  ReturnType<typeof queryProjectsPerTierStatistic>
>;

export const queryProjectsPerTierStatistic = () => {
  return db.db
    .select({
      tier: {
        id: db.schema.tier.id,
        name: db.schema.tier.name,
      },
      projects_count: count(db.schema.project_tier.tier_id),
    })
    .from(db.schema.tier)
    .leftJoin(
      db.schema.project_tier,
      eq(db.schema.project_tier.tier_id, db.schema.tier.id),
    )
    .groupBy(db.schema.project_tier.tier_id, db.schema.tier.id);
};
