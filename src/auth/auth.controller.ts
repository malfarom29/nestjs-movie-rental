import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Param,
} from '@nestjs/common';
import { UserRegistrationDto } from 'src/user/dto/user-registration.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Auth } from '../database/entities/auth.entity';
import { EmailValidatorPipe } from 'src/shared/pipes/email-validator.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) userRegistrationDto: UserRegistrationDto,
  ): Promise<void> {
    return this.authService.signUp(userRegistrationDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<Auth> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Patch('/resetpassword')
  requestResetPassword(
    @Body('email', EmailValidatorPipe) email: string,
  ): Promise<void> {
    return this.authService.requestResetPassword(email);
  }

  @Patch('/resetpassword/:token')
  resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    return this.authService.resetPassword(token, newPassword);
  }
}
