import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPurchaseOrderRelation1593753566279
  implements MigrationInterface {
  name = 'AddUserPurchaseOrderRelation1593753566279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD CONSTRAINT "FK_e3292b9fe0788404b5cc3b4efd5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP CONSTRAINT "FK_e3292b9fe0788404b5cc3b4efd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP COLUMN "userId"`,
    );
  }
}
