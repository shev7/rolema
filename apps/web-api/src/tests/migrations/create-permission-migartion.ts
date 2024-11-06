import { db } from "@repo/database";

import { TEST_SQL_DATE } from "@tests/constants";
import {
  testCreatePermission,
  TestCreatePermissionProps,
} from "@tests/helpers/factories";

export const testCreatePermissionMigration = (
  props: TestCreatePermissionProps,
) => {
  return () => {
    return db.db.insert(db.schema.permission).values({
      ...testCreatePermission(props),
      created_at: TEST_SQL_DATE,
      updated_at: TEST_SQL_DATE,
    });
  };
};
