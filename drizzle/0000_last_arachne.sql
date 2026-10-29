CREATE TABLE `user_records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`kind` text NOT NULL,
	`equipment_id` text NOT NULL,
	`component_id` text,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_owner_kind` ON `user_records` (`owner_id`,`kind`);