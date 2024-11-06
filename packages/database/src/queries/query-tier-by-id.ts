import { eq } from "drizzle-orm";

import { db } from "../db";
import { Tier } from "../types";

export type QueryTierByIdProps = Tier["id"];
export type QueryTierByIdReturnType = Awaited<ReturnType<typeof queryTierById>>;

export const queryTierById = async (tierId: QueryTierByIdProps) => {
  const [tier] = await db.db
    .select()
    .from(db.schema.tier)
    .where(eq(db.schema.tier.id, tierId));

  return tier;
};
