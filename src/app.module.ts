import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './config/email/email.module';

import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { CommonModule } from './common/common.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EmailModule,
    AuthModule,
    AdminModule,
    CustomerModule,
    CommonModule,
    MoviesModule,
  ],
})
export class AppModule {}
