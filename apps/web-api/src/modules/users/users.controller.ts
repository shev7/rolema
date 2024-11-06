import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  UseGuards,
} from "@nestjs/common";

import { ZodPipe } from "@repo/nest/pipes";
import {
  inviteUserToProjectSchema,
  type InviteUserToProjectSchema,
} from "@repo/validation";
import { SessionUser } from "@repo/nest/decorators";
import { type User } from "@repo/database";
import { RolesGuard } from "@repo/nest";

import { PermissionsGuard } from "@guards/permissions.guard";
import { SomeGuard, EveryGuard } from "@repo/nest/guards";
import { ProjectStatusGuard } from "@guards/project-status.guard";

import { UsersService } from "./users.service";

@Controller(`users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(
    EveryGuard(
      ProjectStatusGuard("ready"),
      SomeGuard(RolesGuard("creator"), PermissionsGuard("role:invite")),
    ),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post(`invite`)
  inviteUser(
    @Body(new ZodPipe(inviteUserToProjectSchema))
    { email, project_role_id, project_id }: InviteUserToProjectSchema,
    @SessionUser() user: User,
  ) {
    return this.usersService.inviteGeneralUser({
      email,
      inviterId: user.id,
      project_role_id,
      project_id,
    });
  }
}
