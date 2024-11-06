import { sql } from "drizzle-orm";

export const generateId = (length: number) => {
  return sql.raw(`md5(random()::text)::varchar(${length})`);
};
