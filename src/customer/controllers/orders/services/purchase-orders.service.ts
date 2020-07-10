import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderRepository } from '../repositories/purchase-order.repository';
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
import { MoviesService } from 'src/movies/services/movies.service';
import { PurchaseMovieDto } from 'src/customer/dto/purchase-movie.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrderRepository)
    private purchaseOrderRepository: PurchaseOrderRepository,
    private moviesService: MoviesService,
    private serializer: OrderSerializer,
    private paginationSerializer: PaginatedSerializer<PurchaseResponseDto>,
  ) {}

  async purchaseMovie(
    purchaseMovieDto: PurchaseMovieDto,
    user: AuthorizedUser,
  ): Promise<OrderResponseDto<PurchaseResponseDto>> {
    const { movieId, quantity } = purchaseMovieDto;

    const movie = await this.moviesService.findMovie(movieId);

    if (!movie.availability) {
      throw new BadRequestException(
        `Movie with ID "${movieId} is no longer available"`,
      );
    }

    if (quantity > movie.stock) {
      throw new ConflictException(
        `Not enough quantity in stock for movie with ID "${movieId}"`,
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

  async getUserPurchaseOrders(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<OrderResponseDto<PurchaseResponseDto>[]>> {
    const {
      data,
      totalCount,
    } = await this.purchaseOrderRepository.getUserPurchaseOrders(
      userId,
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
