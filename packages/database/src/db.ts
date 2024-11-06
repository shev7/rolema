import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import constants from "@repo/constants";

import * as schema from "./schema";

export const pool = new Pool(
  constants.config.NODE_ENV === "test"
    ? {
        host: constants.config.POSTGRES_HOST,
        port: constants.config.POSTGRES_PORT,
        password: constants.config.POSTGRES_PASSWORD,
        user: constants.config.POSTGRES_USER,
        database: constants.config.POSTGRES_DB,
      }
    : {
        connectionString: constants.config.DB_URL,
      },
);

export const db = {
  db: drizzleNode(pool, {
    schema,
  }),
  schema,
};
