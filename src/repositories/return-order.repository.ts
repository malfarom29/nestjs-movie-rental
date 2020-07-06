import { EntityRepository, Repository } from 'typeorm';
import { ReturnOrder } from '../database/entities/return-order.entity';
import {
  Logger,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { RentalOrder } from 'src/database/entities';

@EntityRepository(ReturnOrder)
export class ReturnOrderRepository extends Repository<ReturnOrder> {
  private readonly logger = new Logger();

  async returnMovie(rentalOrder: RentalOrder): Promise<ReturnOrder> {
    const rentalReturn = this.create();
    const moviePenalty = rentalOrder.movie.dailyPenalty;
    const today = new Date('2020-07-16');
    const diffTime = today.getTime() - rentalOrder.toBeReturnedAt.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const penalty =
      diffDays < 0 ? 0 : Number((moviePenalty * diffDays).toFixed(2));

    rentalReturn.rentalOrderId = rentalOrder.id;
    rentalReturn.penalty = penalty;
    rentalReturn.createdAt = today;

    try {
      await rentalReturn.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `You have already returned the movie with Order ID "${rentalOrder.id}" `,
        );
      } else {
        this.logger.error(error.stack);
        throw new InternalServerErrorException();
      }
    }

    return rentalReturn;
  }
}
