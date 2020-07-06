import { PurchaseOrder, User } from './../../database/entities';
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

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrderRepository)
    private purchaseOrderRepository: PurchaseOrderRepository,
    private moviesService: MoviesService,
  ) {}

  async purchaseMovie(
    id: number,
    quantity: number,
    user: AuthorizedUser,
  ): Promise<PurchaseOrder> {
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

    return purchase;
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
