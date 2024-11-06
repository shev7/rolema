import { Controller, Get, UseGuards } from "@nestjs/common";

import constants from "@repo/constants";
import { Project } from "@repo/database";

import { ProjectOwnerGuard } from "@guards/project-owner.guard";

import { ProjectPermissionsService } from "./project-permissions.service";
import { ProjectIdParam } from "@repo/nest";

@Controller(`projects/:${constants.nav.sp.keys.projectId}/permissions`)
export class ProjectPermissionsController {
  constructor(
    private readonly projectPermissionsService: ProjectPermissionsService,
  ) {}

  @UseGuards(ProjectOwnerGuard("ready", "paused"))
  @Get()
  getProjectPermissions(
    @ProjectIdParam()
    projectId: Project["id"],
  ) {
    return this.projectPermissionsService.getProjectPermissions(projectId);
  }
}
