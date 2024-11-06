import { Controller, Get, Delete } from "@nestjs/common";

import { type User } from "@repo/database";
import constants from "@repo/constants";

import { UserService } from "./user.service";
import { UserIdParam } from "@repo/nest";

@Controller(`users/:${constants.nav.sp.keys.userId}`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(
    @UserIdParam()
    userId: User["id"],
  ) {
    return this.userService.getUser(userId);
  }

  @Delete()
  deleteUser(
    @UserIdParam()
    userId: User["id"],
  ) {
    return this.userService.deleteUser(userId);
  }
}
