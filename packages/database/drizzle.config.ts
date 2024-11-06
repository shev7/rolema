import type { Config } from "drizzle-kit";

import constants from "@repo/constants";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: constants.config.DB_URL,
  },
} satisfies Config;
