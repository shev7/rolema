import { Controller, UseGuards, Get, Patch, Body } from "@nestjs/common";

import { ZodPipe } from "@repo/nest/pipes";
import {
  type UpdateProjectSchema,
  updateProjectSchema,
} from "@repo/validation";
import { ProjectIdParam, SessionUser } from "@repo/nest/decorators";
import { Project, type User } from "@repo/database";
import constants from "@repo/constants";

import { ProjectOwnerGuard } from "@guards/project-owner.guard";

import { ProjectService } from "./project.service";

@Controller(`projects/:${constants.nav.sp.keys.projectId}`)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(ProjectOwnerGuard("ready", "paused"))
  @Get()
  getProject(
    @ProjectIdParam()
    projectId: Project["id"],
    @SessionUser() user: User,
  ) {
    return this.projectService.getProject({
      projectId,
      ownerId: user.id,
      statuses: ["ready", "paused"],
    });
  }

  @UseGuards(ProjectOwnerGuard("ready"))
  @Patch()
  updateProject(
    @ProjectIdParam()
    id: Project["id"],
    @SessionUser() user: User,
    @Body(new ZodPipe(updateProjectSchema))
    { project: { name, description } }: UpdateProjectSchema,
  ) {
    return this.projectService.updateProject({
      projectId: id,
      project: { name, description },
      updatedBy: user.id,
      statuses: ["ready", "paused"],
    });
  }

  @UseGuards(ProjectOwnerGuard("ready", "paused"))
  @Get(`statistics`)
  getProjectStatistics(
    @ProjectIdParam()
    id: Project["id"],
  ) {
    return this.projectService.getProjectStatistics(id);
  }
}
