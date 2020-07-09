import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PurchaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  total: number;
}
