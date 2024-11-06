import { and, desc, eq } from "drizzle-orm";

import { db } from "../db";
import { ProjectUser } from "../types";

export type QueryProjectUserByUserIdAndProjectIdReturnType = Awaited<
  ReturnType<typeof queryProjectUser>
>;

export type QueryProjectUserProps = {
  userId: ProjectUser["user_id"];
  projectId: ProjectUser["project_id"];
};

export const queryProjectUser = async ({
  userId,
  projectId,
}: QueryProjectUserProps) => {
  const [projectUser] = await db.db
    .select()
    .from(db.schema.project_user)
    .where(
      and(
        eq(db.schema.project_user.project_id, projectId),
        eq(db.schema.project_user.user_id, userId),
      ),
    );

  return projectUser;
};
