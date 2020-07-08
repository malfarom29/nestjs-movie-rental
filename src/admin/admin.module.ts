import { PassportModule } from '@nestjs/passport';
import { MoviesService } from './../user/admin/movies/movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalOrdersService } from './../customer/rental-orders.service';
import { Module, Logger } from '@nestjs/common';
import { RentalsController } from './controllers/orders/rentals.controllers';
import { RentalOrderRepository } from 'src/repositories/rental-order.repository';
import { ReturnOrderRepository } from 'src/repositories/return-order.repository';
import { OrderSerializer } from 'src/shared/serializers/order-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { MovieRepository } from 'src/repositories/movie.repository';
import { MovieAttachmentRepository } from 'src/repositories/movie-attachment.repository';
import { AdminMovieImageMapper } from 'src/shared/mappers/admin-movie-image.mapper';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      MovieRepository,
      MovieAttachmentRepository,
      RentalOrderRepository,
      ReturnOrderRepository,
    ]),
  ],
  controllers: [RentalsController],
  providers: [
    Logger,
    RentalOrdersService,
    MoviesService,
    OrderSerializer,
    PaginatedSerializer,
    MovieSerializer,
    AdminMovieImageMapper,
  ],
})
export class AdminModule {}
