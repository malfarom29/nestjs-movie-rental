import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class RentalOrderDto {
  @Expose()
  id: number;

  @Expose()
  rentedAt: Date;

  @Expose()
  toBeReturnedAt: Date;

  @Expose()
  total: number;
}
