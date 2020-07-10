import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { UserResponseDto } from 'src/shared/dtos/response/user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';

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
