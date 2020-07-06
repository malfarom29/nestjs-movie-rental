import { OrderSerializer } from './../../shared/serializers/order-serializer';
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
import { RentalOrderDto } from '../../dtos/response/rental-order.dto';
import { plainToClass } from 'class-transformer';
import { ReturnOrderRepository } from '../../repositories/return-order.repository';
import { PaginationDto } from 'src/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/dtos/response/paginated-data.dto';
import { OrderResponseDto } from 'src/dtos/response/order-response.dto';
import { ReturnOrderResponseDto } from 'src/dtos/response/return-order-response.dto';

@Injectable()
export class RentalOrdersService {
  private serializer: OrderSerializer;
  constructor(
    @InjectRepository(RentalOrderRepository)
    private rentalOrderRepository: RentalOrderRepository,
    @InjectRepository(ReturnOrderRepository)
    private returnOrderRepository: ReturnOrderRepository,
    private moviesService: MoviesService,
  ) {
    this.serializer = new OrderSerializer();
  }

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
  ): Promise<OrderResponseDto<RentalOrderDto>> {
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

    return this.serializer.serialize<RentalOrderDto>(rentalOrder, movie);
  }

  async returnMovie(
    rentalOrderId: number,
  ): Promise<OrderResponseDto<ReturnOrderResponseDto>> {
    const rental = await this.findRentalOrder(rentalOrderId);
    if (!rental) {
      throw new NotFoundException(
        `Rental Order with ID "${rentalOrderId}" not found`,
      );
    }

    await this.returnOrderRepository.returnMovie(rental);
    const returnOrder = await this.returnOrderRepository.findOne(
      {
        rentalOrderId: rental.id,
      },
      { relations: ['rentalOrder'] },
    );
    await rental.movie.reload();

    return this.serializer.serializeWithRentalOrder(returnOrder);
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

  private findRentalOrder(id: number): Promise<RentalOrder> {
    return this.rentalOrderRepository.findOne({ id });
  }
}
