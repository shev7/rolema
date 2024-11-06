import { sql } from "drizzle-orm";

import { db } from "@repo/database";

export const dropdAll = async () => {
  const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.db.execute(query);

  for (const table of tables.rows) {
    await db.db.execute(sql.raw(`DROP TABLE "${table.table_name}" CASCADE;`));
  }
};
