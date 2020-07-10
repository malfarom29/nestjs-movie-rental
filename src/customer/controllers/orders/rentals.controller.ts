import { PaginatedDataDto } from '../../../shared/dtos/response/paginated-data.dto';
import { PaginationDto } from '../../../shared/dtos/request/pagination.dto';
import { RentalOrderDto } from '../../../shared/dtos/response/rental-order.dto';
import { AuthorizedUser } from '../../../shared/interfaces/authorized-user.interface';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { WhitelistTokenGuard } from '../../../shared/guards/whitelist-token.guard';
import { RentalOrdersService } from './services/rental-orders.service';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from '../../../shared/constants';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { RentMovieDto } from 'src/customer/dto/rent-movie.dto';
import { ReturnOrderResponseDto } from 'src/shared/dtos/response/return-order-response.dto';

@Controller('customer/orders/rentals')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.CUSTOMER)
export class RentalsController {
  constructor(private rentalOrdersService: RentalOrdersService) {}

  @Post()
  rentMovie(
    @Body() rentMovieDto: RentMovieDto,
    @GetUser() user: AuthorizedUser,
  ): Promise<OrderResponseDto<RentalOrderDto>> {
    return this.rentalOrdersService.rentMovie(rentMovieDto, user);
  }

  @Get()
  getMyRentalOrders(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: AuthorizedUser,
  ): Promise<PaginatedDataDto<OrderResponseDto<RentalOrderDto>[]>> {
    return this.rentalOrdersService.getUserRentalOrders(
      user.userId,
      paginationDto,
    );
  }

  @Get('/:id')
  getRentalOrderById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthorizedUser,
  ): Promise<RentalOrderDto> {
    return this.rentalOrdersService.getRentalOrderById(id, user);
  }

  @Get('/:id/return')
  returnMovie(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthorizedUser,
  ): Promise<OrderResponseDto<ReturnOrderResponseDto>> {
    return this.rentalOrdersService.returnMovie(id, user);
  }
}
