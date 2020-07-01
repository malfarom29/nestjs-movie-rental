import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), AdminModule],
  providers: [UserService],
})
export class UserModule {}
