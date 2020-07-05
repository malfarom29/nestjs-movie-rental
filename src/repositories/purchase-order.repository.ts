import { PurchaseOrder } from '../database/entities';
import { Movie } from '../database/entities';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { PaginationDto } from 'src/dtos/request/pagination.dto';

@EntityRepository(PurchaseOrder)
export class PurchaseOrderRepository extends Repository<PurchaseOrder> {
  private readonly logger = new Logger();

  async purchaseMovie(
    movie: Movie,
    quantity: number,
    userId: number,
  ): Promise<PurchaseOrder> {
    const purchase = new PurchaseOrder();
    purchase.movieId = movie.id;
    purchase.quantity = quantity;
    purchase.total = Number((movie.salePrice * quantity).toFixed(2));
    purchase.userId = userId;

    try {
      await purchase.save();
    } catch (error) {
      this.logger.error(error.stack);
      throw new InternalServerErrorException();
    }

    return purchase;
  }

  getMyPurchaseOrders(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<[PurchaseOrder[], number]> {
    const query = this.createQueryBuilder('purchase_order').where({
      userId: userId,
    });
    const page = paginationDto.page;
    const limit = paginationDto.limit ? paginationDto.limit : 10;

    if (page) {
      const skippedItems = (page - 1) * limit;
      query.offset(skippedItems);
    }

    query.limit(limit);

    const data = query.getManyAndCount();

    return data;
  }
}
