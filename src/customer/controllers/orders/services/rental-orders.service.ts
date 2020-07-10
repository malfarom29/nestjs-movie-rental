import { OrderSerializer } from '../../../../shared/serializers/order-serializer';
import { RentalOrder } from '../entities/rental-order.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RentalOrderRepository } from '../repositories/rental-order.repository';

import { AuthorizedUser } from 'src/shared/interfaces/authorized-user.interface';
import { RentalOrderDto } from '../../../../shared/dtos/response/rental-order.dto';
import { plainToClass } from 'class-transformer';
import { ReturnOrderRepository } from '../repositories/return-order.repository';
import { PaginationDto } from 'src/shared/dtos/request/pagination.dto';
import { PaginatedDataDto } from 'src/shared/dtos/response/paginated-data.dto';
import { OrderResponseDto } from 'src/shared/dtos/response/order-response.dto';
import { ReturnOrderResponseDto } from 'src/shared/dtos/response/return-order-response.dto';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { RentMovieDto } from 'src/customer/dto/rent-movie.dto';
import { MoviesService } from '../../../../movies/services/movies.service';

@Injectable()
export class RentalOrdersService {
  constructor(
    @InjectRepository(RentalOrderRepository)
    private rentalOrderRepository: RentalOrderRepository,
    @InjectRepository(ReturnOrderRepository)
    private returnOrderRepository: ReturnOrderRepository,
    private moviesService: MoviesService,
    private serializer: OrderSerializer,
    private paginationSerializer: PaginatedSerializer<RentalOrderDto>,
  ) {}

  async getRentalOrderById(
    id: number,
    user: AuthorizedUser,
  ): Promise<RentalOrderDto> {
    const rental = await this.rentalOrderRepository.findOne(
      { id, userId: user.userId },
      { relations: ['movie'] },
    );

    if (!rental) {
      throw new NotFoundException(`Rental Order with ID "${id}" not found`);
    }

    const rentalOrder = plainToClass(RentalOrderDto, rental);

    return rentalOrder;
  }

  async rentMovie(
    rentMovieDto: RentMovieDto,
    user: AuthorizedUser,
  ): Promise<OrderResponseDto<RentalOrderDto>> {
    const { movieId, toBeReturnedAt } = rentMovieDto;
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
    user: AuthorizedUser,
  ): Promise<OrderResponseDto<ReturnOrderResponseDto>> {
    const rental = await this.findRentalOrder(rentalOrderId, user.userId);

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

  async getUserRentalOrders(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedDataDto<OrderResponseDto<RentalOrderDto>[]>> {
    const {
      data,
      totalCount,
    } = await this.rentalOrderRepository.getUserRentalOrders(
      userId,
      paginationDto,
    );

    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;

    const rentals: OrderResponseDto<RentalOrderDto>[] = data.map(order => {
      const dto = plainToClass(RentalOrderDto, order);
      return this.serializer.serialize<RentalOrderDto>(dto, order.movie);
    });

    return this.paginationSerializer.serialize(
      rentals,
      totalCount,
      page,
      limit,
    );
  }

  private findRentalOrder(id: number, userId: number): Promise<RentalOrder> {
    const rental = this.rentalOrderRepository.findOne({ id, userId });
    if (!rental) {
      throw new NotFoundException(`Rental Order with ID "${id}" not found`);
    }

    return rental;
  }
}
