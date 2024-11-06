import { db } from "@repo/database";

import {
  testCreateEventParticipant,
  TestCreateEventParticipantProps,
} from "@tests/helpers/factories";

export const testCreateEventParticipantMigration = (
  props: TestCreateEventParticipantProps,
) => {
  return () => {
    return db.db
      .insert(db.schema.event_participant)
      .values(testCreateEventParticipant(props));
  };
};
