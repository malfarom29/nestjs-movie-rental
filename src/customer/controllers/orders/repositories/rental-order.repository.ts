import { EntityRepository, Repository } from 'typeorm';
import { RentalOrder } from '../entities/rental-order.entity';
import { User } from '../../../../users/entities/user.entity';
import { Movie } from '../../../../movies/entities/movie.entity';
import {
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';

@EntityRepository(RentalOrder)
export class RentalOrderRepository extends Repository<RentalOrder> {
  private readonly logger = new Logger();

  async getUserRentalOrders(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<{ data: RentalOrder[]; totalCount: number }> {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;
    const query = this.createQueryBuilder('rental_order').leftJoinAndSelect(
      'rental_order.movie',
      'movie',
    );

    query.where({ userId });
    query.take(limit).skip(skip);

    const [rentalOrders, total] = await query.getManyAndCount();

    return { data: rentalOrders, totalCount: total };
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
