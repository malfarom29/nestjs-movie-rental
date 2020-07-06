import { User } from './../../database/entities/user.entity';
import { PurchaseOrder } from './../../database/entities';
import { PurchaseOrdersService } from './purchase-orders.service';
import { UserRoles } from './../../shared/constants';
import { RolesGuard } from './../../shared/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  UseGuards,
  Post,
  ParseIntPipe,
  Param,
  Body,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { PaginationDto } from 'src/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/dtos/response/paginated-data.dto';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { OrderResponseDto } from 'src/dtos/response/order-response.dto';
import { PurchaseResponseDto } from 'src/dtos/response/purchase-response.dto';

@Controller('purchase-orders')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(UserRoles.CUSTOMER)
export class PurchaseOrdersController {
  constructor(private purchaseOrdersService: PurchaseOrdersService) {}

  @Post('/movie/:id')
  purchaseOrder(
    @Body('quantity', ParseIntPipe) quantity: number,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthorizedUser,
  ): Promise<OrderResponseDto<PurchaseResponseDto>> {
    return this.purchaseOrdersService.purchaseMovie(id, quantity, user);
  }

  @Get()
  getMyPurchaseOrders(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: AuthorizedUser,
  ): Promise<PaginatedDataDto<PurchaseOrder>> {
    return this.purchaseOrdersService.getMyPurchaseOrders(user, paginationDto);
  }
}
