import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptionsEnvReader } from 'typeorm/connection/options-reader/ConnectionOptionsEnvReader';

export const loadEnvironmentVariables = async () => {
  config();
};

export const loadTypeOrmConnectionFromEnv = (): TypeOrmModuleOptions => {
  const envReader = new ConnectionOptionsEnvReader();
  const connectionOptions: TypeOrmModuleOptions = {
    ...envReader.read(),
    entities: [`${__dirname}/${process.env.TYPEORM_ENTITIES}`],
    migrations: [`${__dirname}/${process.env.TYPEORM_MIGRATIONS}`],
  };
  console.log(connectionOptions);
  return connectionOptions;
};
