import { AuthModule } from './../auth/auth.module';
import { PaginatedSerializer } from './../shared/serializers/paginated-serializer';
import { MovieImageMapper } from './../shared/mappers/movie-image.mapper';
import { VoteRepository } from '../movies/repositories/votes.repository';
import { MovieSerializer } from './../shared/serializers/movie-serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RentalsController } from './controllers/orders/rentals.controller';
import { RentalOrdersService } from './controllers/orders/services/rental-orders.service';
import { RentalOrderRepository } from './controllers/orders/repositories/rental-order.repository';
import { OrderSerializer } from '../shared/serializers/order-serializer';
import { ReturnOrderRepository } from './controllers/orders/repositories/return-order.repository';
import { MovieRepository } from '../movies/repositories/movie.repository';
import { MoviesService } from 'src/movies/services/movies.service';
import { MovieAttachmentRepository } from 'src/movies/repositories/movie-attachment.repository';
import { PurchasesController } from './controllers/orders/purchases.controller';
import { PurchaseOrdersService } from 'src/customer/controllers/orders/services/purchase-orders.service';
import { PurchaseOrderRepository } from 'src/customer/controllers/orders/repositories/purchase-order.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      MovieRepository,
      MovieAttachmentRepository,
      VoteRepository,
      RentalOrderRepository,
      ReturnOrderRepository,
      PurchaseOrderRepository,
    ]),
  ],
  controllers: [RentalsController, PurchasesController],
  providers: [
    RentalOrdersService,
    PurchaseOrdersService,
    MoviesService,
    MovieSerializer,
    MovieImageMapper,
    PaginatedSerializer,
    OrderSerializer,
  ],
})
export class CustomerModule {}
