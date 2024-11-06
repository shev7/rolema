import { Module } from "@nestjs/common";

import { ProjectsUserService } from "./projects-user.service";
import { ProjectsUserController } from "./projects-user.controller";

@Module({
  controllers: [ProjectsUserController],
  providers: [ProjectsUserService],
  exports: [ProjectsUserService],
})
export class ProjectsUserModule {}
