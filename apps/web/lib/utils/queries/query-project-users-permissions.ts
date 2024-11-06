import { ProjectRolePermissionsUsersServiceBase } from "@repo/nest";

import { webAPI } from "@api/web";
import { Project, ProjectRole } from "@repo/database";

export const queryProjectUsersPermissions = (
  projectId: Project["id"],
  projectRoleId: ProjectRole["id"],
) => {
  return webAPI.get<
    Awaited<
      ReturnType<ProjectRolePermissionsUsersServiceBase["getUsersByPermission"]>
    >
  >(`/projects/${projectId}/roles/${projectRoleId}/permissions/users`, {
    cache: "no-cache",
  });
};
