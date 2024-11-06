import { db } from "./db";

export type User = typeof db.schema.user.$inferSelect;
export type UserInfo = typeof db.schema.user_info.$inferSelect;
export type UserEmailVerification =
  typeof db.schema.user_email_verification.$inferSelect;

export type Project = typeof db.schema.project.$inferSelect;
export type ProjectUser = typeof db.schema.project_user.$inferSelect;
export type ProjectRole = typeof db.schema.project_role.$inferSelect;
export type Tier = typeof db.schema.tier.$inferSelect;
export type ProjectTier = typeof db.schema.project_tier.$inferSelect;
export type Permission = typeof db.schema.permission.$inferSelect;
export type Event = typeof db.schema.event.$inferSelect;
export type EventParticipant = typeof db.schema.event_participant.$inferSelect;
