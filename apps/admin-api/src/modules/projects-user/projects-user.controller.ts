import { Controller, Get } from "@nestjs/common";

import { User } from "@repo/database";
import constants from "@repo/constants";

import { ProjectsUserService } from "./projects-user.service";
import { UserIdParam } from "@repo/nest";

@Controller(`projects`)
export class ProjectsUserController {
  constructor(private readonly projectUsersService: ProjectsUserService) {}

  @Get(`users/:${constants.nav.sp.keys.userId}`)
  getProjectUsers(
    @UserIdParam()
    userId: User["id"],
  ) {
    return this.projectUsersService.getProjectUsers({ userId });
  }

  @Get(`users/:${constants.nav.sp.keys.userId}/count`)
  getProjectUsersCount(
    @UserIdParam()
    userId: User["id"],
  ) {
    return this.projectUsersService.getProjectUsersCount({
      userId,
    });
  }
}
