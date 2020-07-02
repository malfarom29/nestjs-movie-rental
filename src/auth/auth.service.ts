import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/repositories/user.repository';
import { UserRegistrationDto } from 'src/user/dto/user-registration.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.repository';
import { Auth } from '../database/entities/auth.entity';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userRegistrationDto: UserRegistrationDto): Promise<void> {
    return this.userRepository.signUp(userRegistrationDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Auth> {
    const { username } = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return await this.authRepository.signIn(accessToken);
  }
}
