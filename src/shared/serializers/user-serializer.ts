import { SerializerDto } from './serializer-dto';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { plainToClass } from 'class-transformer';
import { User } from 'src/database/entities';

@Injectable()
export class UserSerializer implements SerializerDto<UserResponseDto> {
  serialize(user: User | User[]): UserResponseDto {
    return plainToClass(UserResponseDto, user);
  }
}
