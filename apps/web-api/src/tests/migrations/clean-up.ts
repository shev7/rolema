import { sql } from "drizzle-orm";
import { db } from "@repo/database";

const testGetAllTables = async () => {
  const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.db.execute(query);

  return tables.rows.map((table) => table.table_name as string);
};

export const testDropAll = async () => {
  for (const tableName of await testGetAllTables()) {
    await db.db.execute(sql.raw(`DROP TABLE "${tableName}" CASCADE;`));
  }
};

export const testTruncateAll = async () => {
  for (const tableName of await testGetAllTables()) {
    await db.db.execute(sql.raw(`TRUNCATE TABLE "${tableName}" CASCADE;`));
  }
};
