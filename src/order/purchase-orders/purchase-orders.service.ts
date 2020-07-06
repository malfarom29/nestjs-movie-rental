import { PurchaseOrder } from './../../database/entities';
import { MoviesService } from './../../movies/movies.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderRepository } from '../../repositories/purchase-order.repository';
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PaginationDto } from 'src/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/dtos/response/paginated-data.dto';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { plainToClass } from 'class-transformer';
import { PurchaseResponseDto } from 'src/dtos/response/purchase-response.dto';
import { OrderResponseDto } from 'src/dtos/response/order-response.dto';
import { OrderSerializer } from 'src/shared/serializers/order-serializer';

@Injectable()
export class PurchaseOrdersService {
  private serializer: OrderSerializer;

  constructor(
    @InjectRepository(PurchaseOrderRepository)
    private purchaseOrderRepository: PurchaseOrderRepository,
    private moviesService: MoviesService,
  ) {
    this.serializer = new OrderSerializer();
  }

  async purchaseMovie(
    id: number,
    quantity: number,
    user: AuthorizedUser,
  ): Promise<OrderResponseDto<PurchaseResponseDto>> {
    const movie = await this.moviesService.findMovie(id);

    if (!movie.availability) {
      throw new BadRequestException(
        `Movie with ID "${id} is no longer available"`,
      );
    }

    if (quantity > movie.stock) {
      throw new ConflictException(
        `Not enough quantity in stock for movie with ID "${id}"`,
      );
    }

    const purchase = await this.purchaseOrderRepository.purchaseMovie(
      movie,
      quantity,
      user.userId,
    );
    await movie.reload();

    const purchaseResponse = plainToClass(PurchaseResponseDto, purchase);

    return this.serializer.serialize<PurchaseResponseDto>(
      purchaseResponse,
      movie,
    );
  }

  async getMyPurchaseOrders(
    user: AuthorizedUser,
    paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<PurchaseOrder>> {
    const data = await this.purchaseOrderRepository.getMyPurchaseOrders(
      user.userId,
      paginationDto,
    );
    const paginatedOrders: PaginatedDataDto<PurchaseOrder> = {
      data: data[0],
      totalCount: data[1],
      page: paginationDto.page ? Number(paginationDto.page) : 1,
      limit: paginationDto.limit ? Number(paginationDto.limit) : 10,
    };

    return paginatedOrders;
  }
}
