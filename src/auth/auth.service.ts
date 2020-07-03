import { EmailService } from '../config/email/email.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { UserRegistrationDto } from 'src/user/dto/user-registration.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repositories/auth.repository';
import { Auth } from '../database/entities/auth.entity';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async signUp(userRegistrationDto: UserRegistrationDto): Promise<void> {
    const user = await this.userRepository.signUp(userRegistrationDto);
    const template = fs.readFileSync(
      `${__dirname}/../../src/shared/email-templates/new-user-template.html`,
    );
    this.emailService.sendEmail(
      user.email,
      'Welcome!',
      this.replaceNamePlaceholder(template, user.firstName),
    );
    return;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Auth> {
    const { userId, username } = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return await this.authRepository.signIn(accessToken, userId);
  }

  private replaceNamePlaceholder(template: Buffer, name: string): string {
    return template.toString().replace('$name', name);
  }
}
