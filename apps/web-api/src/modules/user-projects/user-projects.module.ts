import { Module } from "@nestjs/common";

import { UserProjectsService } from "./user-projects.service";
import { UserProjectsController } from "./user-projects.controller";

@Module({
  imports: [],
  controllers: [UserProjectsController],
  providers: [UserProjectsService],
})
export class UserProjectsModule {}
