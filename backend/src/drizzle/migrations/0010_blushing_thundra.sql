ALTER TABLE `postTable` MODIFY COLUMN `images` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `postTable` MODIFY COLUMN `tags` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `postTable` MODIFY COLUMN `interest` json DEFAULT ('[]');