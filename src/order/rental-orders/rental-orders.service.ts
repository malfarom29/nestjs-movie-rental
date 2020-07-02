import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalOrderRepository } from '../repositories/rental-order.repository';
import { MoviesService } from 'src/movies/movies.service';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { RentalOrderDto } from './dto/response/rental-order.dto';
import { plainToClass } from 'class-transformer';
import { ReturnOrderRepository } from '../repositories/return-order.repository';
import { ReturnOrderDto } from './dto/response/return-order.dto';
import { MovieRepository } from 'src/movies/repositories/movie.repository';

@Injectable()
export class RentalOrdersService {
  constructor(
    @InjectRepository(RentalOrderRepository)
    private rentalOrderRepository: RentalOrderRepository,
    @InjectRepository(ReturnOrderRepository)
    private returnOrderRepository: ReturnOrderRepository,
    @InjectRepository(MovieRepository)
    private movieRepository: MovieRepository,
    private moviesService: MoviesService,
  ) {}

  async getRentalOrderById(id: number): Promise<RentalOrderDto> {
    const rental = await this.rentalOrderRepository.findOne(
      { id },
      { relations: ['movie'] },
    );

    if (!rental) {
      throw new NotFoundException(`Rental Order with ID "${id}" not found`);
    }

    const rentalOrder = plainToClass(RentalOrderDto, rental);

    return rentalOrder;
  }

  async rentMovie(
    movieId: number,
    user: AuthorizedUser,
    toBeReturnedAt: Date,
  ): Promise<RentalOrderDto> {
    const movie = await this.movieRepository.findOne({ id: movieId });

    if (!movie) {
      throw new NotFoundException(`Movie with ID "${movieId}" not found`);
    }

    if (movie.stock === 0) {
      throw new BadRequestException(
        `Movie with ID "${movie.id}" is out of stock`,
      );
    }

    const rental = await this.rentalOrderRepository.rentMovie(
      movie,
      user.userId,
      toBeReturnedAt,
    );
    await movie.reload();
    const rentalOrder = plainToClass(RentalOrderDto, { movie, ...rental });

    return rentalOrder;
  }

  async returnMovie(rentalOrderId: number): Promise<ReturnOrderDto> {
    const rental = await this.getRentalOrderById(rentalOrderId);
    const returnOrder = await this.returnOrderRepository.returnMovie(rental);
    await rental.movie.reload();
    return plainToClass(ReturnOrderDto, {
      movie: rental.movie,
      ...returnOrder,
    });
  }
}
