import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1722935444027 implements MigrationInterface {
    name = 'Migrate1722935444027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`profile\` (\`bio\` text NULL, \`name\` varchar(255) NOT NULL, \`photo_public_id\` text NULL, \`photo_profile\` text NOT NULL, \`phone_number\` varchar(18) NULL, \`id\` int NOT NULL AUTO_INCREMENT, UNIQUE INDEX \`IDX_7fce3640a102ce16fb86f64291\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`history_transfer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sender\` varchar(255) NOT NULL, \`sender_name\` varchar(255) NOT NULL, \`receiver\` varchar(255) NOT NULL, \`receiver_name\` varchar(255) NOT NULL, \`previous_balance\` bigint NOT NULL, \`balance\` bigint NOT NULL, \`status\` enum ('SUCCESS', 'FAILED') NOT NULL, \`notes\` text NULL, \`amount\` int UNSIGNED NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`created_at\` text NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`icon\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`created_at\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`balance\` bigint NOT NULL, \`accountNumber\` bigint UNSIGNED NOT NULL, \`created_at\` text NOT NULL, \`profileId\` int NULL, UNIQUE INDEX \`IDX_a894a560d274a270f087c72ba0\` (\`user\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_7fa878708339fe1fb34707db45\` (\`accountNumber\`), UNIQUE INDEX \`REL_b1bda35cdb9a2c1b777f5541d8\` (\`profileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`history_topup\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` int UNSIGNED NOT NULL, \`balance\` bigint NOT NULL, \`status\` enum ('SUCCESS', 'FAILED') NOT NULL, \`previous_balance\` bigint NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`created_at\` text NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`history_transfer\` ADD CONSTRAINT \`FK_c29bbb14b834daeeac8e1b768a3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b1bda35cdb9a2c1b777f5541d87\` FOREIGN KEY (\`profileId\`) REFERENCES \`profile\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history_topup\` ADD CONSTRAINT \`FK_b88dd53e9db478d9a7913649ff4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history_topup\` DROP FOREIGN KEY \`FK_b88dd53e9db478d9a7913649ff4\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b1bda35cdb9a2c1b777f5541d87\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`ALTER TABLE \`history_transfer\` DROP FOREIGN KEY \`FK_c29bbb14b834daeeac8e1b768a3\``);
        await queryRunner.query(`DROP TABLE \`history_topup\``);
        await queryRunner.query(`DROP INDEX \`REL_b1bda35cdb9a2c1b777f5541d8\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_7fa878708339fe1fb34707db45\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a894a560d274a270f087c72ba0\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`history_transfer\``);
        await queryRunner.query(`DROP INDEX \`IDX_7fce3640a102ce16fb86f64291\` ON \`profile\``);
        await queryRunner.query(`DROP TABLE \`profile\``);
    }

}
