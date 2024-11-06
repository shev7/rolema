import { eq } from "drizzle-orm";

import { db } from "../db";
import { Event } from "../types";

export type QueryEventsProps = {
  eventId: Event["id"];
};

export type QueryEventsReturnType = Awaited<ReturnType<typeof queryEvents>>;

export const queryEvents = async ({ eventId }: QueryEventsProps) => {
  return db.db
    .select()
    .from(db.schema.event)
    .where(eq(db.schema.event.id, eventId));
};
