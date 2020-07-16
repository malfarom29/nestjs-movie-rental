require('dotenv').config();

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.ORM_HOST,
    port: parseInt(process.env.ORM_PORT, 10),
    username: process.env.ORM_USERNAME,
    password: process.env.ORM_PASSWORD,
    schema: 'public',
    database: process.env.ORM_DATABASE,
    entities: [process.env.ORM_ENTITIES],
    migrations: [process.env.ORM_MIGRATIONS],
    // subscribers: [process.env.SUBSCRIBERS_PATH],
    synchronize: false, // DEV only, do not use on PROD!
    logging: true,
  },
  {
    name: 'test',
    type: 'postgres',
    host: process.env.ORM_HOST,
    port: parseInt(process.env.ORM_PORT, 10),
    username: process.env.ORM_USERNAME,
    password: process.env.ORM_PASSWORD,
    schema: 'public',
    database: process.env.ORM_TEST_DATABASE,
    entities: [process.env.ORM_ENTITIES],
    migrations: [process.env.ORM_MIGRATIONS],
    // subscribers: [process.env.SUBSCRIBERS_PATH],
    synchronize: false, // DEV only, do not use on PROD!
  },
];
