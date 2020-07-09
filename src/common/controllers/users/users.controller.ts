import { UserResponseDto } from './../../../shared/dtos/response/user-response.dto';
import { GetUser } from './../../../shared/decorators/get-user.decorator';
import { WhitelistTokenGuard } from './../../../shared/guards/whitelist-token.guard';
import { UserService } from '../../../services/user.service';
import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';

@Controller('users')
@UseGuards(AuthGuard(), WhitelistTokenGuard)
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('my-profile')
  async getMyProfile(
    @GetUser() user: AuthorizedUser,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(user.userId);
  }
}
