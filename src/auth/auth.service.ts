import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { UserRegistrationDto } from 'src/user/dto/user-registration.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(userRegistrationDto: UserRegistrationDto): Promise<void> {
    return this.userRepository.signUp(userRegistrationDto);
  }
}
