import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegistrationDto } from './dto/user-registration.dto';
import {
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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
}
