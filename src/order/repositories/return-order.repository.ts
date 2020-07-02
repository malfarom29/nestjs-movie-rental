import { EntityRepository, Repository } from 'typeorm';
import { ReturnOrder } from '../../database/entities/return-order.entity';
import {
  Logger,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { RentalOrderDto } from '../rental-orders/dto/response/rental-order.dto';

@EntityRepository(ReturnOrder)
export class ReturnOrderRepository extends Repository<ReturnOrder> {
  private readonly logger = new Logger();

  async returnMovie(rentalOrder: RentalOrderDto): Promise<ReturnOrder> {
    const rentalReturn = this.create();
    const moviePenalty = rentalOrder.movie.dailyPenalty;
    const today = new Date();
    const diffTime = Math.abs(
      rentalOrder.toBeReturnedAt.getTime() - today.getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    rentalReturn.rentalOrderId = rentalOrder.id;
    rentalReturn.penalty = moviePenalty * diffDays;
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
