import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRevokedAtColumnName1594396661808
  implements MigrationInterface {
  name = 'ChangeRevokedAtColumnName1594396661808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth" RENAME COLUMN "revokedAt" TO "refreshExpiresAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ALTER COLUMN "refreshExpiresAt" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth" ALTER COLUMN "refreshExpiresAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" RENAME COLUMN "refreshExpiresAt" TO "revokedAt"`,
    );
  }
}
