import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PurchaseResponseDto {
  @Expose()
  quantity: number;

  @Expose()
  total: number;
}
