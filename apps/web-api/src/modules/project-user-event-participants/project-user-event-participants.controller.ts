import { Body, Controller, Patch, UseGuards } from "@nestjs/common";

import constants from "@repo/constants";
import { Event, type User, Project } from "@repo/database";
import {
  EventIdParam,
  EveryGuard,
  ProjectIdParam,
  SessionUser,
  ZodPipe,
} from "@repo/nest";
import {
  type UpdateProjectUserEventParticipantsSchema,
  updateProjectUserEventParticipantsSchema,
} from "@repo/validation";

import { ProjectStatusGuard } from "@guards/project-status.guard";
import { UserOwnerGuard } from "@guards/user-owner.guard";
import { EventOwnerGuard } from "@guards/event-owner.guard";
import { ProjectUserGuard } from "@guards/project-user.guard";

import { ProjectUserEventParticipantsService } from "./project-user-event-participants.service";

@Controller(
  `/projects/:${constants.nav.sp.keys.projectId}/users/:${constants.nav.sp.keys.userId}/events/:${constants.nav.sp.keys.eventId}/participants`,
)
export class ProjectUserEventParticipantsController {
  constructor(
    private readonly projectUserEventParticipantsService: ProjectUserEventParticipantsService,
  ) {}

  @Patch()
  @UseGuards(
    EveryGuard(
      UserOwnerGuard,
      ProjectStatusGuard("ready"),
      ProjectUserGuard,
      EventOwnerGuard,
    ),
  )
  updateProjectUserEventParticipants(
    @Body(new ZodPipe(updateProjectUserEventParticipantsSchema))
    body: UpdateProjectUserEventParticipantsSchema,
    @EventIdParam() eventId: Event["id"],
    @SessionUser() user: User,
    @ProjectIdParam() projectId: Project["id"],
  ) {
    return this.projectUserEventParticipantsService.updateProjectUserEventParticipants(
      {
        eventId,
        updatedBy: user.id,
        participants: body,
        projectId,
      },
    );
  }
}
