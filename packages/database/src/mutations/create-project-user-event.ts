import { db } from "../db";
import { Event, EventParticipant } from "../types";

export type CreateProjectUserEventProps = {
  createdBy: Event["created_by"];
  title: Event["title"];
  startDate: Event["start_date"];
  endDate: Event["end_date"];
  cron?: Event["cron"];
  participants: EventParticipant["project_user_id"][];
};

export type CreateProjectUserEventReturnType = Awaited<
  ReturnType<typeof createProjectUserEvent>
>;

export const createProjectUserEvent = ({
  createdBy,
  title,
  startDate,
  endDate,
  cron,
  participants,
}: CreateProjectUserEventProps) => {
  return db.db.transaction(async (tx) => {
    const [event] = await tx
      .insert(db.schema.event)
      .values({
        created_by: createdBy,
        updated_by: createdBy,
        start_date: startDate,
        end_date: endDate,
        cron,
        title,
      })
      .returning();

    if (participants.length && event) {
      await tx.insert(db.schema.event_participant).values(
        participants.map((participantId) => ({
          event_id: event.id,
          project_user_id: participantId,
          created_by: createdBy,
          updated_by: createdBy,
        })),
      );
    }

    return event!;
  });
};
