import { AuthModule } from './../auth/auth.module';
import { UserRepository } from './../repositories/user.repository';
import { UserService } from '../services/user.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalOrdersService } from '../services/rental-orders.service';
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
import { UsersController } from './controllers/users/users.controller';
import { UserSerializer } from 'src/shared/serializers/user-serializer';
import { MoviesController } from './controllers/movies/movies.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserRepository,
      MovieRepository,
      MovieAttachmentRepository,
      RentalOrderRepository,
      ReturnOrderRepository,
    ]),
  ],
  controllers: [RentalsController, UsersController, MoviesController],
  providers: [
    Logger,
    UserService,
    RentalOrdersService,
    UserSerializer,
    OrderSerializer,
    MovieSerializer,
    PaginatedSerializer,
    AdminMovieImageMapper,
  ],
})
export class AdminModule {}
