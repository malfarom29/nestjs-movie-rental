require('dotenv').config();

module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  schema: 'public',
  database: process.env.TYPEORM_DATABASE,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  // subscribers: [process.env.SUBSCRIBERS_PATH],
  synchronize: false, // DEV only, do not use on PROD!
  logging: true,
  seeds: [process.env.TYPEORM_SEEDING_SEEDS],
};
