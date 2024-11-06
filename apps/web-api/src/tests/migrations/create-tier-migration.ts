import { sql } from "drizzle-orm";

import { db } from "@repo/database";

import { TEST_SQL_DATE } from "@tests/constants";
import { testCreateTier } from "@tests/helpers/factories";

export const testCreateTierMigration = (index: number) => {
  return () => {
    return db.db.insert(db.schema.tier).values({
      ...testCreateTier(index),
      benefits: sql`ARRAY[]::text[]`,
      price_per_month_monthly: sql`'[]'::jsonb`,
      price_per_month_annually: sql`'[]'::jsonb`,
      created_at: TEST_SQL_DATE,
      updated_at: TEST_SQL_DATE,
    });
  };
};
