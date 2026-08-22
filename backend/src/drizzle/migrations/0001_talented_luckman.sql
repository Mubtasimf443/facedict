CREATE TABLE `postTable` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caption` text NOT NULL,
	`images` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`interest` json,
	`likes` json,
	CONSTRAINT `postTable_id` PRIMARY KEY(`id`),
	CONSTRAINT `postTable_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `usersTable` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;