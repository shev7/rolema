import { db } from "@repo/database";

import { TEST_SQL_DATE } from "@tests/constants";
import {
  CreateUserProps,
  testCreateUser,
  testCreateUserInfo,
} from "@tests/helpers/factories";

export const testCreateUserMigration = (props: CreateUserProps) => {
  return async () => {
    await db.db.insert(db.schema.user).values({
      ...testCreateUser(props),
      created_at: TEST_SQL_DATE,
      updated_at: TEST_SQL_DATE,
    });

    await db.db.insert(db.schema.user_info).values({
      ...testCreateUserInfo(props),
      email_verified_at: TEST_SQL_DATE,
      updated_at: TEST_SQL_DATE,
    });
  };
};
