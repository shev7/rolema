ALTER TABLE "event_participant" RENAME COLUMN "id" TO "event_id";--> statement-breakpoint
ALTER TABLE "event_participant" DROP CONSTRAINT "event_unique_project_user";--> statement-breakpoint
ALTER TABLE "event_participant" DROP CONSTRAINT "event_participant_id_event_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_unique_project_user" UNIQUE("event_id","project_user_id");