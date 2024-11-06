import { eq, and, or } from "drizzle-orm";
import { db } from "../db";
import { Event, ProjectUser, User } from "../types";

export type UpdateEventParticipantsProps = {
  addedIds: ProjectUser["id"][];
  deletedIds: ProjectUser["id"][];
  eventId: Event["id"];
  updatedBy: User["id"];
};

export type UpdateEventParticipantsReturnType = Awaited<
  ReturnType<typeof updateEventParticipants>
>;

export const updateEventParticipants = ({
  addedIds,
  deletedIds,
  eventId,
  updatedBy,
}: UpdateEventParticipantsProps) => {
  return db.db.transaction(async (tx) => {
    if (deletedIds.length) {
      await tx
        .delete(db.schema.event_participant)
        .where(
          and(
            eq(db.schema.event_participant.event_id, eventId),
            or(
              ...deletedIds.map((id) =>
                eq(db.schema.event_participant.project_user_id, id),
              ),
            ),
          ),
        );
    }

    if (!addedIds.length) {
      return [];
    }

    return tx
      .insert(db.schema.event_participant)
      .values(
        addedIds.map((id) => ({
          event_id: eventId,
          created_by: updatedBy,
          updated_by: updatedBy,
          project_user_id: id,
        })),
      )
      .returning();
  });
};
