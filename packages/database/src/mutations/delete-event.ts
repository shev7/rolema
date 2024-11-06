import { eq } from "drizzle-orm";
import { db } from "../db";
import { Event } from "../types";

export type DeleteEventReturnType = Awaited<ReturnType<typeof deleteEvent>>;

export const deleteEvent = async (eventId: Event["id"]) => {
  return db.db.transaction(async (tx) => {
    await tx
      .delete(db.schema.event_participant)
      .where(eq(db.schema.event_participant.event_id, eventId));

    const [event] = await tx
      .delete(db.schema.event)
      .where(eq(db.schema.event.id, eventId))
      .returning();

    return event;
  });
};
