import { AuthModule } from './../auth/auth.module';
import { UserRepository } from '../users/repositories/user.repository';
import { UserService } from '../users/services/user.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalOrdersService } from '../customer/controllers/orders/services/rental-orders.service';
import { Module, Logger } from '@nestjs/common';
import { RentalsController } from './controllers/orders/rentals.controllers';
import { RentalOrderRepository } from 'src/customer/controllers/orders/repositories/rental-order.repository';
import { ReturnOrderRepository } from 'src/customer/controllers/orders/repositories/return-order.repository';
import { OrderSerializer } from 'src/shared/serializers/order-serializer';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { MovieRepository } from 'src/movies/repositories/movie.repository';
import { MovieAttachmentRepository } from 'src/movies/repositories/movie-attachment.repository';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';
import { UsersController } from './controllers/users/users.controller';
import { UserSerializer } from 'src/shared/serializers/user-serializer';
import { MoviesController } from './controllers/movies/movies.controller';
import { MoviesService } from 'src/movies/services/movies.service';
import { VoteRepository } from 'src/movies/repositories/votes.repository';
import { MovieImageMapper } from 'src/shared/mappers/movie-image.mapper';
import { PurchasesController } from './controllers/orders/purchases.controller';
import { PurchaseOrdersService } from 'src/customer/controllers/orders/services/purchase-orders.service';
import { PurchaseOrderRepository } from 'src/customer/controllers/orders/repositories/purchase-order.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserRepository,
      MovieRepository,
      MovieAttachmentRepository,
      RentalOrderRepository,
      ReturnOrderRepository,
      PurchaseOrderRepository,
      VoteRepository,
    ]),
  ],
  controllers: [
    PurchasesController,
    RentalsController,
    UsersController,
    MoviesController,
  ],
  providers: [
    Logger,
    UserService,
    MoviesService,
    RentalOrdersService,
    PurchaseOrdersService,
    UserSerializer,
    OrderSerializer,
    MovieSerializer,
    PaginatedSerializer,
    MovieImageMapper,
  ],
})
export class AdminModule {}
