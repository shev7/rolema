import { eq } from "drizzle-orm";
import { db } from "../db";
import { Event } from "../types";

export type UpdateEventProps = {
  id: Event["id"];
  updatedBy: Event["updated_by"];
  fields: Partial<Pick<Event, "title" | "start_date" | "end_date" | "cron">>;
};

export type UpdateEventReturnType = Awaited<ReturnType<typeof updateEvent>>;

export const updateEvent = async ({
  id,
  updatedBy,
  fields,
}: UpdateEventProps) => {
  const [event] = await db.db
    .update(db.schema.event)
    .set({ ...fields, updated_by: updatedBy })
    .where(eq(db.schema.event.id, id))
    .returning();

  return event;
};
