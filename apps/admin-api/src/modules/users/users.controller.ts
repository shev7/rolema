import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";

import { ZodPipe } from "@repo/nest/pipes";
import { type InviteUserSchema, inviteUserSchema } from "@repo/validation";
import {
  ExcludeUserRolesQuery,
  SessionUser,
  UserRolesQuery,
  UsersSortQuery,
} from "@repo/nest/decorators";
import { type User } from "@repo/database";
import { Sort } from "@repo/types";

import { UsersService } from "./users.service";

@Controller(`users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(`statistics`)
  getUsersStatistic() {
    return this.usersService.getUsersStatistic();
  }

  @Get()
  getUsers(
    @UserRolesQuery()
    roles: Array<User["role"]>,
    @UsersSortQuery()
    [sort]: Array<Sort>,
    @ExcludeUserRolesQuery()
    excludeRoles: Array<User["role"]>,
  ) {
    return this.usersService.getUsers({
      roles,
      sort,
      excludeRoles,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(`invite`)
  inviteUser(
    @Body(new ZodPipe(inviteUserSchema))
    body: InviteUserSchema,
    @SessionUser() user: User,
  ) {
    return this.usersService.inviteCreatorUser({
      invitedBy: user.id,
      ...body,
    });
  }
}
