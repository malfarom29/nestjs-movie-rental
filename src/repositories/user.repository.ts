import { EntityRepository, Repository } from 'typeorm';
import { UserRegistrationDto } from '../user/dto/user-registration.dto';
import {
  ConflictException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { Role } from '../database/entities';
import { User } from '../database/entities';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger();
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
