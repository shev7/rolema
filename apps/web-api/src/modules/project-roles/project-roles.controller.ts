import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import {
  createProjectRoleSchema,
  type CreateProjectRoleSchema,
  updateProjectRoleSchema,
  type UpdateProjectRoleSchema,
  updateProjectRolePermissionsSchema,
  type UpdateProjectRolePermissionsSchema,
} from "@repo/validation";
import { ZodPipe } from "@repo/nest/pipes";
import { ProjectRole, QueryProjectUsersProps, type User } from "@repo/database";
import {
  ExcludeProjectRoleIdsQuery,
  FallbackRoleIdOptionalQuery,
  ProjectIdParam,
  ProjectRoleIdParam,
  SessionUser,
} from "@repo/nest/decorators";
import constants from "@repo/constants";
import { RolesGuard, SomeGuard, EveryGuard } from "@repo/nest/guards";

import { ProjectRoleGuard } from "@guards/project-role.guard";

import { UserRoleGuard } from "@guards/user-role.guard";
import { PermissionsGuard } from "@guards/permissions.guard";
import { ProjectOwnerGuard } from "@guards/project-owner.guard";

import { ProjectRolesService } from "./project-roles.service";
import { ProjectUsersService } from "../project-users";

@Controller("projects")
export class ProjectRolesController {
  constructor(
    private readonly projectRolesService: ProjectRolesService,
    private readonly projectUsersService: ProjectUsersService,
  ) {}

  @UseGuards(
    SomeGuard(
      EveryGuard(UserRoleGuard("creator"), ProjectRoleGuard),
      PermissionsGuard("role:read"),
    ),
  )
  @Post("roles")
  createProjectRole(
    @Body(new ZodPipe(createProjectRoleSchema)) body: CreateProjectRoleSchema,
    @SessionUser() user: User,
  ) {
    return this.projectRolesService.createProjectRole({
      ...body,
      created_by: user.id,
    });
  }

  @Get(`roles/:${constants.nav.sp.keys.projectRoleId}`)
  getProjectRole(
    @ProjectRoleIdParam()
    projectRoleId: ProjectRole["id"],
  ) {
    return this.projectRolesService.getProjectRole(projectRoleId);
  }

  @UseGuards(EveryGuard(RolesGuard("creator"), ProjectRoleGuard))
  @Patch(`/roles/:${constants.nav.sp.keys.projectRoleId}`)
  updateProjectRole(
    @ProjectRoleIdParam()
    id: ProjectRole["id"],
    @Body(new ZodPipe(updateProjectRoleSchema)) body: UpdateProjectRoleSchema,
    @SessionUser() user: User,
  ) {
    return this.projectRolesService.updateProjectRole({
      id,
      fields: body,
      updatedBy: user.id,
    });
  }

  @UseGuards(EveryGuard(RolesGuard("creator"), ProjectRoleGuard))
  @Delete(`roles/:${constants.nav.sp.keys.projectRoleId}`)
  deleteProjectRole(
    @ProjectRoleIdParam()
    id: ProjectRole["id"],
    @SessionUser() user: User,
    @FallbackRoleIdOptionalQuery()
    fallbackRoleId?: ProjectRole["id"],
  ): Promise<ProjectRole> {
    return this.projectRolesService.deleteProjectRole(
      id,
      user.id,
      fallbackRoleId,
    );
  }

  @UseGuards(
    EveryGuard(
      ProjectOwnerGuard("ready", "paused"),
      SomeGuard(RolesGuard("creator"), PermissionsGuard("role:read")),
    ),
  )
  @Get(`:${constants.nav.sp.keys.projectId}/roles`)
  getProjectRoles(
    @ProjectIdParam()
    projectId: ProjectRole["project_id"],
    @ExcludeProjectRoleIdsQuery()
    excludeProjectRoleIds?: QueryProjectUsersProps["excludeProjectRoleIds"],
  ) {
    return this.projectRolesService.getProjectRoles({
      projectId,
      excludeProjectRoleIds,
    });
  }

  @UseGuards(ProjectRoleGuard)
  @Get(`roles/:${constants.nav.sp.keys.projectRoleId}/users`)
  getProjectRoleUsers(
    @ProjectRoleIdParam()
    projectRoleId: ProjectRole["id"],
  ) {
    return this.projectUsersService.getProjectUsers({
      projectRoleId,
      excludeStatuses: ["deleted"],
    });
  }

  @UseGuards(ProjectRoleGuard)
  @Get(`roles/:${constants.nav.sp.keys.projectRoleId}/users/count`)
  getProjectRoleUsersCount(
    @ProjectRoleIdParam()
    projectRoleId: ProjectRole["id"],
  ) {
    return this.projectUsersService.getProjectUsersCount({
      projectRoleId,
      excludeStatuses: ["deleted"],
    });
  }

  @Get(`roles/:${constants.nav.sp.keys.projectRoleId}/permissions`)
  getProjectRolePermissions(
    @ProjectRoleIdParam()
    projectRoleId: ProjectRole["id"],
  ) {
    return this.projectRolesService.getProjectRolePermissions({
      permissionProjectRoleId: projectRoleId,
    });
  }

  @UseGuards(ProjectRoleGuard)
  @Patch(`roles/:${constants.nav.sp.keys.projectRoleId}/permissions`)
  updateProjectRolePermissions(
    @ProjectRoleIdParam()
    projectRoleId: ProjectRole["id"],
    @Body(new ZodPipe(updateProjectRolePermissionsSchema))
    body: UpdateProjectRolePermissionsSchema,
    @SessionUser() user: User,
  ) {
    return this.projectRolesService.updateProjectRolePermissions({
      permissionProjectRoleId: projectRoleId,
      permissions: body.permissions,
      updatedBy: user.id,
    });
  }
}
