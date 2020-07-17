import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniquenessConstraintToResetPasswordToken1593985025841
  implements MigrationInterface {
  name = 'AddUniquenessConstraintToResetPasswordToken1593985025841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_a93bc98abdfb8f17fa5d47e461e" UNIQUE ("username", "email", "resetPasswordToken")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_a93bc98abdfb8f17fa5d47e461e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("username", "email")`,
    );
  }
}
