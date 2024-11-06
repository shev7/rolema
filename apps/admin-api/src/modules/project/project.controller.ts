import { Body, Controller, Delete, Get, Patch } from "@nestjs/common";

import {
  updateProjectSchema,
  type UpdateProjectSchema,
  type UpdateProjectStatusSchema,
  updateProjectStatusSchema,
} from "@repo/validation";
import { ZodPipe } from "@repo/nest/pipes";
import { Project, type User } from "@repo/database";
import { ProjectIdParam, SessionUser } from "@repo/nest/decorators";
import constants from "@repo/constants";

import { ProjectService } from "./project.service";

@Controller(`projects/:${constants.nav.sp.keys.projectId}`)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Patch(`status`)
  updateProjectStatus(
    @ProjectIdParam()
    projectId: Project["id"],
    @Body(new ZodPipe(updateProjectStatusSchema))
    { status }: UpdateProjectStatusSchema,
    @SessionUser() user: User,
  ) {
    return this.projectService.updateProjectStatus({
      projectId,
      status,
      updatedBy: user.id,
    });
  }

  @Patch()
  updateProject(
    @ProjectIdParam()
    projectId: Project["id"],
    @Body(new ZodPipe(updateProjectSchema)) body: UpdateProjectSchema,
    @SessionUser() user: User,
  ) {
    return this.projectService.updateProject({
      projectId,
      updatedBy: user.id,
      ...body,
    });
  }

  @Delete(`:${constants.nav.sp.keys.projectId}`)
  deleteProject(
    @ProjectIdParam()
    projectId: Project["id"],
  ) {
    return this.projectService.deleteProject(projectId);
  }

  @Get()
  getProject(
    @ProjectIdParam()
    projectId: Project["id"],
  ) {
    return this.projectService.getProject({ projectId });
  }

  @Get(`tier`)
  getProjectTier(
    @ProjectIdParam()
    projectId: Project["id"],
  ) {
    return this.projectService.getProjectTier(projectId);
  }
}
