import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetTokenExpirationToUser1593984848976
  implements MigrationInterface {
  name = 'AddPasswordResetTokenExpirationToUser1593984848976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "resetPasswordTokenExpiresIn" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "resetPasswordTokenExpiresIn"`,
    );
  }
}
