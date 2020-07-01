import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserRegistrationDto } from 'src/user/dto/user-registration.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Auth } from './entities/auth.entity';

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
}
