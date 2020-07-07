import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { AdminModule } from './admin/admin.module';
import { UserController } from './user.controller';
import { UserSerializer } from 'src/shared/serializers/user-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository]),
    AdminModule,
  ],
  providers: [UserService, UserSerializer, PaginatedSerializer],
  controllers: [UserController],
})
export class UserModule {}
