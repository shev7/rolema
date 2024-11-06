import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthGuard, RolesGuard, commonProviders } from "@repo/nest";

import {
  ProjectsModule,
  ProjectModule,
  ProjectUsersModule,
  ProjectsUserModule,
  UsersModule,
  TiersModule,
  UserModule,
  UserProjectsModule,
  TierModule,
} from "./modules";

@Module({
  imports: [
    ProjectsModule,
    ProjectModule,
    ProjectUsersModule,
    ProjectsUserModule,

    UsersModule,
    UserModule,
    UserProjectsModule,

    TiersModule,
    TierModule,
  ],
  providers: [
    ...commonProviders,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard("admin") },
  ],
})
export class AppModule {}
