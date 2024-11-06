import { Module } from "@nestjs/common";
import { ProjectUserEventsController } from "./project-user-events.controller";
import { ProjectUserEventsService } from "./project-user-events.service";

@Module({
  controllers: [ProjectUserEventsController],
  providers: [ProjectUserEventsService],
})
export class ProjectUserEventsModule {}
