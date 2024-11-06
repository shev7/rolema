import { Module } from "@nestjs/common";

import { UserProjectService } from "./user-project.service";
import { UserProjectController } from "./user-project.controller";

@Module({
  imports: [],
  controllers: [UserProjectController],
  providers: [UserProjectService],
})
export class UserProjectModule {}
