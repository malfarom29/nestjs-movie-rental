import { GetUser } from './../../../shared/decorators/get-user.decorator';
import { PaginatedDataDto } from './../../../shared/dtos/response/paginated-data.dto';
import { UserResponseDto } from './../../../shared/dtos/response/user-response.dto';
import { PaginationDto } from './../../../shared/dtos/request/pagination.dto';
import { UserService } from '../../../users/services/user.service';
import {
  Controller,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { RolesArrayValidatorPipe } from 'src/shared/pipes/roles-array-validator.pipe';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';

@Controller('admin/users')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<UserResponseDto>> {
    return this.userService.getAllUsers(paginationDto);
  }

  @Patch('/:id/roles')
  async changeUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body('roles', RolesArrayValidatorPipe) roles: string[],
    @GetUser() user: AuthorizedUser,
  ): Promise<UserResponseDto> {
    return this.userService.changeUserRoles(id, roles, user);
  }

  @Get('/:id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }
}
