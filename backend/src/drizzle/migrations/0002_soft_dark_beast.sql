CREATE TABLE `friendshipRequest` (
	`id` int AUTO_INCREMENT NOT NULL,
	`from` int NOT NULL,
	`to` int NOT NULL,
	`status` enum('confirmed','pending','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `friendshipRequest_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_from_to` UNIQUE(`from`,`to`)
);
--> statement-breakpoint
ALTER TABLE `postTable` MODIFY COLUMN `likes` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `postTable` ADD `tags` json;--> statement-breakpoint
ALTER TABLE `usersTable` ADD `friends` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `usersTable` ADD `following` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `usersTable` ADD `followers` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `friendshipRequest` ADD CONSTRAINT `friendshipRequest_from_usersTable_id_fk` FOREIGN KEY (`from`) REFERENCES `usersTable`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `friendshipRequest` ADD CONSTRAINT `friendshipRequest_to_usersTable_id_fk` FOREIGN KEY (`to`) REFERENCES `usersTable`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usersTable` DROP COLUMN `hobbies`;