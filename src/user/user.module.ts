import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';

import { UserSerializer } from 'src/shared/serializers/user-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [UserService, UserSerializer, PaginatedSerializer],
  controllers: [],
})
export class UserModule {}
