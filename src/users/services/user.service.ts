import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { User } from '../entities/user.entity';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repositories/user.repository';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { UserResponseDto } from 'src/shared/dtos/response/user-response.dto';
import { plainToClass } from 'class-transformer';
import { UserSerializer } from 'src/shared/serializers/user-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private serializer: UserSerializer,
    private paginationSerializer: PaginatedSerializer<UserResponseDto>,
  ) {}

  async getAllUsers(
    paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<UserResponseDto>> {
    const { data, totalCount } = await this.userRepository.getAllUsers(
      paginationDto,
    );
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const users = this.serializer.serialize(data);

    return this.paginationSerializer.serialize(users, totalCount, page, limit);
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.findUser(id);

    return plainToClass(UserResponseDto, user);
  }

  private async findUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async changeUserRoles(
    id: number,
    roles: string[],
    user: AuthorizedUser,
  ): Promise<UserResponseDto> {
    if (id === user.userId) {
      throw new BadRequestException(`You cannot change your own roles`);
    }

    const changedUser = await this.userRepository.changeUserRoles(id, roles);

    return plainToClass(UserResponseDto, changedUser);
  }
}
