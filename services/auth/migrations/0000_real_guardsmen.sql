CREATE TABLE `history_topup` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned,
	`amount` int unsigned NOT NULL,
	`balance` bigint unsigned NOT NULL,
	`status` enum('SUCCESS','FAILED') NOT NULL,
	`previous_balance` bigint unsigned NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`created_at` text NOT NULL,
	CONSTRAINT `history_topup_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `history_transfer` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`sender` varchar(255) NOT NULL,
	`sender_name` varchar(255) NOT NULL,
	`notes` text,
	`balance` bigint unsigned NOT NULL,
	`amount` int unsigned NOT NULL,
	`receiver` varchar(255) NOT NULL,
	`receiver_name` varchar(255) NOT NULL,
	`previous_balance` bigint unsigned NOT NULL,
	`status` enum('SUCCESS','FAILED') NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`user_id` bigint unsigned,
	`created_at` text NOT NULL,
	CONSTRAINT `history_transfer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user_id` bigint unsigned,
	`icon` varchar(255),
	`title` varchar(255),
	`description` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`created_at` text NOT NULL,
	`type` varchar(255),
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`bio` text,
	`name` varchar(255) NOT NULL,
	`photo_public_id` text,
	`photo_profile` text NOT NULL DEFAULT ('https://res.cloudinary.com/dktwq4f3f/image/upload/v1716213116/usericon_hrikn3.jpg'),
	`phone_number` varchar(18) NOT NULL,
	CONSTRAINT `profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `profile_phone_number_unique` UNIQUE(`phone_number`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user` varchar(255) NOT NULL,
	`password` varchar(255),
	`email` varchar(255) NOT NULL,
	`balance` bigint unsigned NOT NULL DEFAULT 0,
	`accountNumber` bigint unsigned NOT NULL,
	`profile_id` bigint unsigned,
	`created_at` text NOT NULL DEFAULT ('2024-09-05T07:23:02.236Z'),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_user_unique` UNIQUE(`user`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_accountNumber_unique` UNIQUE(`accountNumber`)
);
--> statement-breakpoint
ALTER TABLE `history_topup` ADD CONSTRAINT `history_topup_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `history_transfer` ADD CONSTRAINT `history_transfer_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_profile_id_profile_id_fk` FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON DELETE no action ON UPDATE no action;