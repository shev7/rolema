import { Controller, Get, UseGuards } from "@nestjs/common";

import constants from "@repo/constants";

import { Project, ProjectRole, QueryProjectUsersProps } from "@repo/database";

import { ProjectOwnerGuard } from "@guards/project-owner.guard";

import { ProjectUsersService } from "./project-users.service";
import {
  ExcludeProjectRoleIdsQuery,
  LimitOptionalQuery,
  ProjectIdParam,
  ProjectRoleIdOptionalQuery,
} from "@repo/nest";
import { ProjectStatusGuard } from "@guards/project-status.guard";
import { EveryGuard, SomeGuard } from "@repo/nest/guards";
import { PermissionsGuard } from "@guards/permissions.guard";

@Controller(`projects/:${constants.nav.sp.keys.projectId}/users`)
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @UseGuards(
    EveryGuard(
      ProjectStatusGuard("ready", "paused"),
      SomeGuard(ProjectOwnerGuard(), PermissionsGuard("role:read")),
    ),
  )
  @Get()
  getProjectUsers(
    @ProjectIdParam()
    projectId: Project["id"],
    @LimitOptionalQuery()
    limit?: string,
    @ProjectRoleIdOptionalQuery()
    projectRoleId?: ProjectRole["id"],
    @ExcludeProjectRoleIdsQuery()
    excludeProjectRoleIds?: QueryProjectUsersProps["excludeProjectRoleIds"],
  ) {
    return this.projectUsersService.getProjectUsers({
      projectId,
      excludeStatuses: ["deleted"],
      limit: typeof limit === "number" ? Number(limit) : undefined,
      projectRoleId,
      excludeProjectRoleIds,
    });
  }
}
