import { Controller, UseGuards, Get } from "@nestjs/common";

import { type User } from "@repo/database";
import constants from "@repo/constants";
import { UserIdParam } from "@repo/nest";

import { UserOwnerGuard } from "@guards/user-owner.guard";

import { UserProjectsService } from "./user-projects.service";

@Controller(`users/:${constants.nav.sp.keys.userId}/projects`)
export class UserProjectsController {
  constructor(private readonly userProjectsService: UserProjectsService) {}

  @UseGuards(UserOwnerGuard)
  @Get()
  getUserProjects(
    @UserIdParam()
    userId: User["id"],
  ) {
    return this.userProjectsService.getProjects({
      ownerId: userId,
      statuses: ["ready", "paused"],
    });
  }
}
