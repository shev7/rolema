import { Module } from "@nestjs/common";

import { ProjectPermissionsService } from "./project-permissions.service";
import { ProjectPermissionsController } from "./project-permissions.controller";

@Module({
  controllers: [ProjectPermissionsController],
  providers: [ProjectPermissionsService],
  exports: [ProjectPermissionsService],
})
export class ProjectPermissionsModule {}
