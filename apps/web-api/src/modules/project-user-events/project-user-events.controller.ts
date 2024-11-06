import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import constants from "@repo/constants";
import { EveryGuard } from "@repo/nest/guards";

import { ProjectStatusGuard } from "@guards/project-status.guard";
import { UserOwnerGuard } from "@guards/user-owner.guard";
import { ProjectUserEventsService } from "./project-user-events.service";
import {
  DateRangeQuery,
  ProjectIdParam,
  SessionUser,
  UserIdParam,
  ZodPipe,
} from "@repo/nest";
import { Project, type User } from "@repo/database";
import {
  type CreateProjectUserEventSchema,
  createProjectUserEventSchema,
  type DateRangeSchema,
} from "@repo/validation";
import { ProjectUserGuard } from "@guards/project-user.guard";

@Controller(
  `projects/:${constants.nav.sp.keys.projectId}/users/:${constants.nav.sp.keys.userId}/events`,
)
export class ProjectUserEventsController {
  constructor(
    private readonly projectUserEventsService: ProjectUserEventsService,
  ) {}

  @UseGuards(
    EveryGuard(
      UserOwnerGuard,
      ProjectStatusGuard("ready", "paused"),
      ProjectUserGuard,
    ),
  )
  @Get()
  getProjectUserEvents(
    @ProjectIdParam() projectId: Project["id"],
    @UserIdParam() userId: User["id"],
    @DateRangeQuery() { start_date, end_date }: DateRangeSchema,
  ) {
    return this.projectUserEventsService.getProjectUserEvents({
      projectId,
      userId,
      startDate: start_date,
      endDate: end_date,
    });
  }

  @UseGuards(
    EveryGuard(ProjectStatusGuard("ready"), ProjectUserGuard, UserOwnerGuard),
  )
  @Post()
  async createProjectUserEvent(
    @Body(new ZodPipe(createProjectUserEventSchema))
    { start_date, end_date, ...body }: CreateProjectUserEventSchema,
    @ProjectIdParam() projectId: Project["id"],
    @SessionUser() user: User,
  ) {
    return this.projectUserEventsService.createProjectUserEvent({
      ...body,
      createdBy: user.id,
      startDate: start_date,
      endDate: end_date,
      projectId,
    });
  }
}
