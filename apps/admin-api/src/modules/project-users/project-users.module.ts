import { Module } from "@nestjs/common";

import { ProjectUsersController } from "./project-users.controller";
import { ProjectUsersService } from "./project-users.service";

@Module({
  imports: [],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
  exports: [ProjectUsersService],
})
export class ProjectUsersModule {}
