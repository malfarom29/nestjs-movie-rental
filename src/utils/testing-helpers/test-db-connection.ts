import { EntitySchema } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/ban-types
type Entity = Function | string | EntitySchema<any>;

export const testDbConnection = (entities: Entity[]): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: 'db',
  port: parseInt(process.env.ORM_PORT, 10),
  username: process.env.ORM_USERNAME,
  password: process.env.ORM_PASSWORD,
  schema: 'public',
  database: process.env.ORM_TEST_DATABASE,
  entities,
  migrations: [process.env.ORM_MIGRATIONS],
  synchronize: false,
});
