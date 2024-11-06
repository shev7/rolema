import { INestApplication } from "@nestjs/common";

import { pool } from "@repo/database";

export const testAfterAll = async (app?: INestApplication) => {
  await app?.close();
  await pool.end();
};
