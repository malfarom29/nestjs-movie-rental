import { EntityRepository, Repository } from 'typeorm';
import { RentalOrder } from '../../database/entities/rental-order.entity';
import { Movie } from 'src/database/entities/movie.entity';
import {
  Logger,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';

@EntityRepository(RentalOrder)
export class RentalOrderRepository extends Repository<RentalOrder> {
  private readonly logger = new Logger();

  async rentMovie(
    movie: Movie,
    userId: number,
    toBeReturnedAt: Date,
  ): Promise<RentalOrder> {
    const rental = this.create();

    rental.movieId = movie.id;
    rental.userId = userId;
    rental.toBeReturnedAt = new Date(toBeReturnedAt);
    rental.rentedAt = new Date();

    const timeDiff = Math.abs(
      rental.toBeReturnedAt.getTime() - rental.rentedAt.getTime(),
    );
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    rental.total = dayDiff * movie.rentalPrice;

    try {
      await rental.save();
    } catch (error) {
      this.logger.error(error.stack);
      const response = error['response'];
      if (response) {
        throw new BadRequestException(response['message']);
      }

      throw new InternalServerErrorException();
    }

    return rental;
  }
}
