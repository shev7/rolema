import { Module } from "@nestjs/common";

import { ProjectUsersModule } from "../project-users";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";

@Module({
  imports: [ProjectUsersModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
