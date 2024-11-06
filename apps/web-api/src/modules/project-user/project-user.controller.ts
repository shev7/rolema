import {
  Controller,
  Delete,
  Get,
  UseGuards,
  Patch,
  Body,
} from "@nestjs/common";

import constants from "@repo/constants";
import { ZodPipe } from "@repo/nest/pipes";
import { ProjectIdParam, SessionUser, UserIdParam } from "@repo/nest";
import {
  type UpdateProjectUserSchema,
  type UpdateProjectUserStatusSchema,
  updateProjectUserSchema,
  updateProjectUserStatusSchema,
} from "@repo/validation";
import { Project, ProjectUser, type User } from "@repo/database";
import { EveryGuard, SomeGuard } from "@repo/nest/guards";

import { UserOwnerGuard } from "@guards/user-owner.guard";

import { PermissionsGuard } from "@guards/permissions.guard";
import { ProjectOwnerGuard } from "@guards/project-owner.guard";

import { ProjectStatusGuard } from "@guards/project-status.guard";

import { ProjectUserService } from "./project-user.service";

@Controller(
  `projects/:${constants.nav.sp.keys.projectId}/users/:${constants.nav.sp.keys.userId}`,
)
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @UseGuards(
    EveryGuard(
      ProjectStatusGuard("ready", "paused"),
      SomeGuard(
        UserOwnerGuard,
        ProjectOwnerGuard(),
        PermissionsGuard("role:read"),
      ),
    ),
  )
  @Get()
  getProjectUser(
    @ProjectIdParam()
    projectId: Project["id"],
    @UserIdParam()
    userId: User["id"],
    @SessionUser() user: User,
  ) {
    return this.projectUserService.getProjectsUser({
      projectId,
      userId,
      statuses: userId === user.id ? ["ready"] : undefined,
      excludeStatuses: ["deleted"],
    });
  }

  @UseGuards(ProjectOwnerGuard("ready"))
  @Patch()
  updateProjectUser(
    @ProjectIdParam()
    projectId: Project["id"],
    @UserIdParam()
    userId: ProjectUser["user_id"],
    @Body(new ZodPipe(updateProjectUserSchema))
    { project_role_id }: UpdateProjectUserSchema,
    @SessionUser() user: User,
  ) {
    return this.projectUserService.updateProjectUser({
      projectId,
      userId,
      updatedBy: user.id,
      fields: { project_role_id },
    });
  }

  @UseGuards(ProjectOwnerGuard("ready"))
  @Patch(`status`)
  updateProjectUserStatus(
    @ProjectIdParam()
    projectId: Project["id"],
    @UserIdParam()
    userId: ProjectUser["user_id"],
    @Body(new ZodPipe(updateProjectUserStatusSchema))
    { status }: UpdateProjectUserStatusSchema,
    @SessionUser() user: User,
  ) {
    return this.projectUserService.updateProjectUser({
      userId,
      projectId,
      updatedBy: user.id,
      fields: {
        status,
      },
    });
  }

  @UseGuards(ProjectOwnerGuard("ready"))
  @Delete()
  deleteProjectUser(
    @UserIdParam()
    userId: ProjectUser["user_id"],
    @ProjectIdParam()
    projectId: ProjectUser["project_id"],
    @SessionUser() user: User,
  ) {
    return this.projectUserService.deleteProjectUser({
      userId,
      projectId,
      updatedBy: user.id,
    });
  }
}
