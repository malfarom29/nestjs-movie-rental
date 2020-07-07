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
} from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { PurchaseResponseDto } from 'src/shared/dtos/response/purchase-response.dto';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';

@Controller('purchase-orders')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
export class PurchaseOrdersController {
  constructor(private purchaseOrdersService: PurchaseOrdersService) {}

  @Post('/movie/:id')
  @Roles(UserRoles.CUSTOMER)
  purchaseOrder(
    @Body('quantity', ParseIntPipe) quantity: number,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthorizedUser,
  ): Promise<OrderResponseDto<PurchaseResponseDto>> {
    return this.purchaseOrdersService.purchaseMovie(id, quantity, user);
  }

  @Get()
  @Roles(UserRoles.CUSTOMER)
  getMyPurchaseOrders(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: AuthorizedUser,
  ): Promise<PaginatedDataDto<OrderResponseDto<PurchaseResponseDto>[]>> {
    return this.purchaseOrdersService.getUserPurchaseOrders(
      user.userId,
      paginationDto,
    );
  }

  @Get('/users/:id')
  @Roles(UserRoles.ADMIN)
  getUserPurchaseOrders(
    @Query() paginationDto: PaginationDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaginatedDataDto<OrderResponseDto<PurchaseResponseDto>[]>> {
    return this.purchaseOrdersService.getUserPurchaseOrders(id, paginationDto);
  }
}
