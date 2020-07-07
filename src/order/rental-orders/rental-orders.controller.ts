import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { RentalOrdersService } from './rental-orders.service';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { DayFromNowValidationPipe } from '../../shared/pipes/day-from-now-validation.pipe';
import { RentalOrderDto } from '../../shared/dtos/response/rental-order.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { ReturnOrderResponseDto } from 'src/shared/dtos/response/return-order-response.dto';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';

@Controller('rental-orders')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.CUSTOMER)
export class RentalOrdersController {
  constructor(private rentalOrdersService: RentalOrdersService) {}

  @Post('/movie/:movieId')
  rentMovie(
    @Body('toBeReturnedAt', DayFromNowValidationPipe) toBeReturnedAt: Date,
    @Param('movieId') movieId: number,
    @GetUser() user: AuthorizedUser,
  ): Promise<OrderResponseDto<RentalOrderDto>> {
    return this.rentalOrdersService.rentMovie(movieId, user, toBeReturnedAt);
  }

  @Get('/:id')
  getRentalOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RentalOrderDto> {
    return this.rentalOrdersService.getRentalOrderById(id);
  }

  @Post('/:id/return')
  returnMovie(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderResponseDto<ReturnOrderResponseDto>> {
    return this.rentalOrdersService.returnMovie(id);
  }

  @Get()
  getMyRentalOrders(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: AuthorizedUser,
  ): Promise<PaginatedDataDto<OrderResponseDto<RentalOrderDto>[]>> {
    return this.rentalOrdersService.getMyRentalOrders(user, paginationDto);
  }
}
