import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from "@nestjs/common";

import {
  EveryGuard,
  EventIdParam,
  SessionUser,
  ZodPipe,
  SomeGuard,
} from "@repo/nest";
import constants from "@repo/constants";
import { Event, type User } from "@repo/database";

import { ProjectUserEventService } from "./project-user-event.service";

import { ProjectStatusGuard } from "@guards/project-status.guard";
import { ProjectUserGuard } from "@guards/project-user.guard";
import { UserOwnerGuard } from "@guards/user-owner.guard";
import {
  updateProjectUserEventSchema,
  type UpdateProjectUserEventSchema,
} from "@repo/validation";
import { EventParticipantGuard } from "@guards/event-participant.guard";
import { EventOwnerGuard } from "@guards/event-owner.guard";

@Controller(
  `projects/:${constants.nav.sp.keys.projectId}/users/:${constants.nav.sp.keys.userId}/events/:${constants.nav.sp.keys.eventId}`,
)
export class ProjectUserEventController {
  constructor(
    private readonly projectUserEventService: ProjectUserEventService,
  ) {}

  @UseGuards(
    EveryGuard(
      UserOwnerGuard,
      ProjectStatusGuard("ready", "paused"),
      ProjectUserGuard,
      SomeGuard(EventOwnerGuard, EventParticipantGuard),
    ),
  )
  @Get()
  getProjectUserEvent(@EventIdParam() eventId: Event["id"]) {
    return this.projectUserEventService.getProjectUserEvent(eventId);
  }

  @UseGuards(
    EveryGuard(
      UserOwnerGuard,
      ProjectStatusGuard("ready"),
      ProjectUserGuard,
      EventOwnerGuard,
    ),
  )
  @Patch()
  updateProjectUserEvent(
    @SessionUser() user: User,
    @Body(new ZodPipe(updateProjectUserEventSchema))
    body: UpdateProjectUserEventSchema,
    @EventIdParam()
    eventId: Event["id"],
  ) {
    return this.projectUserEventService.updateProjectUserEvent({
      id: eventId,
      fields: body,
      updatedBy: user.id,
    });
  }

  @UseGuards(
    EveryGuard(
      UserOwnerGuard,
      ProjectStatusGuard("ready"),
      ProjectUserGuard,
      EventOwnerGuard,
    ),
  )
  @Delete()
  deleteProjectUserEvent(@EventIdParam() eventId: Event["id"]) {
    return this.projectUserEventService.deleteProjectUserEvent(eventId);
  }
}
