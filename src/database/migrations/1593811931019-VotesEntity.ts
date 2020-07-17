import { MigrationInterface, QueryRunner } from 'typeorm';

export class VotesEntity1593811931019 implements MigrationInterface {
  name = 'VotesEntity1593811931019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vote" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_2d5932d46afe39c8176f9d4be72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1cb7bf745cb864ebbeeb1bf094" ON "vote" ("movieId", "userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_499e10a58992a610cfbaf8f18ed" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_499e10a58992a610cfbaf8f18ed"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_1cb7bf745cb864ebbeeb1bf094"`);
    await queryRunner.query(`DROP TABLE "vote"`);
  }
}
