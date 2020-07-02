import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MovieResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  stock: number;

  @Expose()
  onRent: number;

  @Expose()
  salePrice: number;

  @Expose()
  rentalPrice: number;

  @Expose()
  availability: number;

  @Expose()
  imageUrl: string;
}
