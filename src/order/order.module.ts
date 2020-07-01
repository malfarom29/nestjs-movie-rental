import { Module } from '@nestjs/common';
import { RentalOrdersController } from './rental-orders/rental-orders.controller';

@Module({
  controllers: [RentalOrdersController]
})
export class OrderModule {}
