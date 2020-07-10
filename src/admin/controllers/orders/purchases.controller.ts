import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { PurchaseOrdersService } from 'src/customer/controllers/orders/services/purchase-orders.service';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { PurchaseResponseDto } from 'src/shared/dtos/response/purchase-response.dto';

@Controller('admin/orders/purchases')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
export class PurchasesController {
  constructor(private purchaseOrdersService: PurchaseOrdersService) {}

  @Get('/users/:id')
  getUserPurchaseOrders(
    @Query() paginationDto: PaginationDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaginatedDataDto<OrderResponseDto<PurchaseResponseDto>[]>> {
    return this.purchaseOrdersService.getUserPurchaseOrders(id, paginationDto);
  }
}
