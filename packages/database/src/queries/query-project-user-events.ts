import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { Event, Project, User } from "../types";

export type QueryProjectUserEventsProps = {
  projectId: Project["id"];
  userId: User["id"];
  startDate: Event["start_date"];
  endDate: Event["end_date"];
};

export type QueryProjectUserEventsReturnType = Awaited<
  ReturnType<typeof queryProjectUserEvents>
>;

export const queryProjectUserEvents = async ({
  projectId,
  userId,
  startDate,
  endDate,
}: QueryProjectUserEventsProps) => {
  const events = await db.db
    .select({ event: db.schema.event })
    .from(db.schema.event_participant)
    .leftJoin(
      db.schema.project_user,
      eq(
        db.schema.project_user.id,
        db.schema.event_participant.project_user_id,
      ),
    )
    .leftJoin(
      db.schema.event,
      eq(db.schema.event.id, db.schema.event_participant.event_id),
    )
    .where(
      and(
        eq(db.schema.project_user.project_id, projectId),
        eq(db.schema.project_user.user_id, userId),
        gte(db.schema.event.start_date, startDate),
        lte(db.schema.event.end_date, endDate),
      ),
    );

  return events.map((event) => event.event!);
};
