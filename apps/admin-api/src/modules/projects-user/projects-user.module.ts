import { Module } from "@nestjs/common";

import { ProjectsUserController } from "./projects-user.controller";
import { ProjectsUserService } from "./projects-user.service";

@Module({
  imports: [],
  controllers: [ProjectsUserController],
  providers: [ProjectsUserService],
})
export class ProjectsUserModule {}
