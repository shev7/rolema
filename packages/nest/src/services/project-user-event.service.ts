import { BadRequestException, NotFoundException } from "@nestjs/common";

import {
  deleteEvent,
  queryEvents,
  queryEventWithParticipants,
  updateEvent,
} from "@repo/database";
import { isStartDateBeforeEndDate } from "@repo/validation";

import { ProjectUserEventServiceBase } from "../types";

export class ProjectUserEventService implements ProjectUserEventServiceBase {
  getProjectUserEvent: ProjectUserEventServiceBase["getProjectUserEvent"] =
    async (eventId) => {
      const event = await queryEventWithParticipants(eventId);

      if (!event) {
        throw new NotFoundException("event is not found");
      }

      return event;
    };

  updateProjectUserEvent: ProjectUserEventServiceBase["updateProjectUserEvent"] =
    async (props) => {
      const {
        id,
        fields: { start_date, end_date },
      } = props;

      /** Update query will be executed immediately if both
       * `start_date` and `end_date` are provided in the `fields` property
       *  or if both are missing, in this case no need to compare with
       *  start and end dates of existing event.
       */
      if ((!start_date && !end_date) || (start_date && end_date)) {
        const event = await updateEvent(props);

        if (!event) {
          throw new NotFoundException("event is not found");
        }

        return event;
      }

      const [event] = await queryEvents({ eventId: id });

      if (!event) {
        throw new NotFoundException("event is not found");
      }

      if (
        (start_date &&
          !end_date &&
          !isStartDateBeforeEndDate({
            start_date,
            end_date: event.end_date,
          })) ||
        (!start_date &&
          end_date &&
          !isStartDateBeforeEndDate({ start_date: event.start_date, end_date }))
      ) {
        throw new BadRequestException(
          "event start_date must be before end_date",
        );
      }

      return (await updateEvent(props))!;
    };

  deleteProjectUserEvent: ProjectUserEventServiceBase["deleteProjectUserEvent"] =
    async (eventId) => {
      const event = await deleteEvent(eventId);

      if (!event) {
        throw new NotFoundException("event is not found");
      }

      return event;
    };
}
