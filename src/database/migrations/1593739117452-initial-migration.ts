import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialMigration1593739117452 implements MigrationInterface {
  name = 'initialMigration1593739117452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, CONSTRAINT "UQ_6194356fbe60fc21663ecfdf86b" UNIQUE ("label"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("username", "email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "revokedAt" TIMESTAMP, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie_attachment" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "key" character varying NOT NULL, "fileType" character varying NOT NULL, "mimeType" character varying NOT NULL, CONSTRAINT "PK_5a138a2216f52a3473d196e9fdd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rental_order" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "movieId" integer NOT NULL, "total" double precision NOT NULL, "rentedAt" TIMESTAMP NOT NULL, "toBeReturnedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_117fcfe9a064c7321b6016b3b79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchase_order" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "quantity" integer NOT NULL, "total" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_ad3e1c7b862f4043b103a6c8c60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "stock" integer NOT NULL, "onRent" integer NOT NULL DEFAULT 0, "salePrice" double precision NOT NULL, "rentalPrice" double precision NOT NULL, "availability" boolean NOT NULL DEFAULT true, "dailyPenalty" double precision NOT NULL, "imageId" integer, CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title"), CONSTRAINT "REL_0ae9952e354287b2b429b69802" UNIQUE ("imageId"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie_log" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "salePrice" double precision NOT NULL, "rentalPrice" double precision NOT NULL, "movieId" integer NOT NULL, CONSTRAINT "PK_8c78aaa69cb38ecf439e001aba8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "return_order" ("id" SERIAL NOT NULL, "rentalOrderId" integer NOT NULL, "penalty" double precision NOT NULL DEFAULT 0, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "REL_1704850ace20d9660bd18352e2" UNIQUE ("rentalOrderId"), CONSTRAINT "PK_d4bd17f918fc6c332b74a368c36" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental_order" ADD CONSTRAINT "FK_74e2506e334c0ec4c00bf1e00b8" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" ADD CONSTRAINT "FK_5757fd117d95e94f93e05b76c58" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie" ADD CONSTRAINT "FK_0ae9952e354287b2b429b698020" FOREIGN KEY ("imageId") REFERENCES "movie_attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_log" ADD CONSTRAINT "FK_71608b0652bdb14347449b2141d" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "return_order" ADD CONSTRAINT "FK_1704850ace20d9660bd18352e26" FOREIGN KEY ("rentalOrderId") REFERENCES "rental_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "return_order" DROP CONSTRAINT "FK_1704850ace20d9660bd18352e26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_log" DROP CONSTRAINT "FK_71608b0652bdb14347449b2141d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movie" DROP CONSTRAINT "FK_0ae9952e354287b2b429b698020"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase_order" DROP CONSTRAINT "FK_5757fd117d95e94f93e05b76c58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental_order" DROP CONSTRAINT "FK_74e2506e334c0ec4c00bf1e00b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`);
    await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`);
    await queryRunner.query(`DROP TABLE "user_roles_role"`);
    await queryRunner.query(`DROP TABLE "return_order"`);
    await queryRunner.query(`DROP TABLE "movie_log"`);
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "purchase_order"`);
    await queryRunner.query(`DROP TABLE "rental_order"`);
    await queryRunner.query(`DROP TABLE "movie_attachment"`);
    await queryRunner.query(`DROP TABLE "auth"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
