import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { EmailModule } from './email/email.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), MoviesModule, EmailModule],
})
export class AppModule {}
