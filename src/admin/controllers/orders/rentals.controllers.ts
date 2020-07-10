import { RentalOrdersService } from '../../../customer/controllers/orders/services/rental-orders.service';
import { RentalOrderDto } from './../../../shared/dtos/response/rental-order.dto';
import { OrderResponseDto } from './../../../shared/dtos/response/order-response.dto';
import { PaginatedDataDto } from './../../../shared/dtos/response/paginated-data.dto';
import { RolesGuard } from './../../../shared/guards/roles.guard';
import { WhitelistTokenGuard } from './../../../shared/guards/whitelist-token.guard';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';

@Controller('admin/orders/rentals')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class RentalsController {
  constructor(private rentalOrdersService: RentalOrdersService) {}

  @Get('/users/:id')
  getUserRentalOrders(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<OrderResponseDto<RentalOrderDto>[]>> {
    return this.rentalOrdersService.getUserRentalOrders(id, paginationDto);
  }
}
