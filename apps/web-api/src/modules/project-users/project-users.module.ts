import { Module } from "@nestjs/common";

import { ProjectUsersService } from "./project-users.service";
import { ProjectUsersController } from "./project-users.controller";

@Module({
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
  exports: [ProjectUsersService],
})
export class ProjectUsersModule {}
