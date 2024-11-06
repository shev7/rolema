import { NextPageProps } from "@repo/types";

import { queryProjectRoles } from "@queries/query-project-roles";

import { Slide } from "@components/slide";

import { queryProjectRolePermissions } from "@queries/query-project-role-permissions";

import { Content } from "./content";
import { queryProjectRole } from "@queries/query-project-role";

export const ProjectRolePermissionsPage = async ({
  params: { projectId, projectRoleId },
}: NextPageProps<{}, { projectId: string; projectRoleId: string }>) => {
  const [projectRole, projectRolePermissions, projectRoles] = await Promise.all(
    [
      queryProjectRole(projectRoleId),
      queryProjectRolePermissions(projectRoleId),
      queryProjectRoles({ projectId }),
    ],
  );

  return (
    <Slide duration={300} direction="right">
      <Content
        projectRole={projectRole}
        projectRoles={projectRoles}
        permissions={projectRolePermissions}
      />
    </Slide>
  );
};
