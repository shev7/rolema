import { Module } from "@nestjs/common";

import { ProjectUserService } from "./project-user.service";
import { ProjectUserController } from "./project-user.controller";

@Module({
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
