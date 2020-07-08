import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './config/email/email.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MoviesModule,
    EmailModule,
    UserModule,
    AuthModule,
    OrderModule,
    AdminModule,
    CustomerModule,
    CommonModule,
  ],
})
export class AppModule {}
