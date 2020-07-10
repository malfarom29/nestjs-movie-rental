import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Auth } from './entities/auth.entity';
import { EmailValidatorPipe } from 'src/shared/pipes/email-validator.pipe';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { UserRegistrationDto } from 'src/shared/dtos/request/user-registration.dto';
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

  @Delete('/logout')
  @UseGuards(AuthGuard(), WhitelistTokenGuard)
  logout(@Req() request: Request): Promise<void> {
    return this.authService.logout(request);
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

  @Post('/refresh')
  refreshTokne(@Body('refreshToken') refreshToken: string): Promise<Auth> {
    return this.authService.refreshToken(refreshToken);
  }
}
