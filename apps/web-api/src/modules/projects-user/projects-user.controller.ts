import { Controller, Get, UseGuards } from "@nestjs/common";

import constants from "@repo/constants";
import {
  ExcludeProjectRoleIdsQuery,
  ProjectRoleIdOptionalQuery,
  SessionUser,
  UserIdParam,
} from "@repo/nest";
import { ProjectRole, QueryProjectUsersProps, type User } from "@repo/database";

import { UserOwnerGuard } from "@guards/user-owner.guard";

import { ProjectsUserService } from "./projects-user.service";

@Controller(`projects/users/:${constants.nav.sp.keys.userId}`)
export class ProjectsUserController {
  constructor(private readonly projectsUserService: ProjectsUserService) {}

  @UseGuards(UserOwnerGuard)
  @Get()
  getProjectsUser(
    @UserIdParam()
    userId: User["id"],
    @SessionUser() user: User,
    @ProjectRoleIdOptionalQuery()
    projectRoleId?: ProjectRole["id"],
    @ExcludeProjectRoleIdsQuery()
    excludeProjectRoleIds?: QueryProjectUsersProps["excludeProjectRoleIds"],
  ) {
    return this.projectsUserService.getProjectUsers({
      userId,
      statuses: userId === user.id ? ["ready"] : undefined,
      excludeStatuses: ["deleted"],
      projectRoleId,
      excludeProjectRoleIds,
    });
  }
}
