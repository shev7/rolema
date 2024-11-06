ALTER TABLE "event" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "cron" DROP NOT NULL;