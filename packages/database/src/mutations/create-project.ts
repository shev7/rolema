import { db } from "../db";
import { Project, ProjectTier } from "../types";

export type CreateProjectProps = {
  name: Project["name"];
  description: Project["description"];
  owner_id: Project["owner_id"];
  created_by: Project["created_by"];
  status: Project["status"];
  tier_id: ProjectTier["tier_id"];
  ends_at: ProjectTier["ends_at"];
};

export type CreateProjectReturnType = Awaited<ReturnType<typeof createProject>>;

export const createProject = async (props: CreateProjectProps) => {
  return db.db.transaction(async (tx) => {
    const [project] = await tx
      .insert(db.schema.project)
      .values({
        updated_by: props.created_by,
        ...props,
      })
      .returning();

    if (!project) {
      return null;
    }

    const [projectTier] = await tx
      .insert(db.schema.project_tier)
      .values({
        project_id: project.id,
        tier_id: props.tier_id,
        ends_at: props.ends_at,
        created_by: props.created_by,
        updated_by: props.created_by,
      })
      .returning();

    return { project, project_tier: projectTier };
  });
};
