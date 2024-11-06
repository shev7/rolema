import { Controller, Get } from "@nestjs/common";

import { Project } from "@repo/database";
import constants from "@repo/constants";

import { UserProjectsService } from "./user-projects.service";
import { UserIdParam } from "@repo/nest";

@Controller(`users/:${constants.nav.sp.keys.userId}/projects`)
export class UserProjectsController {
  constructor(private readonly userProjectsService: UserProjectsService) {}

  @Get()
  getProjects(
    @UserIdParam()
    ownerId: Project["owner_id"],
  ) {
    return this.userProjectsService.getProjects({ ownerId });
  }

  @Get(`count`)
  getProjectsCount(
    @UserIdParam()
    ownerId: Project["owner_id"],
  ) {
    return this.userProjectsService.getProjectsCount(ownerId);
  }
}
