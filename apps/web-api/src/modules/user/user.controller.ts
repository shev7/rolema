import { Controller, UseGuards, Get } from "@nestjs/common";

import { type User } from "@repo/database";
import constants from "@repo/constants";

import { UserOwnerGuard } from "@guards/user-owner.guard";
import { UserService } from "./user.service";
import { UserIdParam } from "@repo/nest";

@Controller(`users/:${constants.nav.sp.keys.userId}`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserOwnerGuard)
  @Get()
  getById(
    @UserIdParam()
    userId: User["id"],
  ) {
    return this.userService.getUser(userId);
  }

  @UseGuards(UserOwnerGuard)
  @Get(`statistics`)
  async getStatistics(
    @UserIdParam()
    userId: User["id"],
  ) {
    return this.userService.getUserStatistics(userId);
  }
}
