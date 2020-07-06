import { UserRoles } from './../shared/constants';
import { UserService } from './user.service';
import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { PaginationDto } from 'src/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/dtos/response/paginated-data.dto';
import { UserResponseDto } from 'src/dtos/response/user-response.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { RolesArrayValidatorPipe } from 'src/shared/pipes/roles-array-validator.pipe';

@Controller('users')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  async getAllUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<UserResponseDto>> {
    return this.userService.getAllUsers(paginationDto);
  }

  @Patch('/:id/roles')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  async changeUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body('roles', RolesArrayValidatorPipe) roles: string[],
    @GetUser() user: AuthorizedUser,
  ): Promise<UserResponseDto> {
    return this.userService.changeUserRoles(id, roles, user);
  }

  @Get('myprofile')
  async getMyProfile(
    @GetUser() user: AuthorizedUser,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(user.userId);
  }

  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }
}
