import { IsDate, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RentalOrderDto {
  @IsDate()
  @Type(() => Date)
  toBeReturnedAt: Date;
}
