import { Project, ProjectRole, queryProjectUsers } from "@repo/database";
import { ProjectRolePermissionsUsersServiceBase } from "../types";

export class ProjectRolePermissionsUsersService
  implements ProjectRolePermissionsUsersServiceBase
{
  getUsersByPermission(
    projectId: Project["id"],
    projectRoleId: ProjectRole["id"],
  ) {
    return queryProjectUsers({ projectId, projectRoleId });
  }
}
