import { Module } from "@nestjs/common";
import { ProjectRolePermissionsUsersController } from "./project-role-permissions-users.controller";
import { ProjectRolePermissionsUsersService } from "./project-role-permissions-users.service";

@Module({
  imports: [],
  controllers: [ProjectRolePermissionsUsersController],
  providers: [ProjectRolePermissionsUsersService],
})
export class ProjectRolePermissionsUsersModule {}
