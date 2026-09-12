ALTER TABLE `usersTable` MODIFY COLUMN `religion` varchar(100) NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `bio` varchar(120) DEFAULT '';--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `website` text DEFAULT ('');--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `avatar` varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `coverImage` varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `languages` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `interest` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `location` json DEFAULT ('{"city":"","country":"","latitude":"","longitude":""}');--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `education` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `usersTable` MODIFY COLUMN `job` json DEFAULT ('[]');