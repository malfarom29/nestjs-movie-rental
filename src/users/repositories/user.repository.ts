import { EntityRepository, Repository } from 'typeorm';

import {
  ConflictException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { UserRegistrationDto } from 'src/shared/dtos/request/user-registration.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(private logger: Logger) {
    super();
  }

  async getAllUsers(
    paginationDto: PaginationDto,
  ): Promise<{
    data: User[];
    totalCount: number;
  }> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.createQueryBuilder('user').leftJoinAndSelect(
      'user.roles',
      'role',
    );

    query.take(limit).skip(skip);

    const [users, totalCount] = await query.getManyAndCount();

    return { data: users, totalCount: totalCount };
  }

  async signUp(userRegistrationDto: UserRegistrationDto): Promise<User> {
    const {
      username,
      firstName,
      lastName,
      password,
      email,
    } = userRegistrationDto;

    const user = this.create();

    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.salt = await bcrypt.genSalt();
    user.email = email;
    user.password = await this.hashPassword(password, user.salt);
    user.roles = [await Role.findOne({ label: 'customer' })];

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exist');
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.findOne({ resetPasswordToken: token });
    const today = new Date().getTime();

    if (!user) {
      throw new BadRequestException(`Invalid Token`);
    }

    const resetPasswordExpirationDateTime = user.resetPasswordTokenExpiresIn.getTime();

    if (today > resetPasswordExpirationDateTime) {
      throw new BadRequestException('Invalid Token');
    }

    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(newPassword, user.salt);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresIn = null;

    try {
      await user.save();
    } catch (error) {
      this.logger.error(error.stack);
      throw new InternalServerErrorException();
    }
  }

  async changeUserRoles(id: number, roles: string[]): Promise<User> {
    const user = await this.findOne({ id });
    const mappedRoles = await Promise.all(
      roles.map(async role => {
        const found = await Role.findOne({ label: role });
        return found;
      }),
    );

    user.roles = mappedRoles;

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthorizedUser> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username }, { relations: ['roles'] });

    if (user && (await user.validatePassword(password))) {
      const roleNames: string[] = user.roles.map(role => role.label);

      return { userId: user.id, username, roles: roleNames };
    } else {
      throw new NotFoundException(`Invalid username or password`);
    }
  }
}
