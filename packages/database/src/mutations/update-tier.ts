import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { Tier } from "../types";

export type UpdateTierProps = {
  id: Tier["id"];
  name: Tier["name"];
  description: Tier["description"];
  benefits: Tier["benefits"];
  updated_by: Tier["updated_by"];
};
export type UpdateTierReturnType = Awaited<ReturnType<typeof updateTier>>;

export const updateTier = async ({
  id,
  updated_by,
  ...props
}: UpdateTierProps) => {
  const [tier] = await db.db
    .update(db.schema.tier)
    .set({ ...props, updated_at: sql`now()`, updated_by })
    .where(eq(db.schema.tier.id, id))
    .returning();

  return tier;
};
