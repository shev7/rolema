ALTER TABLE "event" ALTER COLUMN "id" SET DEFAULT md5(random()::text)::varchar(12);--> statement-breakpoint
ALTER TABLE "permission" ALTER COLUMN "id" SET DEFAULT md5(random()::text)::varchar(10);--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "id" SET DEFAULT md5(random()::text)::varchar(4);--> statement-breakpoint
ALTER TABLE "project_role" ALTER COLUMN "id" SET DEFAULT md5(random()::text)::varchar(8);--> statement-breakpoint
ALTER TABLE "tier" ALTER COLUMN "id" SET DEFAULT md5(random()::text)::varchar(2);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT md5(random()::text)::varchar(6);--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "permission" ADD CONSTRAINT "permission_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "project_role" ADD CONSTRAINT "project_role_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "tier" ADD CONSTRAINT "tier_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_id_unique" UNIQUE("id");