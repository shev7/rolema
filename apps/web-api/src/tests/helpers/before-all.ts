import { Test, TestingModuleBuilder } from "@nestjs/testing";
import cookieParser from "cookie-parser";
import { Client } from "pg";

import constants from "@repo/constants";

import { testReadMigrations } from "./read-migrations";
import { AppModule } from "../../app.module";
import { testDropAll } from "@tests/migrations/clean-up";

export const testBeforeAll = async (
  moduleBuilderInterceptor: (
    builder: TestingModuleBuilder,
  ) => TestingModuleBuilder = (builder) => builder,
) => {
  const client = new Client({
    host: constants.config.POSTGRES_HOST,
    port: constants.config.POSTGRES_PORT,
    password: constants.config.POSTGRES_PASSWORD,
    user: constants.config.POSTGRES_USER,
    database: constants.config.POSTGRES_DB,
  });

  const [migrations, appModule] = await Promise.all([
    testReadMigrations(),
    moduleBuilderInterceptor(
      Test.createTestingModule({
        imports: [AppModule],
      }),
    ).compile(),
    client.connect(),
  ]);

  await testDropAll();

  for (const migration of migrations) {
    await client.query(migration);
  }

  const app = appModule.createNestApplication();
  await Promise.all([app.use(cookieParser()).init(), client.end()]);

  return app;
};
