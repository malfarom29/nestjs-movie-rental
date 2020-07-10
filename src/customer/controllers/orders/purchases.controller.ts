import {
  Controller,
  UseGuards,
  Post,
  Body,
  ParseIntPipe,
  Param,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WhitelistTokenGuard } from 'src/shared/guards/whitelist-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { PurchaseOrdersService } from 'src/customer/controllers/orders/services/purchase-orders.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from 'src/shared/constants';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { PurchaseResponseDto } from 'src/shared/dtos/response/purchase-response.dto';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { PurchaseMovieDto } from 'src/customer/dto/purchase-movie.dto';

@Controller('customer/orders/purchases')
@UseGuards(AuthGuard(), WhitelistTokenGuard, RolesGuard)
@Roles(UserRoles.CUSTOMER)
export class PurchasesController {
  constructor(private purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  purchaseOrder(
    @Body(ValidationPipe) purchaseMovieDto: PurchaseMovieDto,
    @GetUser() user: AuthorizedUser,
  ): Promise<OrderResponseDto<PurchaseResponseDto>> {
    return this.purchaseOrdersService.purchaseMovie(purchaseMovieDto, user);
  }

  @Get()
  getMyPurchaseOrders(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: AuthorizedUser,
  ): Promise<PaginatedDataDto<OrderResponseDto<PurchaseResponseDto>[]>> {
    return this.purchaseOrdersService.getUserPurchaseOrders(
      user.userId,
      paginationDto,
    );
  }
}
