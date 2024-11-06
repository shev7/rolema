import { webAPI } from "@api/web";
import { Permission, ProjectRole } from "@repo/database";

export const queryProjectRolePermissions = (
  projectRoleId: ProjectRole["id"],
) => {
  return webAPI.get<Array<Permission>>(
    `/projects/roles/${projectRoleId}/permissions`,
  );
};
