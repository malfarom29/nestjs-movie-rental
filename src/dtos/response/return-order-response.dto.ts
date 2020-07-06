import { RentalOrderDto } from './rental-order.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReturnOrderResponseDto {
  @Expose()
  rentalOrder: RentalOrderDto;

  @Expose()
  createdAt: Date;

  @Expose()
  pentalty: number;
}
