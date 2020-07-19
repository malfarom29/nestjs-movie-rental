import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetTokenToUser1593972787343
  implements MigrationInterface {
  name = 'AddPasswordResetTokenToUser1593972787343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "resetPasswordToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "resetPasswordToken"`,
    );
  }
}
