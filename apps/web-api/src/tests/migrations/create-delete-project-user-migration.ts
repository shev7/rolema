import { eq } from "drizzle-orm";

import { db } from "@repo/database";
import { testProjectUserId } from "@tests/helpers/factories";

export const testCreateDeleteProjectUserMigration = (
  projectIndex: number,
  userIndex: number,
) => {
  return () => {
    return db.db
      .delete(db.schema.project_user)
      .where(
        eq(
          db.schema.project_user.id,
          testProjectUserId(projectIndex, userIndex),
        ),
      );
  };
};
