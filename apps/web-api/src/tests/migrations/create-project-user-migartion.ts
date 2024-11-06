import { db } from "@repo/database";

import { TEST_SQL_DATE } from "@tests/constants";
import {
  CreateProjectUserProps,
  testCreateProjectUser,
} from "@tests/helpers/factories";

export const testCreateProjectUserMigration = (
  props: CreateProjectUserProps,
) => {
  return () => {
    return db.db.insert(db.schema.project_user).values({
      ...testCreateProjectUser(props),
      created_at: TEST_SQL_DATE,
      updated_at: TEST_SQL_DATE,
    });
  };
};
