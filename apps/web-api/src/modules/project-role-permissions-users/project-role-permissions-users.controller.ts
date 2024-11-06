import { Controller, Get } from "@nestjs/common";

import { ProjectIdParam, ProjectRoleIdParam } from "@repo/nest/decorators";
import constants from "@repo/constants";
import { ProjectRole } from "@repo/database";
import { ProjectRolePermissionsUsersService } from "./project-role-permissions-users.service";

@Controller(
  `projects/:${constants.nav.sp.keys.projectId}/roles/:${constants.nav.sp.keys.projectRoleId}/permissions/users`,
)
export class ProjectRolePermissionsUsersController {
  constructor(
    private readonly projectRolePermissionsUsersService: ProjectRolePermissionsUsersService,
  ) {}

  @Get()
  getUsersByPermission(
    @ProjectIdParam()
    projectId: ProjectRole["project_id"],
    @ProjectRoleIdParam()
    projectRoleId: ProjectRole["id"],
  ) {
    return this.projectRolePermissionsUsersService.getUsersByPermission(
      projectId,
      projectRoleId,
    );
  }
}
