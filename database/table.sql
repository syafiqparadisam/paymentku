CREATE DATABASE IF NOT EXISTS paymentku;

CREATE TABLE `history_topup` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `amount` INT UNSIGNED NOT NULL,
  `balance` BIGINT NOT NULL,
  `status` ENUM('SUCCESS','FAILED') NOT NULL,
  `previous_balance` BIGINT NOT NULL,
  `isRead` TINYINT NOT NULL DEFAULT 0 ,
  `created_at` TEXT NOT NULL,
  `userId` INT NULL,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `history_transfer` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `sender` VARCHAR(255) NOT NULL,
  `sender_name` VARCHAR(255) NOT NULL,
  `receiver` VARCHAR(255) NOT NULL,
  `receiver_name` VARCHAR(255) NOT NULL,
  `previous_balance` BIGINT NOT NULL,
  `balance` BIGINT NOT NULL,
  `status` ENUM('SUCCESS','FAILED') NOT NULL,
  `notes` TEXT NULL,
  `amount` INT UNSIGNED NOT NULL,
  `isRead` TINYINT NOT NULL DEFAULT 0 ,
  `created_at` TEXT NOT NULL,
  `userId` INT NULL,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `notification` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `icon` VARCHAR(255) NOT NULL,
  `isRead` TINYINT NOT NULL DEFAULT 0 ,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `userId` INT NULL,
   PRIMARY KEY (`id`)
)
ENGINE = InnoDB;
CREATE TABLE `profile` ( 
  `bio` TEXT NULL,
  `name` VARCHAR(255) NOT NULL,
  `photo_public_id` TEXT NULL,
  `photo_profile` TEXT NOT NULL,
  `phone_number` VARCHAR(18) NULL,
  `id` INT AUTO_INCREMENT NOT NULL,
   PRIMARY KEY (`id`),
  CONSTRAINT `IDX_7fce3640a102ce16fb86f64291` UNIQUE (`phone_number`)
)
ENGINE = InnoDB;
CREATE TABLE `users` ( 
  `id` INT AUTO_INCREMENT NOT NULL,
  `user` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NULL,
  `email` VARCHAR(255) NOT NULL,
  `balance` BIGINT NOT NULL,
  `accountNumber` INT UNSIGNED NOT NULL,
  `created_at` TEXT NOT NULL,
  `profileId` INT NULL,
   PRIMARY KEY (`id`),
  CONSTRAINT `IDX_a894a560d274a270f087c72ba0` UNIQUE (`user`),
  CONSTRAINT `IDX_97672ac88f789774dd47f7c8be` UNIQUE (`email`),
  CONSTRAINT `IDX_7fa878708339fe1fb34707db45` UNIQUE (`accountNumber`),
  CONSTRAINT `REL_b1bda35cdb9a2c1b777f5541d8` UNIQUE (`profileId`)
)
ENGINE = InnoDB;
ALTER TABLE `history_topup` ADD CONSTRAINT `FK_b88dd53e9db478d9a7913649ff4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `history_transfer` ADD CONSTRAINT `FK_c29bbb14b834daeeac8e1b768a3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `notification` ADD CONSTRAINT `FK_1ced25315eb974b73391fb1c81b` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `users` ADD CONSTRAINT `FK_b1bda35cdb9a2c1b777f5541d87` FOREIGN KEY (`profileId`) REFERENCES `profile` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
