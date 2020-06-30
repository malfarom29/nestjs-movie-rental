import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserRegistrationDto } from 'src/user/dto/user-registration.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) userRegistrationDto: UserRegistrationDto,
  ): Promise<void> {
    return this.authService.signUp(userRegistrationDto);
  }
}
