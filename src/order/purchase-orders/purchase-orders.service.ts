import { PurchaseOrder } from './../../database/entities';
import { MoviesService } from './../../movies/movies.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderRepository } from '../../repositories/purchase-order.repository';
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { plainToClass } from 'class-transformer';
import { PurchaseResponseDto } from 'src/shared/dtos/response/purchase-response.dto';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { OrderSerializer } from 'src/shared/serializers/order-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';

@Injectable()
export class PurchaseOrdersService {
  private readonly serializer = new OrderSerializer();
  private readonly paginationSerializer = new PaginatedSerializer();

  constructor(
    @InjectRepository(PurchaseOrderRepository)
    private purchaseOrderRepository: PurchaseOrderRepository,
    private moviesService: MoviesService,
  ) {}

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
  ): Promise<PaginatedDataDto<OrderResponseDto<PurchaseResponseDto>[]>> {
    const {
      data,
      totalCount,
    } = await this.purchaseOrderRepository.getMyPurchaseOrders(
      user.userId,
      paginationDto,
    );
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;

    const purchases: OrderResponseDto<PurchaseResponseDto>[] = data.map(
      order => {
        const dto = plainToClass(PurchaseResponseDto, order);
        return this.serializer.serialize<PurchaseResponseDto>(dto, order.movie);
      },
    );

    return this.paginationSerializer.serialize(
      purchases,
      totalCount,
      page,
      limit,
    );
  }
}
