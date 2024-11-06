import {
  ProjectUser,
  queryEventParticipants,
  queryProjectUser,
  queryProjectUsersCount,
  updateEventParticipants,
} from "@repo/database";
import { ProjectUserEventParticipantsServiceBase } from "../types";
import { BadRequestException, NotFoundException } from "@nestjs/common";

export class ProjectUserEventParticipantsService
  implements ProjectUserEventParticipantsServiceBase
{
  updateProjectUserEventParticipants: ProjectUserEventParticipantsServiceBase["updateProjectUserEventParticipants"] =
    async ({ eventId, projectId, updatedBy, participants }) => {
      const projectUser = await queryProjectUser({
        projectId,
        userId: updatedBy,
      });

      if (!projectUser) {
        throw new NotFoundException("project user is not found");
      }

      if (participants.includes(projectUser.id)) {
        throw new BadRequestException(
          "event participants should not include event creator",
        );
      }

      const { count } = await queryProjectUsersCount({
        ids: participants,
        projectId,
      });

      if (count !== participants.length) {
        throw new BadRequestException(
          "some of provided participants are not related to the project",
        );
      }

      const eventParticipants = await queryEventParticipants({ eventId });

      const addedIds = participants.reduce<ProjectUser["id"][]>(
        (acc, participantId) => {
          if (
            eventParticipants.find(
              (participant) => participant.project_user_id === participantId,
            )
          ) {
            return acc;
          }

          return [...acc, participantId];
        },
        [],
      );

      const deletedIds = eventParticipants.reduce<ProjectUser["id"][]>(
        (acc, eventParticipant) => {
          if (
            participants.includes(eventParticipant.project_user_id) ||
            eventParticipant.project_user_id === projectUser.id
          ) {
            return acc;
          }

          return [...acc, eventParticipant.project_user_id];
        },
        [],
      );

      return updateEventParticipants({
        eventId,
        updatedBy,
        addedIds,
        deletedIds,
      });
    };
}
