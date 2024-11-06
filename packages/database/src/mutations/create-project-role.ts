import { db } from "../db";
import { ProjectRole } from "../types";

export type CreateProjectRoleProps = {
  name: ProjectRole["name"];
  project_id: ProjectRole["project_id"];
  created_by: ProjectRole["created_by"];
};

export type CreateProjectRoleReturnType = Awaited<
  ReturnType<typeof createProjectRole>
>;

export const createProjectRole = async (props: CreateProjectRoleProps) => {
  const [projectRole] = await db.db
    .insert(db.schema.project_role)
    .values({
      updated_by: props.created_by,
      ...props,
    })
    .returning();

  return projectRole;
};
