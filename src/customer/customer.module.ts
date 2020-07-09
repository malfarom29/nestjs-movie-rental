import { AuthModule } from './../auth/auth.module';
import { PaginatedSerializer } from './../shared/serializers/paginated-serializer';
import { MovieImageMapper } from './../shared/mappers/movie-image.mapper';
import { VoteRepository } from './../repositories/votes.repository';
import { MovieSerializer } from './../shared/serializers/movie-serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RentalsController } from './controllers/orders/rentals.controller';
import { RentalOrdersService } from '../services/rental-orders.service';
import { RentalOrderRepository } from '../repositories/rental-order.repository';
import { OrderSerializer } from '../shared/serializers/order-serializer';
import { ReturnOrderRepository } from '../repositories/return-order.repository';
import { MovieRepository } from '../repositories/movie.repository';
import { MoviesService } from 'src/services/movies.service';

@Module({
  imports: [
    AuthModule,
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
