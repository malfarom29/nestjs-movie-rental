import { RentalOrder } from './../../database/entities/rental-order.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalOrderRepository } from '../../repositories/rental-order.repository';
import { MoviesService } from 'src/movies/movies.service';
import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { RentalOrderDto } from './dto/response/rental-order.dto';
import { plainToClass } from 'class-transformer';
import { ReturnOrderRepository } from '../../repositories/return-order.repository';
import { ReturnOrderDto } from './dto/response/return-order.dto';
import { MovieRepository } from 'src/repositories/movie.repository';
import { PaginationDto } from 'src/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/dtos/response/paginated-data.dto';

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
    const movie = await this.moviesService.findMovie(movieId);

    if (!movie.availability) {
      throw new BadRequestException(
        `Movie with ID "${movieId} is no longer available"`,
      );
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

  async getMyRentalOrders(
    user: AuthorizedUser,
    paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<RentalOrder>> {
    const data = await this.rentalOrderRepository.getMyRentalOrders(
      user.userId,
      paginationDto,
    );
    const paginatedOrders: PaginatedDataDto<RentalOrder> = {
      data: data[0],
      totalCount: data[1],
      page: paginationDto.page ? Number(paginationDto.page) : 1,
      limit: paginationDto.limit ? Number(paginationDto.limit) : 10,
    };

    return paginatedOrders;
  }
}
