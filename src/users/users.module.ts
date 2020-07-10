import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from 'src/services/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { UserSerializer } from 'src/shared/serializers/user-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserRepository])],
  controllers: [UsersController],
  providers: [UserService, UserSerializer, PaginatedSerializer],
})
export class UsersModule {}
