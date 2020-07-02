import { EntityRepository, Repository } from 'typeorm';
import { UserRegistrationDto } from '../dto/user-registration.dto';
import {
  ConflictException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { Role } from '../../database/entities/role.entity';
import { User } from '../../database/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger();
  async signUp(userRegistrationDto: UserRegistrationDto): Promise<void> {
    const { username, firstName, lastName, password } = userRegistrationDto;

    const user = this.create();

    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.roles = [await Role.findOne({ label: 'customer' })];

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ username: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username }, { relations: ['roles'] });

    if (user && (await user.validatePassword(password))) {
      return { username };
    } else {
      throw new NotFoundException(`Invalid username or password`);
    }
  }
}
