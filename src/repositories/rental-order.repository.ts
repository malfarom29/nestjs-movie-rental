import { EntityRepository, Repository } from 'typeorm';
import { RentalOrder } from '../database/entities';
import { Movie } from 'src/database/entities';
import {
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PaginationDto } from 'src/dtos/request/pagination.dto';

@EntityRepository(RentalOrder)
export class RentalOrderRepository extends Repository<RentalOrder> {
  private readonly logger = new Logger();

  async getMyRentalOrders(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<[RentalOrder[], number]> {
    const query = this.createQueryBuilder('rental_order').where({
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
