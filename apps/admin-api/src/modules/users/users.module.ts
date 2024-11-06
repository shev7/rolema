import { Module } from "@nestjs/common";

import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MailModule } from "../mail";
import { ProjectsModule } from "../projects";

@Module({
  imports: [MailModule, ProjectsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
