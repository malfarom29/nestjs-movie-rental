import { EmailService } from '../config/email/email.service';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/repositories/user.repository';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.repository';
import { Auth } from './entities/auth.entity';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Request } from 'express';
import { UserRegistrationDto } from 'src/shared/dtos/request/user-registration.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private emailService: EmailService,
    private jwtService: JwtService,
    private logger: Logger,
  ) {}

  async signUp(userRegistrationDto: UserRegistrationDto): Promise<void> {
    const user = await this.userRepository.signUp(userRegistrationDto);
    const template = fs
      .readFileSync(
        `${__dirname}/../../src/shared/email-templates/new-user-template.html`,
      )
      .toString();
    const body = this.replaceNamePlaceholder(template, user.firstName);
    this.emailService.sendEmail(user.email, 'Welcome!', body);
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

  async requestResetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return;
    }

    const resetPasswordTokenExpiresIn = new Date();
    resetPasswordTokenExpiresIn.setDate(
      resetPasswordTokenExpiresIn.getDate() + 1,
    );

    const resetPasswordToken = crypto.randomBytes(16).toString('hex');

    const template = fs
      .readFileSync(
        `${__dirname}/../../src/shared/email-templates/reset-password-template.html`,
      )
      .toString();
    let body = this.replaceNamePlaceholder(template, user.firstName);
    body = this.replaceTokenPlaceholder(body, resetPasswordToken);

    try {
      await this.userRepository.save({
        id: user.id,
        resetPasswordToken,
        resetPasswordTokenExpiresIn,
      });

      this.emailService.sendEmail(user.email, 'Request Reset Password', body);
    } catch (error) {
      this.logger.error(error.stack);
      throw new InternalServerErrorException();
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.userRepository.resetPassword(token, newPassword);
  }

  async logout(request: Request): Promise<void> {
    const { headers } = request;
    const token = headers.authorization.split(' ')[1];

    this.authRepository.delete({ accessToken: token });
  }

  async refreshToken(refreshToken: string): Promise<Auth> {
    const token = await this.authRepository.findRefreshAndValidate(
      refreshToken,
    );

    const user = token.user;

    const payload: JwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);

    this.authRepository.delete(token);

    return await this.authRepository.signIn(accessToken, user.id);
  }

  private replaceNamePlaceholder(template: string, name: string): string {
    return template.toString().replace('$name', name);
  }

  private replaceTokenPlaceholder(template: string, token: string): string {
    return template.toString().replace('$resetToken', token);
  }
}
