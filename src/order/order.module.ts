import { Module } from '@nestjs/common';
import { RentalOrdersController } from './rental-orders/rental-orders.controller';
import { RentalOrdersService } from './rental-orders/rental-orders.service';
import { MoviesModule } from 'src/movies/movies.module';
import { MoviesService } from 'src/movies/movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalOrderRepository } from './repositories/rental-order.repository';
import { MovieRepository } from 'src/movies/repositories/movie.repository';
import { PassportModule } from '@nestjs/passport';
import { ReturnOrderRepository } from './repositories/return-order.repository';
import { MovieAttachmentRepository } from 'src/movies/repositories/movie-attachment.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      RentalOrderRepository,
      ReturnOrderRepository,
      MovieRepository,
      MovieAttachmentRepository,
    ]),
  ],
  controllers: [RentalOrdersController],
  providers: [RentalOrdersService, MoviesService],
})
export class OrderModule {}
