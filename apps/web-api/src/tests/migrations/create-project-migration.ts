import { db } from "@repo/database";

import { TEST_SQL_DATE } from "@tests/constants";

import {
  CreateProjectProps,
  testCreateProject,
} from "@tests/helpers/factories";

export const testCreateProjectMigration = (props: CreateProjectProps) => {
  return () => {
    return db.db.insert(db.schema.project).values({
      ...testCreateProject(props),
      created_at: TEST_SQL_DATE,
      updated_at: TEST_SQL_DATE,
    });
  };
};
