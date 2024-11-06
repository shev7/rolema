import { db } from "@repo/database";

import {
  testCreateEvent,
  TestCreateEventProps,
} from "@tests/helpers/factories";

export const testCreateEventMigration = (props: TestCreateEventProps) => {
  return () => {
    return db.db.insert(db.schema.event).values(testCreateEvent(props));
  };
};
