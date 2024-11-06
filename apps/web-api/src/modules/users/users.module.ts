import { Module } from "@nestjs/common";

import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MailModule } from "../mail";
import { ProjectModule } from "../project";

@Module({
  imports: [MailModule, ProjectModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
