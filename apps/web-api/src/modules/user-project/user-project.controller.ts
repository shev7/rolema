import { Controller, UseGuards, Get } from "@nestjs/common";

import { Project } from "@repo/database";
import constants from "@repo/constants";

import { UserOwnerGuard } from "@guards/user-owner.guard";

import { UserProjectService } from "./user-project.service";
import { ProjectIdParam, UserIdParam } from "@repo/nest";

@Controller(
  `users/:${constants.nav.sp.keys.userId}/projects/:${constants.nav.sp.keys.projectId}`,
)
export class UserProjectController {
  constructor(private readonly userProjectService: UserProjectService) {}

  @UseGuards(UserOwnerGuard)
  @Get()
  async getUserProject(
    @UserIdParam()
    ownerId: Project["owner_id"],
    @ProjectIdParam()
    projectId: Project["id"],
  ) {
    return this.userProjectService.getUserProject({
      ownerId,
      projectId,
      statuses: ["ready", "paused"],
    });
  }
}
