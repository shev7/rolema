import {
  queryProjectUserEvents,
  createProjectUserEvent,
  queryProjectUsersCount,
  queryProjectUser,
} from "@repo/database";

import { ProjectUserEventsServiceBase } from "../types";
import { BadRequestException, NotFoundException } from "@nestjs/common";

export class ProjectUserEventsService implements ProjectUserEventsServiceBase {
  getProjectUserEvents: ProjectUserEventsServiceBase["getProjectUserEvents"] = (
    props,
  ) => {
    return queryProjectUserEvents(props);
  };

  createProjectUserEvent: ProjectUserEventsServiceBase["createProjectUserEvent"] =
    async ({ projectId, participants, ...props }) => {
      const projectUser = await queryProjectUser({
        projectId,
        userId: props.createdBy,
      });

      if (!projectUser) {
        throw new NotFoundException("project user is not found");
      }

      if (!participants.length) {
        return createProjectUserEvent({
          ...props,
          participants: [projectUser.id],
        });
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

      return createProjectUserEvent({
        participants: [...participants, projectUser.id],
        ...props,
      });
    };
}
