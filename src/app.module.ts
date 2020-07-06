import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './config/email/email.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MoviesModule,
    EmailModule,
    UserModule,
    AuthModule,
    OrderModule,
  ],
})
export class AppModule {}
