import { db } from "@repo/database";

import { TEST_SQL_DATE } from "@tests/constants";

import {
  CreateProjectRoleProps,
  testCreateProjectRole,
} from "@tests/helpers/factories";

export const testCreateProjectRoleMigration = (
  props: CreateProjectRoleProps,
) => {
  return () => {
    return db.db.insert(db.schema.project_role).values({
      ...testCreateProjectRole(props),
      created_at: TEST_SQL_DATE,
      updated_at: TEST_SQL_DATE,
    });
  };
};
