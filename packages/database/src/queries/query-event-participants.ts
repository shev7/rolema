import { eq, and } from "drizzle-orm";

import { db } from "../db";
import { EventParticipant, User } from "../types";

export type QueryEventParticipantsProps = {
  eventId: EventParticipant["event_id"];
  userId?: User["id"];
};

export type QueryEventParticipantsReturnType = Awaited<
  ReturnType<typeof queryEventParticipants>
>;

export const queryEventParticipants = async ({
  eventId,
  userId,
}: QueryEventParticipantsProps) => {
  if (!userId) {
    return db.db
      .select()
      .from(db.schema.event_participant)
      .where(eq(db.schema.event_participant.event_id, eventId));
  }

  const eventParticipants = await db.db
    .select({ participant: db.schema.event_participant })
    .from(db.schema.event_participant)
    .leftJoin(
      db.schema.project_user,
      eq(
        db.schema.project_user.id,
        db.schema.event_participant.project_user_id,
      ),
    )
    .where(
      and(
        eq(db.schema.event_participant.event_id, eventId),
        eq(db.schema.project_user.user_id, userId),
      ),
    );

  return eventParticipants.map(
    (eventParticipant) => eventParticipant.participant,
  );
};
