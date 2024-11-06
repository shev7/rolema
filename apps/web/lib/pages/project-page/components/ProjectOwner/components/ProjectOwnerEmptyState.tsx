import { NoRoles } from "@components/no-roles";

import { Project } from "@repo/database";

export const ProjectOwnerEmptyState = ({ project }: { project: Project }) => {
  return <NoRoles projectId={project.id} />;
};
