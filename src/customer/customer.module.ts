import { PaginatedSerializer } from './../shared/serializers/paginated-serializer';
import { MovieImageMapper } from './../shared/mappers/movie-image.mapper';
import { VoteRepository } from './../repositories/votes.repository';
import { MovieSerializer } from './../shared/serializers/movie-serializer';
import { MoviesService } from './../movies/movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { RentalsController } from './controllers/orders/rentals.controller';
import { RentalOrdersService } from './rental-orders.service';
import { RentalOrderRepository } from '../repositories/rental-order.repository';
import { OrderSerializer } from '../shared/serializers/order-serializer';
import { ReturnOrderRepository } from '../repositories/return-order.repository';
import { MovieRepository } from '../repositories/movie.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      MovieRepository,
      VoteRepository,
      RentalOrderRepository,
      ReturnOrderRepository,
    ]),
  ],
  controllers: [RentalsController],
  providers: [
    RentalOrdersService,
    MoviesService,
    MovieSerializer,
    MovieImageMapper,
    PaginatedSerializer,
    OrderSerializer,
  ],
})
export class CustomerModule {}
