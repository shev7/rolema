import { desc } from "drizzle-orm";

import { db } from "../db";

export type QueryTiersReturnType = Awaited<ReturnType<typeof queryTiers>>;

export const queryTiers = () => {
  return db.db
    .select()
    .from(db.schema.tier)
    .orderBy(desc(db.schema.tier.created_at));
};
