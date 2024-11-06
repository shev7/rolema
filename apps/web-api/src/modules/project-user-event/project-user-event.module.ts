import { Module } from "@nestjs/common";
import { ProjectUserEventService } from "./project-user-event.service";
import { ProjectUserEventController } from "./project-user-event.controller";

@Module({
  controllers: [ProjectUserEventController],
  providers: [ProjectUserEventService],
})
export class ProjectUserEventModule {}
