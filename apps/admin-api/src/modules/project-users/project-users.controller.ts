import { Controller, Get } from "@nestjs/common";

import constants from "@repo/constants";
import { ProjectIdParam, UserRolesQuery } from "@repo/nest";
import { type Project, type User } from "@repo/database";

import { ProjectUsersService } from "./project-users.service";

@Controller(`projects/:${constants.nav.sp.keys.projectId}/users`)
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Get()
  getProjectUsers(
    @ProjectIdParam()
    projectId: Project["id"],
    @UserRolesQuery()
    userRoles: Array<User["role"]>,
  ) {
    return this.projectUsersService.getProjectUsers({
      projectId,
      userRoles,
    });
  }

  @Get(`count`)
  getProjectUsersCount(
    @ProjectIdParam()
    projectId: Project["id"],
  ) {
    return this.projectUsersService.getProjectUsersCount({
      projectId,
    });
  }
}
