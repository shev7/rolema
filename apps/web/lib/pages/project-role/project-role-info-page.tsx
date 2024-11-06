import { ProjectRoleCard } from "@components/ProjectRoleCard";
import { queryProjectRole } from "@queries/query-project-role";
import { ProjectRole } from "@repo/database";
import { NextPageProps } from "@repo/types";

export const ProjectRoleInfoPage = async ({
  params: { projectRoleId },
}: NextPageProps<{}, { projectRoleId: ProjectRole["id"] }>) => {
  const projectRole = await queryProjectRole(projectRoleId);

  return <ProjectRoleCard projectRole={projectRole} />;
};
