import { Module } from "@nestjs/common";
import { ProjectRolesController } from "./project-roles.controller";
import { ProjectRolesService } from "./project-roles.service";
import { ProjectUsersModule } from "../project-users";

@Module({
  imports: [ProjectUsersModule],
  controllers: [ProjectRolesController],
  providers: [ProjectRolesService],
})
export class ProjectRolesModule {}
