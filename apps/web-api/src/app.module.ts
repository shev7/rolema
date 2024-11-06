import { Module, NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthGuard, commonProviders } from "@repo/nest";

import {
  ProjectRolesModule,
  UsersModule,
  ProjectUsersModule,
  ProjectModule,
  ProjectUserModule,
  ProjectsUserModule,
  UserModule,
  UserProjectsModule,
  UserProjectModule,
  ProjectTierModule,
  ProjectPermissionsModule,
  ProjectRolePermissionsUsersModule,
  ProjectUserEventsModule,
  ProjectUserEventModule,
  ProjectUserEventParticipantsModule,
} from "./modules";

@Module({
  imports: [
    ProjectModule,
    ProjectUsersModule,
    ProjectUserModule,
    ProjectsUserModule,
    ProjectUserEventsModule,
    ProjectUserEventModule,
    ProjectUserEventParticipantsModule,

    ProjectTierModule,
    ProjectPermissionsModule,
    ProjectRolePermissionsUsersModule,

    UsersModule,
    UserModule,
    UserProjectsModule,
    UserProjectModule,

    ProjectRolesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ...commonProviders,
  ],
})
export class AppModule {}
