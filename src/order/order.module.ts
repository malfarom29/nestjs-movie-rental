import { PurchaseOrderRepository } from '../repositories/purchase-order.repository';
import { Module } from '@nestjs/common';
import { RentalOrdersController } from './rental-orders/rental-orders.controller';
import { RentalOrdersService } from './rental-orders/rental-orders.service';
import { MoviesService } from 'src/movies/movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalOrderRepository } from '../repositories/rental-order.repository';
import { MovieRepository } from 'src/repositories/movie.repository';
import { PassportModule } from '@nestjs/passport';
import { ReturnOrderRepository } from '../repositories/return-order.repository';
import { MovieAttachmentRepository } from 'src/repositories/movie-attachment.repository';
import { PurchaseOrdersController } from './purchase-orders/purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders/purchase-orders.service';
import { MovieImageMapper } from 'src/shared/mappers/movie-image.mapper';
import { VoteRepository } from 'src/repositories/votes.repository';
import { PaginatedSerializer } from 'src/shared/serializers/paginated-serializer';
import { MovieSerializer } from 'src/shared/serializers/movie-serializer';
import { OrderSerializer } from 'src/shared/serializers/order-serializer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      RentalOrderRepository,
      ReturnOrderRepository,
      PurchaseOrderRepository,
      MovieRepository,
      MovieAttachmentRepository,
      VoteRepository,
    ]),
  ],
  controllers: [RentalOrdersController, PurchaseOrdersController],
  providers: [
    RentalOrdersService,
    MoviesService,
    PurchaseOrdersService,
    MovieImageMapper,
    PaginatedSerializer,
    MovieSerializer,
    OrderSerializer,
  ],
})
export class OrderModule {}
