import { PurchaseOrder } from '../entities/purchase-order.entity';
import { User } from '../../../../users/entities/user.entity';
import { Movie } from '../../../../movies/entities/movie.entity';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';

@EntityRepository(PurchaseOrder)
export class PurchaseOrderRepository extends Repository<PurchaseOrder> {
  constructor(private logger: Logger) {
    super();
  }

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

  async getUserPurchaseOrders(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<{ data: PurchaseOrder[]; totalCount: number }> {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;
    const query = this.createQueryBuilder('purchase_order').leftJoinAndSelect(
      'purchase_order.movie',
      'movie',
    );

    query.where({ userId });
    query.take(limit).skip(skip);

    const [purchaseOrders, total] = await query.getManyAndCount();

    return { data: purchaseOrders, totalCount: total };
  }
}
