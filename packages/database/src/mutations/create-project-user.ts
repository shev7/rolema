import { db } from "../db";
import { ProjectUser } from "../types";

export type CreateProjectUserProps = {
  user_id: ProjectUser["user_id"];
  project_id: ProjectUser["project_id"];
  project_role_id: ProjectUser["project_role_id"];
  updated_by: ProjectUser["updated_by"];
};

export type CreateProjectUserReturnType = Awaited<
  ReturnType<typeof createProjectUser>
>;

export const createProjectUser = async (props: CreateProjectUserProps) => {
  const [projectUser] = await db.db
    .insert(db.schema.project_user)
    .values(props)
    .returning();

  return projectUser;
};
