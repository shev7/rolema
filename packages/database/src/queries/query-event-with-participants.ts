import { eq } from "drizzle-orm";

import { db } from "../db";
import { Event, EventParticipant, ProjectUser, User } from "../types";

export type QueryEventWithParticipantsReturnType = Awaited<
  ReturnType<typeof queryEventWithParticipants>
>;

export const queryEventWithParticipants = async (eventId: Event["id"]) => {
  const result = await db.db
    .select({
      event: db.schema.event,
      participant: db.schema.event_participant,
      projectUser: db.schema.project_user,
      user: db.schema.user,
    })
    .from(db.schema.event)
    .leftJoin(
      db.schema.event_participant,
      eq(db.schema.event_participant.event_id, db.schema.event.id),
    )
    .leftJoin(
      db.schema.project_user,
      eq(
        db.schema.project_user.id,
        db.schema.event_participant.project_user_id,
      ),
    )
    .leftJoin(
      db.schema.user,
      eq(db.schema.user.id, db.schema.project_user.user_id),
    )
    .where(eq(db.schema.event.id, eventId));

  const event = result[0]?.event;

  if (!event) {
    return null;
  }

  return result.reduce<
    Event & {
      participants: {
        participant: EventParticipant;
        projectUser: ProjectUser;
        user: User;
      }[];
    }
  >(
    (acc, { event, participant, projectUser, user }) => {
      return {
        ...event,
        participants:
          participant && projectUser && user
            ? [...acc.participants, { participant, projectUser, user }]
            : acc.participants,
      };
    },
    { ...event, participants: [] },
  );
};
