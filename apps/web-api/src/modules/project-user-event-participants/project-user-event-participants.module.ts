import { Module } from "@nestjs/common";
import { ProjectUserEventParticipantsService } from "./project-user-event-participants.service";
import { ProjectUserEventParticipantsController } from "./project-user-event-participants.controller";

@Module({
  controllers: [ProjectUserEventParticipantsController],
  providers: [ProjectUserEventParticipantsService],
})
export class ProjectUserEventParticipantsModule {}
